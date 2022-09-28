import { IsInt } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UserPublicProfileResponseDto extends CreateUserDto {
  @IsInt()
  id: number;
}
