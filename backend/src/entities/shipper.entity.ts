import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('shippers')
export class Shipper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  shipper_code: number;

  @OneToMany(() => Order, order => order.shipper)
  orders: Order[];
}