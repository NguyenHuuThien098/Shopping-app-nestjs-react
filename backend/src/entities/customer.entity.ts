import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Name: string;

  @Column()
  ContactName: string;

  @Column()
  Country: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  UserId: number;

  @ManyToOne(() => User, user => user.customers)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @OneToMany(() => Order, order => order.customer)
  orders: Order[];
}