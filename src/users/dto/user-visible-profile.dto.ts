import {IsInt, IsString, MaxLength, maxLength, MinLength, minLength} from "class-validator";
import {CreateUserDto} from "./create-user.dto";

export class UserVisibleProfileDto extends CreateUserDto {
  @IsInt()
  id: number;
}