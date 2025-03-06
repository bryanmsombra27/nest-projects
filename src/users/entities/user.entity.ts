import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Role } from '../../roles/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'Users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @ManyToOne(() => Role, (role) => role.id, {
    nullable: false,
    eager: true,
  })
  role: Role;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id, {
    nullable: true,
  })
  warehouse: Warehouse;
}
