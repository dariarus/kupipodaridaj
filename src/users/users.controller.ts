import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { JwtGuard } from '../auth/passport/jwt.guard';
import { AuthService } from '../auth/auth.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  findOwn(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(+req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  getOwnWishes(@Req() req) {
    return this.usersService
      .findOne(req.user.id)
      .then((user) => this.usersService.getWishes(user.username));
  }

  @Get(':username/wishes')
  getWishes(@Param('username') username: string) {
    console.log(username);
    return this.usersService.getWishes(username);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findByNamePublic(username);
  }

  @Post('find')
  findMany(@Body() findUserDto: FindUsersDto) {
    return this.usersService.findMany(findUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.removeOne(+id);
  }
}
