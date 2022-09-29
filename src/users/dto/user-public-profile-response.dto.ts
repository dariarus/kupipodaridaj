import { IsInt } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { User } from '../entities/user.entity';
import { OmitType } from '@nestjs/mapped-types';

export class UserPublicProfileResponseDto extends OmitType(CreateUserDto, [
  'password',
]) {
  @IsInt()
  id: number;

  static getFromUser(user: User): UserPublicProfileResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      about: user.about,
      avatar: user.avatar,
    };
  }
}
