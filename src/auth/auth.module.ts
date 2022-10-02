import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserProfile } from '../users/users.automapper';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './passport/jwt-strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './passport/passport-strategy';
import { Wish } from '../wishes/entities/wish.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wish]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_secret'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    UserProfile,
    JwtStrategy,
    LocalStrategy,
    ConfigService,
  ],
})
export class AuthModule {}
