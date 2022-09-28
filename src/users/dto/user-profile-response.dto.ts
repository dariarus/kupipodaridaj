import { IsEmail, IsString } from 'class-validator';
import { UserPublicProfileResponseDto } from './user-public-profile-response.dto';

export class UserProfileResponseDto extends UserPublicProfileResponseDto {
  @IsString()
  @IsEmail()
  email: string;
}
