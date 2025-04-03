import { IsEmail, IsNotEmpty, IsString, Matches, Max } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  //   @Matches(/^[ña-z]{3,4}[0-9]{6}[0-9a-z]{3}$/i)
  rfc: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsString()
  //   @Max(10)
  telefono: string;
  @IsNotEmpty()
  @IsString()
  //   @Max(10)
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
