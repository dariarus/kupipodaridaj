import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsBoolean, IsDate, IsDecimal, Min } from 'class-validator';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @CreateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column({ type: 'decimal', scale: 2 })
  @IsDecimal()
  @Min(0)
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @JoinColumn()
  item: Wish;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;
}
