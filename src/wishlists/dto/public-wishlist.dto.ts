import { OmitType } from '@nestjs/mapped-types';
import { Wishlist } from '../entities/wishlist.entity';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';

export class PublicWishlistDto extends OmitType(Wishlist, ['owner']) {
  owner: UserPublicProfileResponseDto;
}
