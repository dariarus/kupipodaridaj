import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() newOffer: Offer) {
    return this.offersService.create(newOffer);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOffer: Offer) {
    return this.offersService.updateOne(+id, updateOffer);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offersService.removeOne(+id);
  }
}
