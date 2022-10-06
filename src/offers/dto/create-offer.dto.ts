import { IsBoolean, IsInt, Min } from 'class-validator';

export class CreateOfferDto {
  @Min(0)
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @IsInt()
  itemId: number;
}
