import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_tracking')
export class OrderTracking {
  @PrimaryGeneratedColumn({ })
  id: number;

  @Column({ name: 'OrderId', type: 'int' })
  OrderId: number;

  @Column({ name: 'status', type: 'enum', enum: ['pending', 'shipped', 'delivered'] })
  status: string;

  @Column({ name: 'note', type: 'text', nullable: true })
  note: string;

  @Column({ name: 'UpdatedById', type: 'int' })
  UpdatedById: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @Column({ name: 'location', type: 'json', nullable: true })
  location: any;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'OrderId' })
  order: Order;
}