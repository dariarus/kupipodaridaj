import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SigninUserDto } from '../../users/dto/signin-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(signinUserDto: SigninUserDto) {
    const user = await this.authService.signin(signinUserDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
