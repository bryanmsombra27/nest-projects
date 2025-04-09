import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePersonalInternalPasswordDto {
  @IsString()
  @IsNotEmpty()
  last_password: string;

  @IsString()
  @IsNotEmpty()
  new_password: string;

  @IsString()
  @IsNotEmpty()
  new_password_confirmation: string;
}
