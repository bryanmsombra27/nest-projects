import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/data';

@Injectable()
export class SeedService {
  async execute() {
    await this.insertProducts();

    return 'seed executed !';
  }
  constructor(private readonly productService: ProductsService) {}

  private async insertProducts() {
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach((item) => {
      insertPromises.push(this.productService.create(item));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
