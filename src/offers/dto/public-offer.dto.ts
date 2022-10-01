import { OmitType } from '@nestjs/mapped-types';
import { Offer } from '../entities/offer.entity';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';

export class PublicOfferDto extends OmitType(Offer, ['user']) {
  user: UserPublicProfileResponseDto;
}
