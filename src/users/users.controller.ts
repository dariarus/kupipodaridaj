import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { JwtGuard } from '../auth/passport/jwt-guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findByName(username);
  }

  @Post('find')
  findMany(@Body() findUserDto: FindUsersDto) {
    return this.usersService.findMany(findUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.removeOne(+id);
  }
}
