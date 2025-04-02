import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  //   @IsNotEmpty()
  //   @IsString()
  //   @Matches(/^[ña-z]{3,4}[0-9]{6}[0-9a-z]{3}$/i)
  //   rfc: string;

  //   @IsNotEmpty()
  //   @IsString()
  //   direccion: string;

  //   @IsNotEmpty()
  //   @IsString()
  //   telefono: string;

  //   @IsNotEmpty()
  //   @IsString()
  //   @IsEmail()
  //   email: string;
}
