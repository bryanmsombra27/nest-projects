import { Order } from '../../order/entities/order.entity';
import { Product } from '../../products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'OrderItems',
})
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  //   RELACIONES
  @ManyToOne(() => Order, (order) => order.id, { nullable: false })
  order: Order;

  @ManyToOne(() => Product, (product) => product.id, { nullable: false })
  product: Product;
}
