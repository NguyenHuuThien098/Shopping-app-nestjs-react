import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './custumer.service';
import { Customer } from '../../entities/customer.entity';
import { Order } from '../../entities/order.entity';
import { OrderDetail } from '../../entities/order-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Order, OrderDetail]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}