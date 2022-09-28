import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
// import { OfferRepository } from './offer.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async create(offer: CreateOfferDto): Promise<Offer> {
    const newOffer = {
      ...offer,
    };
    return this.offerRepository.save(newOffer);
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOneBy({
      id: id,
    });
  }

  async updateOne(id: number, offer: UpdateOfferDto) {
    return this.offerRepository.update(id, offer);
  }

  async removeOne(id: number) {
    await this.offerRepository.delete(id);
  }
}
