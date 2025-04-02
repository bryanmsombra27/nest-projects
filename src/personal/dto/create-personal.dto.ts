import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePersonalDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  rolId: string;
}
