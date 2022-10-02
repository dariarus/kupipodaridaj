import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { UserPublicProfileResponseDto } from '../users/dto/user-public-profile-response.dto';
import { UserProfileResponseDto } from '../users/dto/user-profile-response.dto';
import { WishPublicDto } from './dto/wish-public.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createWishDto: CreateWishDto) {
    return this.wishesRepository.save(createWishDto);
  }

  async createOne(wish: CreateWishDto, userId: number): Promise<any> {
    return this.usersRepository.findOneBy({ id: userId }).then((user) => {
      const newWish = {
        ...wish,
        owner: user,
      };
      return this.create(newWish).then((createdWish) => {
        return {
          ...createdWish,
          owner: UserPublicProfileResponseDto.getFromUser(user),
        };
      });
    });
  }

  async findAll(): Promise<Wish[]> {
    return this.wishesRepository.find();
  }

  async findOne(id: number): Promise<WishPublicDto> {
    return this.wishesRepository
      .findOne({
        where: {
          id: id,
        },
        relations: ['owner', 'offers', 'offers.user'],
      })
      .then((wish) => {
        const selectedWish = wish;
        return {
          ...selectedWish,
          owner: UserProfileResponseDto.getFromUser(selectedWish.owner),
          offers: selectedWish.offers.map((offer) => {
            return {
              ...offer,
              user: UserProfileResponseDto.getFromUser(offer.user),
            };
          }),
        };
      });
  }

  async findLast(): Promise<any> {
    return this.wishesRepository
      .find({
        relations: ['owner'],
        order: { id: 'desc' },
        take: 10,
      })
      .then((wishes) => {
        if (wishes && wishes.length !== 0) {
          return wishes.map((wish) => {
            return {
              ...wish,
              owner: UserProfileResponseDto.getFromUser(wish.owner),
            };
          });
        }
      });
  }

  async findTop(): Promise<any> {
    return this.wishesRepository
      .find({
        relations: ['owner'],
        order: { copied: 'desc' },
        take: 10,
      })
      .then((wishes) => {
        if (wishes && wishes.length !== 0) {
          return wishes.map((wish) => {
            return {
              ...wish,
              owner: UserProfileResponseDto.getFromUser(wish.owner),
            };
          });
        }
      });
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    return this.wishesRepository.update(id, updateWishDto);
  }

  async updateOne(
    wishId: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ) {
    this.findOne(wishId).then((updatingWish) => {
      if (updatingWish.owner.id !== userId) {
        throw new ForbiddenException('Нельзя редактировать чужие желания');
      }
      if (updatingWish.raised) {
        throw new ForbiddenException(
          'Сумма собранных средств зависит от заявок желающих скинуться',
        );
      }
      if (
        updateWishDto.price &&
        updatingWish.offers &&
        updatingWish.offers.length > 0
      ) {
        throw new ForbiddenException(
          'Если есть заявки от скидывающихся, цену менять нельзя',
        );
      }
      return this.update(wishId, updateWishDto).then(() => updateWishDto);
    });
  }

  async copyWish(wishId: number, userId: number) {
    return this.findOne(wishId).then((wish) => {
      const counter = wish.copied + 1;
      return this.wishesRepository
        .update(wishId, {
          copied: counter,
        })
        .then(() => {
          return this.usersRepository.findOneBy({ id: userId }).then((user) => {
            const copiedWish = {
              ...wish,
              owner: UserPublicProfileResponseDto.getFromUser(user),
              copied: 0,
              raised: 0,
              offers: [],
            };
            delete copiedWish.id;
            return this.wishesRepository.save(copiedWish);
          });
        });
    });
  }

  async remove(id: number) {
    return this.wishesRepository.delete(id);
  }

  async removeOne(wishId: number, userId) {
    return this.findOne(wishId).then((wish) => {
      if (wish.owner.id !== userId) {
        throw new ForbiddenException('Нельзя удалять чужие желания');
      }
      return this.remove(wishId).then(() => wish);
    });
  }
}
