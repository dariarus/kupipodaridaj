import {
  IsDate,
  IsDefined,
  IsEmail,
  IsNumber,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column({ unique: true })
  @Length(2, 30)
  @IsDefined()
  @IsString()
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @MaxLength(200)
  @IsString()
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsString()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  @IsString()
  email: string;

  @Column()
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
