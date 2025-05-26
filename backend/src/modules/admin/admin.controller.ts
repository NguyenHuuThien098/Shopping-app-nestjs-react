import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { UserRole } from '../../entities/user.entity';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/login.dto';
import { AdminRegisterDto } from './dto/register.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or not an admin' })
  async login(@Body() loginDto: AdminLoginDto) {
    return this.adminService.loginAdmin(loginDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard data' })
  @ApiResponse({ status: 200, description: 'Return dashboard data' })
  async getDashboard() {
    return this.adminService.getDashboardData();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post('register')
  @ApiOperation({ summary: 'Register a new admin (only by existing admin)' })
  @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  @ApiResponse({ status: 409, description: 'Username or email already exists' })
  async registerAdmin(@Body() registerDto: AdminRegisterDto) {
    return this.adminService.registerAdmin(registerDto);
  }
}