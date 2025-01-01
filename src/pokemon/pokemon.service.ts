import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private default_limit: number;

  constructor(
    // INYECCION PROPIA DE MONGOOSE PARA PODER TRABAJAR NEST CON MONGGOSE para inytectar modelos en los servicios
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>,
    // INYECTANDO EL SERVICIO PARA OBTENER LOS VALORES DE LAS VARIABLES DE ENTORNO
    private readonly configService: ConfigService,
  ) {
    //EL NOMBRE 'defaultLimit' SE OBTIENE DE LA LLAVE PROVISTA POR EL ARCHIVO app.config.ts donde se centralizaron las variables de entorno MEDIANTE UN OBJETO Y SE ACCEDE A LOS VALORES MEDIANTE EL NOMBRE QUE SE LE DIO A LA LLAVE DEL VALOR
    this.default_limit = this.configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    const newPokemon = {
      ...createPokemonDto,
      name: createPokemonDto.name.toLowerCase(),
    };

    try {
      const pokemon = await this.PokemonModel.create(newPokemon);
      return pokemon;
    } catch (error) {
      console.log(error);
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.default_limit, offset = 0 } = paginationDto;

    return await this.PokemonModel.find().limit(limit).skip(offset).sort({
      no: 1,
    });
  }

  async findOne(id: string) {
    try {
      let pokemon: Pokemon;

      if (!isNaN(+id)) {
        pokemon = await this.PokemonModel.findOne({
          no: id,
        });
      }
      if (!pokemon && isValidObjectId(id)) {
        pokemon = await this.PokemonModel.findById(id);
      }

      if (!pokemon) {
        pokemon = await this.PokemonModel.findOne({
          name: id.toLowerCase().trim(),
        });
      }

      if (!pokemon) throw new NotFoundException(`pokemon ${id} not found`);

      return pokemon;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(id);

      if (!pokemon)
        throw new NotFoundException(`pokemon ${id} not found to update`);

      if (updatePokemonDto.name) {
        pokemon.name = updatePokemonDto.name;
      }

      // await pokemon.save();
      await pokemon.updateOne(updatePokemonDto, {
        new: true,
      });
      console.log(updatePokemonDto, 'DATA PARA ACTUALIZAR');
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      console.log(error);
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      // FORMA 1
      // const pokemon = await this.findOne(id);
      // await pokemon.deleteOne();

      // FORMA 2
      // await this.PokemonModel.findByIdAndDelete(id);

      // FORMA 3
      const { deletedCount } = await this.PokemonModel.deleteOne({ _id: id });

      if (deletedCount == 0)
        throw new BadRequestException(`pokemon with id ${id} not found`);

      return `pokemon was deleted!`;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(
        `Pokemon already exists ${JSON.stringify(error.keyValue)}`,
      );
    throw new InternalServerErrorException(
      `Can't create pokemon -check server logs`,
    );
  }
}
