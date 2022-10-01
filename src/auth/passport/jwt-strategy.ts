import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      /* Указываем, что токен будет передаваться в заголовке Authorization в формате Bearer <token> */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      /* Получаем секрет для подписи JWT токенов из конфигурации */
      secretOrKey: configService.get<string>('jwt_secret'),
    });
  }

  /**
   * Метод validate должен вернуть данные пользователя
   * В JWT стратегии в качестве параметра метод получает полезную нагрузку из токена
   */
  async validate(jwtPayload: {
    sub: number;
  }): Promise<UserPublicProfileResponseDto> {
    /* В subject токена будем передавать идентификатор пользователя */
    const user = this.usersRepository.findOne({
      where: { id: jwtPayload.sub },
      select: ['id'],
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
