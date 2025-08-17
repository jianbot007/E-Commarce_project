import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderDetails } from './order_details.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  user_name: string;

  @Column()
  password: string;

  @Column()
  mobile_no: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @OneToMany(() => OrderDetails, order => order.user)
  orders: OrderDetails[];
}
