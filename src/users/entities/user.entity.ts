import { Role } from '../../roles/entities/role.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
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

  //CAMPOS PENDIENTES DE AGREGAR   PENDIENTES DE RELACIONES
  @OneToOne(() => Role)
  role: Role;
  //   warehouseId: number;
}
