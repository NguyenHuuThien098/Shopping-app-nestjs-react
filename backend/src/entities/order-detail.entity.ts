import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('orderdetails')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  OrderId: number;

  @Column()
  ProductId: number;

  @Column()
  Quantity: number;

  @Column()
  Price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Order, order => order.orderDetails)
  @JoinColumn({ name: 'OrderId' })
  order: Order;

  @ManyToOne(() => Product, product => product.orderDetails)
  @JoinColumn({ name: 'ProductId' })
  product: Product;
}