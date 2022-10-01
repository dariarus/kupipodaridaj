import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { UserPublicProfileResponseDto } from '../users/dto/user-public-profile-response.dto';

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

  async findOne(id: number): Promise<Wish> {
    return this.wishesRepository.findOneBy({
      id: id,
    });
  }

  async updateOne(id: number, wish: UpdateWishDto) {
    return this.wishesRepository.update(id, wish);
  }

  async removeOne(id: number) {
    await this.wishesRepository.delete(id);
  }
}
