import {IsEmail, IsString} from "class-validator";

export class FindUserDto {
    @IsString()
    username?: string;

    @IsString()
    @IsEmail()
    email?: string;
}