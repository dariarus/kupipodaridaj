import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  auth(user: User): { access_token: string } {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '30m' }),
    };
  }

  validatePassword(username: string, password: string): Promise<User> {
    return this.userRepository
      .findOneBy({ username: username })
      .then((user) => {
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
