import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'; // Đã thay đổi sang bcryptjs
import { User, UserRole } from '../../entities/user.entity'; // Đảm bảo import đúng
import { Customer } from '../../entities/customer.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; access_token: string }> {
    const { username, email, password, fullName } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Kiểm tra xem username hoặc email đã tồn tại chưa
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Tạo người dùng mới
    const user = this.userRepository.create({
      username,
      email,
      password:hashedPassword,
      fullName,
      role: UserRole.CUSTOMER,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    // Tạo khách hàng tương ứng trong bảng customers
    const customer = this.customerRepository.create({
      Name: fullName,
      ContactName: username,
      Country: 'Unknown', // Bạn có thể thay đổi giá trị mặc định này
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

  async login(loginDto: LoginDto): Promise<{ user: Partial<User>; access_token: string }> {
    // Tìm user theo username
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Cập nhật thời gian đăng nhập và refreshToken
    user.lastLogin = new Date();
    const payload = { sub: user.id, username: user.username, role: user.role };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    // Tạo JWT token
    const access_token = this.jwtService.sign(payload);

    // Không trả về password trong response
    const { password, ...userWithoutPassword } = user;
    return { 
      user: userWithoutPassword,
      access_token 
    };
  }

  async logout(userId: number): Promise<{ message: string }> {
    // Tìm user và xóa refreshToken
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (user) {
      user.refreshToken = ''; // Sử dụng chuỗi rỗng thay vì null
      await this.userRepository.save(user);
    }

    return { message: 'Logout successful' };
  }

  async findById(id: number): Promise<User | null> { // Đảm bảo User được import
    return this.userRepository.findOne({ where: { id } });
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.findById(payload.sub);
    if (!user || !user.isActive) {
      return null;
    }
    return { id: user.id, username: user.username, role: user.role };
  }
}