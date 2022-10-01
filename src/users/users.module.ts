import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { UserProfile } from './users.automapper';
import { JwtModule } from '@nestjs/jwt';
import { Wish } from '../wishes/entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish]), JwtModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService, UserProfile],
})
export class UsersModule {}
