import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(wish: CreateWishDto): Promise<Wish> {
    const newWish = {
      ...wish,
    };
    return this.wishRepository.save(newWish);
  }

  async findAll(): Promise<Wish[]> {
    return this.wishRepository.find();
  }

  async findOne(id: number): Promise<Wish> {
    return this.wishRepository.findOneBy({
      id: id,
    });
  }

  async updateOne(id: number, wish: UpdateWishDto) {
    return this.wishRepository.update(id, wish);
  }

  async removeOne(id: number) {
    await this.wishRepository.delete(id);
  }
}
