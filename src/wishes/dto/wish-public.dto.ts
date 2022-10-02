import { Entity } from 'typeorm';
import { Wish } from '../entities/wish.entity';
import { OmitType } from '@nestjs/mapped-types';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';
import { PublicOfferDto } from '../../offers/dto/public-offer.dto';

@Entity()
export class WishPublicDto extends OmitType(Wish, ['owner', 'offers']) {
  owner: UserPublicProfileResponseDto;
  offers: PublicOfferDto[];
}
