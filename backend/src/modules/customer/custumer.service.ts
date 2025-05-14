import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Customer } from '../../entities/customer.entity';
// import { Order } from '../../entities/order.entity';
// import { OrderDetail } from '../../entities/order-detail.entity';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
        private dataSource: DataSource
    ) { }
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