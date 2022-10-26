import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { JoinColumn } from 'typeorm';
import { ColumnNumericTransformer } from '../../utils/column-numeric-transformer';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  @IsString()
  name: string;

  @Column()
  @IsString()
  link: string;

  @Column()
  @IsUrl()
  @IsString()
  image: string;

  @Column({
    type: 'decimal',
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  @IsNumber()
  price: number;

  @Column({
    type: 'decimal',
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(), // из строки в десятичную дробь (число)
  })
  @IsNumber()
  raised: number;

  @Column()
  @Length(1, 1024)
  @IsString()
  description: string;

  @Column({ default: 0 })
  @IsInt()
  @IsNumber()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn()
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
