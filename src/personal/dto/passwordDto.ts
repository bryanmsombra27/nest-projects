import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  new_password: string;

  @IsString()
  @IsNotEmpty()
  new_password_confirmation: string;
}

export class ResetPasswordQueryParams {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}
