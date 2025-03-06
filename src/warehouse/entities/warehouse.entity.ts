import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'warehouses',
})
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
}
