import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { createMap } from '@automapper/core';
import { User } from './entities/user.entity';
import { SignupUserResponseDto } from './dto/signup-user-response.dto';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, User, SignupUserResponseDto);
    };
  }
}
