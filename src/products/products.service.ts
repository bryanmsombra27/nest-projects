import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  // LOGER PROPIO DE NEST, SE ESPECIFICA LA CLASE DONDE SERA LLAMADO
  private readonly logger = new Logger('ProductsService');

  private showDBErrors(error: any) {
    console.log(error);

    if (error.code == '23505') throw new BadRequestException(error.detail);

    // LOGER PROPIO DE NEST
    this.logger.error(error);

    throw new InternalServerErrorException('erorr interno');
  }

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // CREA UNA INSTANCIA QUE SERA GUARDADA EN LA DB(NO GUARDA AUTOMATICAMENTE EN DB)
      const product = this.productRepository.create(createProductDto);

      // GUARDA EL REGISTRO EN DB
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.showDBErrors(error);
    }
  }

  findAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;
    return this.productRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // product = await this.productRepository.findOneBy({ slug: term });
      const queryBuilder = this.productRepository.createQueryBuilder();

      product = await queryBuilder
        .where('UPPER(title)=:title or slug=:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }

    if (!product) throw new NotFoundException(`product ${term} not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // preparaando objeto para actualizarlo
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });
    if (!product)
      throw new NotFoundException(`product with id ${id} not found`);

    // puede regresarse una promesa ya que nest en automatico va a esperar a que termine para retornar una respuesta una vez se complete la promesa
    // return this.productRepository.save(product);

    try {
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.showDBErrors(error);
    }

    // actualizando el registro
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    if (!product)
      throw new NotFoundException(`product with id:${product.id}  not found `);

    await this.productRepository.remove(product);
    // await this.productRepository.delete(id);

    return 'product was deleted!';
  }
}
