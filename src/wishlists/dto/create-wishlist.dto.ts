import {
  IsArray,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsArray()
  @IsNumber({}, { each: true })
  numbers: number[];
}
