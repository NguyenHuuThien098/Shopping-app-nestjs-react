import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '../../entities/admin.entity';
import { User, UserRole } from '../../entities/user.entity';
import { AdminRegisterDto } from './dto/register.dto';
import { AdminLoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async getDashboardData() {
    // Ví dụ về dữ liệu dashboard có thể trả về
    const adminCount = await this.userRepository.count({ where: { role: UserRole.ADMIN } });
    
    return {
      adminCount,
      message: 'Welcome to the admin dashboard',
      stats: {
        totalAdmins: adminCount,
        // Có thể thêm thống kê khác ở đây
      }
    };
  }
  
  async loginAdmin(loginDto: AdminLoginDto) {
    const { username, password } = loginDto;
    
    // Tìm user theo username
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Kiểm tra role
    if (user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can log in here');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
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
    const { password: _, ...userWithoutPassword } = user;
    return { 
      user: userWithoutPassword,
      access_token 
    };
  }

  async registerAdmin(registerDto: AdminRegisterDto) {
    const { username, email, password, fullName, department, position } = registerDto;
    
    // Kiểm tra xem username hoặc email đã tồn tại chưa
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Tạo người dùng mới với role admin
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: UserRole.ADMIN,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    // Tạo admin mới
    const admin = this.adminRepository.create({
      UserId: savedUser.id,
      // Có thể thêm các thông tin khác về admin ở đây
    });

    await this.adminRepository.save(admin);

    // Loại bỏ mật khẩu khỏi kết quả trả về
    const { password: _, ...result } = savedUser;
    
    return {
      message: 'Admin registered successfully',
      user: result,
    };
  }
}