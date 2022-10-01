import { Injectable } from '@nestjs/common';
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

  async create(wish: CreateWishDto, userId: number): Promise<any> {
    return this.usersRepository.findOneBy({ id: userId }).then((user) => {
      const newWish = {
        ...wish,
        owner: user,
      };
      return this.wishesRepository.save(newWish).then((createdWish) => {
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
        relations: ['owner', 'offers'],
      })
      .then((wish) => {
        const selectedWish = wish;
        return {
          ...selectedWish,
          owner: UserProfileResponseDto.getFromUser(selectedWish.owner),
        };
      });
  }

  async findLast(userId: number): Promise<any> {
    return this.wishesRepository
      .find({
        relations: ['owner'],
        where: { owner: { id: userId } },
        order: { id: 'desc' },
        take: 1,
      })
      .then((wishes) => {
        if (wishes && wishes.length !== 0) {
          const lastUsersWish = wishes[0];
          return {
            ...lastUsersWish,
            owner: UserProfileResponseDto.getFromUser(lastUsersWish.owner),
          };
        }
      });
  }

  async findTop(userId: number): Promise<any> {
    return this.wishesRepository
      .find({
        relations: ['owner'],
        where: { owner: { id: userId } },
        order: { id: 'asc' },
        take: 1,
      })
      .then((wishes) => {
        if (wishes && wishes.length !== 0) {
          const firstUsersWish = wishes[0];
          return {
            ...firstUsersWish,
            owner: UserPublicProfileResponseDto.getFromUser(
              firstUsersWish.owner,
            ),
          };
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
        throw new Error('Нельзя редактировать чужие желания');
      }
      if (updatingWish.raised) {
        throw new Error(
          'Сумма собранных средств зависит от заявок желающих скинуться',
        );
      }
      if (
        updateWishDto.price &&
        updatingWish.offers &&
        updatingWish.offers.length > 0
      ) {
        throw new Error(
          'Если есть заявки от скидывающихся, цену менять нельзя',
        );
      }
      return this.update(wishId, updateWishDto).then(() => updateWishDto);
    });
  }

  async remove(id: number) {
    return this.wishesRepository.delete(id);
  }

  async removeOne(wishId: number, userId) {
    return this.findOne(wishId).then((wish) => {
      if (wish.owner.id !== userId) {
        throw new Error('Нельзя удалять чужие желания');
      }
      return this.remove(wishId).then(() => wish);
    });
  }
}
