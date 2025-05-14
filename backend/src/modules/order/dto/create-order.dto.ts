import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderDetailDto {
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: number;

  @IsNotEmpty({ message: 'Quantity is required' })
  quantity: number;

  @IsNotEmpty({ message: 'Price is required' })
  price: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  orderDetails: OrderDetailDto[];
}