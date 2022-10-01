import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthService } from '../auth/auth.service';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(
    @Headers('authorization') authHeader,
    @Body() newOffer: CreateOfferDto,
  ) {
    const decodedJwt = this.authService.decodeAuthHeader(authHeader);
    return this.offersService.create(newOffer, decodedJwt.sub);
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
