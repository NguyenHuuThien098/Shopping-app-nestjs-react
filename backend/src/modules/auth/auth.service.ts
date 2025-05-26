import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../../entities/user.entity'; 
import { Customer } from '../../entities/customer.entity';
import { LoginDto } from './dto/login.dto';
import { Admin } from '../../entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  // Đã chuyển phương thức register sang CustomerService
  
  // Đã chuyển phương thức registerAdmin sang AdminService

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

  async findById(id: number): Promise<User | null> { 
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