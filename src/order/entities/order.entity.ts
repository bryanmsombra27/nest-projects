import { OrderItem } from '../../order-items/entities/order-item.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Status {
  PENDING = 'PENDING',
  PAID = 'PAID',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

@Entity({
  name: 'Orders',
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  //   RELACIONES
  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.id, { nullable: false })
  orderItems: OrderItem[];
}
