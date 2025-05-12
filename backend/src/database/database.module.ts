import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Customer } from '../entities/customer.entity';
import { Product } from '../entities/product.entity';
import { Shipper } from '../entities/shipper.entity';
import { Order } from '../entities/order.entity';
import { OrderDetail } from '../entities/order-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: 5432,
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Customer, Product, Shipper, Order, OrderDetail],
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}