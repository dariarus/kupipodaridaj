import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { UserPublicProfileResponseDto } from '../users/dto/user-public-profile-response.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { PublicWishlistDto } from './dto/public-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(wishlist: CreateWishlistDto): Promise<Wishlist> {
    return this.wishlistRepository.save(wishlist);
  }

  async createOne(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    return this.usersRepository.findOneBy({ id: userId }).then((user) => {
      return this.wishesRepository
        .findBy({
          id: In(createWishlistDto.itemsId),
        })
        .then((wishes) => {
          const newWishlist = {
            ...createWishlistDto,
            owner: UserPublicProfileResponseDto.getFromUser(user),
            items: wishes,
          };
          delete newWishlist.itemsId;
          return this.create(newWishlist);
        });
    });
  }

  async findAll(userId: number): Promise<PublicWishlistDto[]> {
    return this.wishlistRepository
      .find({
        where: {
          owner: {
            id: userId,
          },
        },
        relations: ['owner', 'items'],
      })
      .then((wishlists) => {
        return wishlists.map((wishlist) => {
          return {
            ...wishlist,
            owner: UserPublicProfileResponseDto.getFromUser(wishlist.owner),
          };
        });
      });
  }

  async findOne(id: number, userId: number): Promise<PublicWishlistDto> {
    return this.wishlistRepository
      .findOne({
        where: {
          id: id,
        },
        relations: ['owner', 'items'],
      })
      .then((wishlist) => {
        if (wishlist.owner.id !== userId) {
          throw new UnauthorizedException(
            'Нельзя получить доступ к чужому вишлисту',
          );
        }
        return {
          ...wishlist,
          owner: UserPublicProfileResponseDto.getFromUser(wishlist.owner),
        };
      });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return this.wishlistRepository.update(id, updateWishlistDto);
  }

  async updateOne(
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    return this.wishlistRepository
      .findOne({
        where: { id: wishlistId },
        relations: ['owner'],
      })
      .then((wishlist) => {
        if (wishlist && wishlist.owner.id !== userId) {
          throw new UnauthorizedException();
        }
        return this.wishesRepository
          .findBy({
            id: In(updateWishlistDto.itemsId),
          })
          .then((wishes) => {
            console.log(wishes);
            const newWishlist = {
              ...updateWishlistDto,
              id: wishlistId,
              updatedAt: new Date(),
              owner: UserPublicProfileResponseDto.getFromUser(wishlist.owner),
              items: wishes,
            };
            delete newWishlist.itemsId;
            return this.wishlistRepository.save(newWishlist);
          });
      });
  }

  async remove(id: number) {
    await this.wishlistRepository.delete(id);
  }

  async removeOne(wishlistId: number, userId: number) {
    // findOne проверяет, что это вишлист пользователя
    return this.findOne(wishlistId, userId).then((wishlist) => {
      return this.remove(wishlistId).then(() => wishlist);
    });
  }
}
