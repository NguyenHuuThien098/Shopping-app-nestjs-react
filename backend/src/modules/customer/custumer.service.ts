import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Customer } from '../../entities/customer.entity';
import { User, UserRole } from '../../entities/user.entity';
import { CustomerRegisterDto } from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private dataSource: DataSource,
        private jwtService: JwtService
    ) { }

    async register(registerDto: CustomerRegisterDto): Promise<{ user: Partial<User>; access_token: string }> {
        const { username, email, password, fullName, country, contactName } = registerDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Kiểm tra xem username hoặc email đã tồn tại chưa
        const existingUser = await this.userRepository.findOne({
            where: [{ username }, { email }],
        });

        if (existingUser) {
            throw new ConflictException('Username hoặc email đã tồn tại');
        }

        // Tạo người dùng mới với role CUSTOMER
        const user = this.userRepository.create({
            username,
            email,
            password: hashedPassword,
            fullName,
            role: UserRole.CUSTOMER,
            isActive: true,
        });

        const savedUser = await this.userRepository.save(user);

        // Tạo thông tin khách hàng mới
        const customer = this.customerRepository.create({
            Name: fullName,
            ContactName: contactName || username,
            Country: country,
            UserId: savedUser.id,
        });

        await this.customerRepository.save(customer);

        // Tạo JWT token
        const payload = { sub: savedUser.id, username: savedUser.username, role: savedUser.role };
        const access_token = this.jwtService.sign(payload);

        // Không trả về password trong response
        const { password: _, ...userWithoutPassword } = savedUser;

        return {
            user: userWithoutPassword,
            access_token,
        };
    }

    async getCustomerProfile(userId: number): Promise<any> {
        const customer = await this.customerRepository.findOne({
            where: { UserId: userId },
            relations: ['user'],
        });

        if (!customer) {
            throw new NotFoundException('Không tìm thấy thông tin khách hàng');
        }

        // Loại bỏ mật khẩu từ thông tin user
        const { password, refreshToken, ...userInfo } = customer.user;

        return {
            ...customer,
            user: userInfo
        };
    }

    // show danh sách đơn hàng có tổng giá trị của đơn lớn hơn giá trị trung bình của tất cả đơn hàng
    async getTopSpendingCustomersWithRelations(): Promise<any[]> {
        // Lấy tổng doanh thu
        const totalRevenueResult = await this.dataSource
            .createQueryBuilder()
            .select(`SUM(od."Price" * od."Quantity")`, `totalRevenue`)
            .from(`orderdetails`, `od`)
            .getRawOne();

        const totalRevenue = parseFloat(totalRevenueResult.totalRevenue) || 0;
        const thresholdAmount = totalRevenue * 0.1;

        // Sử dụng Repository API của TypeORM với relations
        const customers = await this.customerRepository.find({
            relations: [`orders`, `orders.orderDetails`],
        });

        // Xử lý dữ liệu để tính tổng chi tiêu
        const customersWithSpending = customers.map(customer => {
            let totalSpent = 0;

            // Tính tổng chi tiêu của mỗi khách hàng
            customer.orders?.forEach(order => {
                order.orderDetails?.forEach(detail => {
                    totalSpent += detail.Price * detail.Quantity;
                });
            });

            const percentageOfTotal = (totalSpent / totalRevenue) * 100;

            return {
                customerId: customer.id,
                customerName: customer.Name,
                contactName: customer.ContactName,
                country: customer.Country,
                totalSpent,
                percentageOfTotal
            };
        });

        // Lọc khách hàng chi tiêu > 10% và sắp xếp
        return customersWithSpending
            .filter(customer => customer.totalSpent > thresholdAmount)
            .sort((a, b) => b.totalSpent - a.totalSpent);
    }

    // show danh sách các đơn hàng gồm: thông tin customer, shipper, tổng tiền của đơn hàng
    async getOrdersWithDetails() {
        return this.dataSource
        .createQueryBuilder()
        .select(`o."id"`, `orderId`)
        .addSelect(`o."OrderDate"`, `orderDate`)
        .addSelect(`c."Name"`, `customerName`)
        .addSelect(`s."Name"`, `shipperName`)
        .addSelect(`SUM(od."Price" * od."Quantity")`, `totalAmount`)
        .from(`orders`, `o`)
        .leftJoin(`customers`, `c`, `o."CustomerId" = c.id`)
        .leftJoin(`shippers`, `s`, `o."ShipperId" = s.id`)
        .leftJoin(`orderdetails`, `od`, `o.id = od."OrderId"`)
        .groupBy(`o.id, o."OrderDate", c."Name", s."Name"`)
        .orderBy(`o."OrderDate"`, `DESC`)
        .getRawMany();
    };
}