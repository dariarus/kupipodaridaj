import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { SigninUserDto } from '../users/dto/signin-user.dto';

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
    const payload = { id: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  validatePassword(signinUserDto: SigninUserDto, user: User | null) {
    return bcrypt
      .compare(signinUserDto.password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new UnauthorizedException();
        }
        return this.auth(user);
      });
  }

  signin(signinUserDto: SigninUserDto) {
    return this.userRepository
      .findOneBy({ username: signinUserDto.username })
      .then((user) => {
        if (!user) {
          throw new UnauthorizedException();
        }
        return this.validatePassword(signinUserDto, user);
      });
  }
}
