import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'products',
})
export class Product {
  @ApiProperty({
    example: 'cdaxaa-zascfasda-ada',
    description: 'Product ID ',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-shirt',
    description: 'product title',
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 5.99,
    description: 'product price',
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  // otra forma de definir tipos en columnas
  @ApiProperty({
    example: 'confortable tshirt',
    description: 'product description',
    default: null,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 'T_shirt',
    description: 'for seo routes',
  })
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty({
    example: 3,
    description: 'product avaiability',
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: '[s,m,l,xl,xxl]',
    description: 'product sizes',
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'men',
    description: 'gender for product',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: '[okso,keso,kaso]',
    description: 'product tags',
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, {
    eager: true,
  })
  user: User;

  // decorador que ejecuta antes de la insercion a db
  @BeforeInsert()
  checkSlug() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
