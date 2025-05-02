import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { Shipper } from './shipper.entity';
import { OrderDetail } from './order-detail.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  CustomerId: number;

  @Column()
  OrderDate: Date;

  @Column()
  ShipperId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Customer, customer => customer.orders)
  @JoinColumn({ name: 'CustomerId' })
  customer: Customer;

  @ManyToOne(() => Shipper, shipper => shipper.orders)
  @JoinColumn({ name: 'ShipperId' })
  shipper: Shipper;

  @OneToMany(() => OrderDetail, orderDetail => orderDetail.order)
  orderDetails: OrderDetail[];
}