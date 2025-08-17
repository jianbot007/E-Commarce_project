import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Admin } from './admin.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @OneToOne(() => Admin, (admin) => admin.profile, { onDelete: 'CASCADE' })
  admin: Admin;
}
