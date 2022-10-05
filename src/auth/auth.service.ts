import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserPublicProfileResponseDto } from '../users/dto/user-public-profile-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  auth(user: User): { access_token: string } {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  validatePassword(
    username: string,
    password: string,
  ): Promise<UserPublicProfileResponseDto> {
    return this.usersService.findByName(username).then((user) => {
      if (!user) {
        throw new UnauthorizedException('Неверные логин или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedException('Неверные логин или пароль');
        }
        return user;
      });
    });
  }

  decodeAuthHeader(authHeader: string): { sub: number } {
    /* В subject токена будем передавать идентификатор пользователя */
    return this.jwtService.decode(authHeader.split(' ')[1]) as {
      sub: number;
    };
  }
}
