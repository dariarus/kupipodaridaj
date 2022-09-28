import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(wishlist: CreateWishlistDto): Promise<Wishlist> {
    const newWish = {
      ...wishlist,
    };
    return this.wishlistRepository.save(newWish);
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find();
  }

  async findOne(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOneBy({
      id: id,
    });
  }

  async updateOne(id: number, wishlist: UpdateWishlistDto) {
    return this.wishlistRepository.update(id, wishlist);
  }

  async removeOne(id: number) {
    await this.wishlistRepository.delete(id);
  }
}
