import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  about = 'Пока ничего не рассказал о себе';

  @IsString()
  @IsUrl()
  avatar = 'https://i.pravatar.cc/300';

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
