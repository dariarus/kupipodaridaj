import { Entity } from 'typeorm';
import { Wish } from './wish.entity';
import { OmitType } from '@nestjs/mapped-types';

@Entity()
export class WishPartial extends OmitType(Wish, ['owner', 'offers']) {}
