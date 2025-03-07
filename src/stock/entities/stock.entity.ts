import { Product } from '../../products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'Stock',
})
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 0 })
  commit: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  //   RELACIONES
  @ManyToOne(() => Product, (product) => product.id)
  product: Product;
}
