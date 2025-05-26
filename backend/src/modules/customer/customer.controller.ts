import { Controller, Get, Post, Body, UseGuards, Request, HttpStatus, Query } from '@nestjs/common';
import { CustomerService } from './custumer.service';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import {TopCustomerResponseDto, OrderInfoResponseDto} from './dto/customer.dto';
import { CustomerRegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { UserRole } from '../../entities/user.entity';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Post('register')
    @ApiOperation({ summary: 'Đăng ký tài khoản khách hàng mới' })
    @ApiResponse({ status: 201, description: 'Đăng ký khách hàng thành công' })
    @ApiResponse({ status: 409, description: 'Username hoặc email đã tồn tại' })
    async register(@Body() registerDto: CustomerRegisterDto) {
        return this.customerService.register(registerDto);
    }
      @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.CUSTOMER)
    @ApiBearerAuth()
    @Get('profile')
    @ApiOperation({ summary: 'Xem thông tin chi tiết của khách hàng' })
    @ApiResponse({ status: 200, description: 'Trả về thông tin khách hàng' })
    async getCustomerProfile(@Request() req) {
        return this.customerService.getCustomerProfile(req.user.id);
    }

    @Get('top-spending')
    @ApiOperation({ summary: 'Lấy danh sách khách hàng chi tiêu hơn 10% tổng doanh thu' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Danh sách khách hàng chi tiêu nhiều',
        type: [TopCustomerResponseDto]
    })
    @ApiQuery({
        name: 'threshold',
        required: false,
        type: Number,
        description: 'Ngưỡng phần trăm tối thiểu (mặc định là 10)'
    })
    async getTopSpendingCustomers() {
        const customers = await this.customerService.getTopSpendingCustomersWithRelations();
        return {
            success: true,
            data: customers,
            message: 'Lấy danh sách khách hàng chi tiêu nhiều thành công',
        };
    }

    @Get('orders')
    @ApiOperation({ summary: 'Lấy thông tin đơn hàng bao gồm tên khách hàng, tên shipper, và tổng tiền' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Danh sách thông tin đơn hàng',
        type: [OrderInfoResponseDto]
    })
    async getOrdersInfo() {
        const orders = await this.customerService.getOrdersWithDetails();
        return {
            success: true,
            data: orders,
            message: 'Lấy thông tin đơn hàng thành công',
        };
    }
}