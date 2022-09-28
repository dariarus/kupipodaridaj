import { Wish } from '../../wishes/entities/wish.entity';
import { OmitType } from '@nestjs/mapped-types';

export class UserWishesDto extends OmitType(Wish, ['owner']) {}
