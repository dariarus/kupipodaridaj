import { Entity } from 'typeorm';
import { Wish } from '../entities/wish.entity';
import { OmitType } from '@nestjs/mapped-types';
import { User } from '../../users/entities/user.entity';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';

@Entity()
export class WishPublicDto extends OmitType(Wish, ['owner']) {
  owner: UserPublicProfileResponseDto;
}
