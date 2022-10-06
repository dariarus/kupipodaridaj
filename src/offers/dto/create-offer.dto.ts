import { IsBoolean, IsDecimal, IsInt, Min } from 'class-validator';

export class CreateOfferDto {
  // @IsDecimal()
  @Min(0)
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @IsInt()
  itemId: number;
}
