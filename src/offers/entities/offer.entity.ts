import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Wish } from "../../wishes/entities/wish.entity";

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  // @OneToOne(() => User)
  // user: User;

  // @OneToOne(() => Wish)
  // item: Wish; //TODO: что если это просто link из сущности Wish?

  @Column({type: "decimal", scale: 2})
  amount: number;

  @Column({default: false})
  hidden: boolean;
}