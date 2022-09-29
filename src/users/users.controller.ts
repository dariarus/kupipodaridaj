import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { JwtGuard } from '../auth/passport/jwt-guard';
import { JwtService } from '@nestjs/jwt';
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
  findOwn(@Headers('authorization') authHeader) {
    console.log(authHeader);
    const decodedJwt = this.authService.decodeAuthHeader(authHeader);
    console.log(decodedJwt);
    return this.usersService.findOne(decodedJwt.sub);
  }

  @Patch('me')
  update(
    @Headers('authorization') authHeader,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const decodedJwt = this.authService.decodeAuthHeader(authHeader);
    return this.usersService.updateOne(+decodedJwt.sub, updateUserDto);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findByName(username);
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
