import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Wish } from '../wishes/entities/wish.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Wish, User]), JwtModule],
  controllers: [WishlistsController],
  providers: [WishlistsService, AuthService, UsersService],
})
export class WishlistsModule {}
