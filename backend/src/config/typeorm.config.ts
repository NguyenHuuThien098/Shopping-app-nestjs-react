import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../entities/user.entity';
import { Customer } from '../entities/customer.entity';
import { Product } from '../entities/product.entity';
import { Shipper } from '../entities/shipper.entity';
import { Order } from '../entities/order.entity';
import { OrderDetail } from '../entities/order-detail.entity';

dotenv.config();

const dataSource = new DataSource({
  // type: 'postgres',
  // host: process.env.DB_HOST || 'localhost',
  // port: parseInt(process.env.DB_PORT || '5432'),
  // username: process.env.DB_USERNAME || 'postgres',
  // password: process.env.DB_PASSWORD || 'your_password',
  // database: process.env.DB_DATABASE || 'myshop',
  // entities: [User, Customer, Product, Shipper, Order, OrderDetail],
  // migrations: ['src/migrations/*.ts'],
  // synchronize: false,
  // logging: true,

  type: 'postgres',
  host: process.env.DB_HOST ,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_DATABASE ,
  entities: [User, Customer, Product, Shipper, Order, OrderDetail],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

export default dataSource;