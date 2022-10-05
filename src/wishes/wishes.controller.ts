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
import { JwtGuard } from '../auth/passport/jwt.guard';
import { AuthService } from '../auth/auth.service';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(
    private readonly wishesService: WishesService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.createOne(createWishDto, req.user.id);
  }

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateOne(+id, updateWishDto, req.user.id);
  }

  @Post(':id/copy')
  copyWish(@Req() req, @Param('id') id: string) {
    return this.wishesService.copyWish(+id, req.user.id);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.wishesService.removeOne(+id, req.user.id);
  }
}
