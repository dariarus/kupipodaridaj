import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './passport/local.guard';

@Controller('')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.authService.auth(user);
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  login(@Req() req) {
    return this.authService.auth(req.user);
  }
}
