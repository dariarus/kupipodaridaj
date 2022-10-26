import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SigninUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  password: string;
}
