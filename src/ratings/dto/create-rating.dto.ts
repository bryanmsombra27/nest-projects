import {
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsString()
  place_id: string;

  @IsNotEmpty()
  @IsString()
  comments: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(5)
  @Min(1)
  rating: number;
}
