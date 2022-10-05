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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthService } from '../auth/auth.service';
import { JwtGuard } from '../auth/passport/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(
    private readonly wishesService: WishesService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.createOne(createWishDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateOne(+id, updateWishDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Req() req, @Param('id') id: string) {
    return this.wishesService.copyWish(+id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.wishesService.removeOne(+id, req.user.id);
  }
}
