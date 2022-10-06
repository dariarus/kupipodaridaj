import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsBoolean, IsDate, IsDecimal, Min } from 'class-validator';
import { ColumnNumericTransformer } from '../../utils/column-numeric-transformer';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column({
    type: 'decimal',
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  // @IsDecimal()
  @Min(0)
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => Wish, (wish) => wish.offers, { onDelete: 'CASCADE' })
  @JoinColumn()
  item: Wish;

  @ManyToOne(() => User, (user) => user.offers, { onDelete: 'CASCADE' })
  user: User;
}
