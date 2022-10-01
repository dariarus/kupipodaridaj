import { IsEmail, IsString } from 'class-validator';
import { UserPublicProfileResponseDto } from './user-public-profile-response.dto';
import { User } from '../entities/user.entity';

export class UserProfileResponseDto extends UserPublicProfileResponseDto {
  @IsString()
  @IsEmail()
  email: string;

  static getFromUser(user: User): UserProfileResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      about: user.about,
      avatar: user.avatar,
    };
  }
}
