import { ApiProperty } from "@nestjs/swagger";

export class TopCustomerResponseDto {
    @ApiProperty({ description: 'ID của khách hàng', example: '1' })
    customerId: number;

    @ApiProperty({ description: 'Tên khách hàng', example: 'Nguyễn Văn A' })
    customerName: string;

    @ApiProperty({ description: 'Tên liên hệ của khách hàng', example: 'Văn A' })
    contactName: string;

    @ApiProperty({ description: 'Quốc Gia', example: 'Hà Nội' })
    country: string;

    @ApiProperty({ description: 'Tổng tiền của khách hàng', example: '1000000' })
    totalSpent: number;

    @ApiProperty({ description: 'Phần trăm tổng tiền của khách hàng', example: '10' })
    percentageOfTotal: number;
}

export class OrderInfoResponseDto {
    @ApiProperty({ description: 'ID của khách hàng', example: '1' })
    orderID: number;

    @ApiProperty({ description: 'Ngày đặt hàng', example: '2022-01-01' })
    orderDate: Date;

    @ApiProperty({ description: 'Tên khách hàng', example: 'Nguyễn Văn A' })
    customerName: string;

    @ApiProperty({ description: 'Tên shipper', example: 'Shipper A ' })
    shipperName: string;

    @ApiProperty({ description: 'Tổng tiền của đơn hàng', example: '1000000' })
    totalAmount: number;
}

