import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  storeName?: string;
}
