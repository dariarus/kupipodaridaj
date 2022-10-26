import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class SignupUserResponseDto extends OmitType(CreateUserDto, [
  'password',
] as const) {}
