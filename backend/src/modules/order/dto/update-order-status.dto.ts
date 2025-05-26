// import { IsEnum, IsNotEmpty, IsOptional, IsObject, IsNumber, Min, IsDateString } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';
// // import { OrderStatus } from '../../../entities/order.entity';
// import { Type } from 'class-transformer';
// import { OrderTracking } from '../../../entities/order-tracking.entity';

// export class UpdateOrderStatusDto {
//   @ApiProperty({ 
//     enum: OrderStatus,
//     description: 'Trạng thái mới của đơn hàng' 
//   })
//   @IsEnum(OrderStatus)
//   @IsNotEmpty()
//   status: OrderStatus;
  
//   @ApiProperty({ 
//     required: false, 
//     description: 'Ghi chú khi cập nhật trạng thái' 
//   })
//   @IsOptional()
//   note?: string;
// }

// export class ShipperUpdateStatusDto {
//   @ApiProperty({ 
//     enum: [OrderStatus.SHIPPING, OrderStatus.DELIVERED],
//     description: 'Trạng thái đơn hàng (chỉ được phép SHIPPING hoặc DELIVERED)' 
//   })
//   @IsEnum(OrderStatus, { 
//     message: 'Trạng thái chỉ có thể là đang giao hoặc đã giao'
//   })
//   @IsNotEmpty()
//   status: OrderStatus;
  
//   @ApiProperty({ 
//     required: false, 
//     description: 'Ghi chú khi cập nhật trạng thái' 
//   })  @IsOptional()
//   note?: string;
  
//   @ApiProperty({
//     required: false,
//     description: 'Vị trí hiện tại của shipper'
//   })
//   @IsOptional()
//   @IsObject()
//   location?: { lat: number; lng: number };
// }

// export class AssignShipperDto {
//   @ApiProperty({
//     description: 'ID của shipper được phân công',
//     example: 1
//   })
//   @IsNumber()
//   @IsNotEmpty()
//   shipperId: number;
// }

// export class OrderFilterDto {
//   @ApiProperty({ 
//     enum: OrderStatus, 
//     required: false,
//     description: 'Lọc theo trạng thái đơn hàng' 
//   })
//   @IsOptional()
//   @IsEnum(OrderStatus)
//   status?: OrderStatus;
  
//   @ApiProperty({ 
//     required: false,
//     description: 'Lọc theo ID khách hàng',
//     example: 1
//   })
//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   customerId?: number;
  
//   @ApiProperty({ 
//     required: false,
//     description: 'Lọc theo ID shipper',
//     example: 1
//   })
//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   shipperId?: number;
  
//   @ApiProperty({ 
//     required: false, 
//     default: 1,
//     description: 'Số trang' 
//   })
//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   @Type(() => Number)
//   page?: number = 1;
  
//   @ApiProperty({ 
//     required: false, 
//     default: 10,
//     description: 'Số lượng đơn hàng trên mỗi trang' 
//   })
//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   @Type(() => Number)
//   limit?: number = 10;
  
//   @ApiProperty({ 
//     required: false,
//     description: 'Ngày bắt đầu (YYYY-MM-DD)',
//     example: '2025-01-01'
//   })
//   @IsOptional()
//   @IsDateString()
//   startDate?: string;
  
//   @ApiProperty({ 
//     required: false,
//     description: 'Ngày kết thúc (YYYY-MM-DD)',
//     example: '2025-12-31'
//   })
//   @IsOptional()
//   @IsDateString()
//   endDate?: string;
// }

// export class ShipperOrderFilterDto {
//   @ApiProperty({ 
//     enum: OrderStatus, 
//     required: false,
//     description: 'Lọc theo trạng thái đơn hàng' 
//   })
//   @IsOptional()
//   @IsEnum(OrderStatus)
//   status?: OrderStatus;
  
//   @ApiProperty({ 
//     required: false, 
//     default: 1,
//     description: 'Số trang' 
//   })
//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   @Type(() => Number)
//   page?: number = 1;
  
//   @ApiProperty({ 
//     required: false, 
//     default: 10,
//     description: 'Số lượng đơn hàng trên mỗi trang' 
//   })
//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   @Type(() => Number)
//   limit?: number = 10;
// }

// export class OrderTrackingResponseDto {
//   @ApiProperty()
//   order: any;

//   @ApiProperty({ type: [OrderTracking] })
//   trackingHistory: OrderTracking[];
// }

// export class PaginationDto {
//   @ApiProperty({ 
//     required: false, 
//     default: 1,
//     description: 'Số trang' 
//   })
//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   @Type(() => Number)
//   page?: number = 1;
  
//   @ApiProperty({ 
//     required: false, 
//     default: 10,
//     description: 'Số lượng đơn hàng trên mỗi trang' 
//   })
//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   @Type(() => Number)
//   limit?: number = 10;
// }
