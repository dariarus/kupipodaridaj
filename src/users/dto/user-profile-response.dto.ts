import {IsEmail, IsString} from "class-validator";
import {UserVisibleProfileDto} from "./user-visible-profile.dto";

export class UserProfileResponseDto extends UserVisibleProfileDto {
  @IsString()
  @IsEmail()
  email: string;
}