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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/passport/jwt-guard';
import { AuthService } from '../auth/auth.service';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(
    private readonly wishesService: WishesService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(
    @Headers('authorization') authHeader,
    @Body() createWishDto: CreateWishDto,
  ) {
    const decodedJwt = this.authService.decodeAuthHeader(authHeader);
    return this.wishesService.create(createWishDto, decodedJwt.sub);
  }

  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get('last')
  findLast(@Headers('authorization') authHeader) {
    const decodedJwt = this.authService.decodeAuthHeader(authHeader);

    return this.wishesService.findLast(decodedJwt.sub);
  }

  @Get('top')
  findTop(@Headers('authorization') authHeader) {
    const decodedJwt = this.authService.decodeAuthHeader(authHeader);

    return this.wishesService.findTop(decodedJwt.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.updateOne(+id, updateWishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishesService.removeOne(+id);
  }
}
