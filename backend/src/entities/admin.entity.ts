import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  UserId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}