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
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities';
import { User } from 'src/auth/entities/user.entity';

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

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((item) => item.url),
    };
  }

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      // CREA UNA INSTANCIA QUE SERA GUARDADA EN LA DB(NO GUARDA AUTOMATICAMENTE EN DB)
      const product = this.productRepository.create({
        images: images.map((item) =>
          this.productImageRepository.create({ url: item }),
        ),
        ...productDetails,
        user,
      });

      // GUARDA EL REGISTRO EN DB
      await this.productRepository.save(product);

      return { images: images, ...product };
    } catch (error) {
      this.showDBErrors(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });

    return products.map((product) => ({
      ...product,
      images: product.images.map((img) => img.url),
    }));
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // product = await this.productRepository.findOneBy({ slug: term });
      const queryBuilder = this.productRepository.createQueryBuilder('prod');

      product = await queryBuilder
        .where('UPPER(title)=:title or slug=:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product) throw new NotFoundException(`product ${term} not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...toUpdate } = updateProductDto;

    // preparaando objeto para actualizarlo
    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });
    if (!product)
      throw new NotFoundException(`product with id ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    // puede regresarse una promesa ya que nest en automatico va a esperar a que termine para retornar una respuesta una vez se complete la promesa
    // return this.productRepository.save(product);
    try {
      if (images) {
        // BORRAR IMAGENES ANTERIORES
        await queryRunner.manager.delete(ProductImage, {
          product: {
            id,
          },
        });

        product.images = images.map((image) =>
          this.productImageRepository.create({
            url: image,
          }),
        );
      }
      product.user = user;

      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      // await this.productRepository.save(product);

      // return product;
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
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

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('products');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {}
  }
}
