import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { PaginationDTo } from '../common/dto/pagination';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,

    private readonly productService: ProductsService,
  ) {}

  async create(createStockDto: CreateStockDto) {
    const { productId, quantity } = createStockDto;
    const product = await this.productService.findOne(productId);

    const stockInstance = this.stockRepository.create({
      product,
      quantity,
    });
    const stock = await this.stockRepository.save(stockInstance);

    return {
      message: 'Stock creado con exito!',
      stock,
    };
  }

  async findAll(paginationDto: PaginationDTo) {
    const { limit: take, page: skip, search } = paginationDto;
    const page = skip ?? 1;
    const limit = take ?? 10;
    const offset = (+page - 1) * limit;
    const clause: FindManyOptions<Stock> = {
      where: {
        isActive: true,
      },
      take: limit,
      skip: offset,
    };

    if (search) {
      clause.where = {
        ...clause.where,
        product: {
          name: ILike(`%${search}%`),
        },
      };
    }

    const [stocks, count] = await this.stockRepository.findAndCount(clause);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(count / limit);

    return {
      message: 'Stocks activos',
      count,
      actualPage: page,
      lastPage: totalPages,
      stocks,
    };
  }

  async findOne(id: number) {
    const stock = await this.stockRepository.findOne({
      where: {
        isActive: true,
        id,
      },
    });
    if (!stock) throw new NotFoundException('Stock no encontrado');

    return stock;
  }

  async update(id: number, updateStockDto: UpdateStockDto) {
    const { quantity } = updateStockDto;

    const stock = await this.findOne(id);

    stock.quantity = quantity ?? stock.quantity;

    await this.stockRepository.save(stock);

    return {
      message: 'Stock actualizado con exito!',
      stock,
    };
  }

  async remove(id: number) {
    const stock = await this.findOne(id);

    stock.isActive = false;

    await this.stockRepository.save(stock);

    return {
      message: 'Stock eliminado con exito!',
      stock,
    };
  }
}
