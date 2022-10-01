import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
// import { offersRepository } from './offer.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { UserPublicProfileResponseDto } from '../users/dto/user-public-profile-response.dto';
import { PublicOfferDto } from './dto/public-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(offer: CreateOfferDto, userId: number): Promise<PublicOfferDto> {
    return this.usersRepository.findOneBy({ id: userId }).then((user) => {
      return this.wishesRepository
        .findOneBy({ id: offer.itemId })
        .then((wish) => {
          const newOffer = {
            ...offer,
            item: wish,
            user: user,
          };

          delete newOffer.itemId;
          return this.offersRepository.save(newOffer).then((createdOffer) => {
            return {
              ...createdOffer,
              user: UserPublicProfileResponseDto.getFromUser(user),
            };
          });
        });
    });
  }

  async findAll(): Promise<Offer[]> {
    return this.offersRepository.find();
  }

  async findOne(id: number): Promise<Offer> {
    return this.offersRepository.findOneBy({
      id: id,
    });
  }

  async updateOne(id: number, offer: UpdateOfferDto) {
    return this.offersRepository.update(id, offer);
  }

  async removeOne(id: number) {
    await this.offersRepository.delete(id);
  }
}
