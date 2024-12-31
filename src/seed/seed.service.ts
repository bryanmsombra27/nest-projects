import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeAPIResponse } from './interfaces/pokeapi.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>,
    private readonly axios: AxiosAdapter,
  ) {}

  async LoadInformationToDB() {
    await this.PokemonModel.deleteMany();

    const data = await this.axios.get<PokeAPIResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=650`,
    );

    const pokemons = data.results.map(({ name, url }) => {
      const segements = url.split('/');

      // const no = +segements.at(segements.length - 2);
      const no = segements[segements.length - 2];

      return {
        name,
        no,
      };
    });

    await this.PokemonModel.insertMany(pokemons);

    return {
      msg: 'DATA CARGADA CON EXITO!',
    };
  }
}
