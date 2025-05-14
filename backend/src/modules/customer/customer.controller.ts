import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { CustomerService } from './custumer.service';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import {TopCustomerResponseDto, OrderInfoResponseDto} from './dto/customer.dto';

// class TopCustomersQueryDto {
//     percentageThreshold?: number;
// }

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

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