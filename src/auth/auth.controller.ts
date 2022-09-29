import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserDto } from '../users/dto/signin-user.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './passport/passport-guard';

@Controller('')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService
      .create(createUserDto)
      .then((user) => this.authService.auth(user));
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  login(@Req() req) {
    return this.authService.auth(req.user);
  }
}
