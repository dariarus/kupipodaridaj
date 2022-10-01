import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FindUsersDto } from './dto/find-users.dto';
import { UserWishesDto } from './dto/user-wishes.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const user = await this.userRepository.create({
      ...createUserDto,
      password: await this.authService.hashPassword(password),
    });
    return this.userRepository.save(user);
  }

  // async create(user: CreateUserDto): Promise<SignupUserResponseDto> {
  //   return this.authService.hashPassword(user.password).then((hash) => {
  //     console.log(hash);
  //     const newUserData = {
  //       ...user,
  //       password: hash,
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     };
  //     return this.userRepository.save(newUserData).then((newUser) => {
  //       const result: SignupUserResponseDto = {
  //         username: newUser.username,
  //         email: newUser.email,
  //         about: newUser.about,
  //         avatar: newUser.avatar,
  //       };
  //       return result;
  //     });
  //   });
  // }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<UserPublicProfileResponseDto> {
    return this.userRepository.findOneBy({
      id: id,
    });
  }

  async findByName(username: string): Promise<UserPublicProfileResponseDto> {
    return this.userRepository
      .findOneBy({
        username: username,
      })
      .then((user) => UserPublicProfileResponseDto.getFromUser(user));
  }

  async findMany(findUserDto: FindUsersDto): Promise<UserProfileResponseDto[]> {
    const byEmail = this.userRepository.findBy({
      email: findUserDto.query,
    });
    return byEmail.then((usersByEmail) =>
      this.userRepository
        .findBy({
          username: findUserDto.query,
        })
        .then((usersByName) => usersByEmail.concat(usersByName))
        .then((users) =>
          users.map((user) => UserProfileResponseDto.getFromUser(user)),
        ),
    );
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    if (password) {
      return this.userRepository.update(id, {
        ...updateUserDto,
        password: await this.authService.hashPassword(password),
      });
    } else return this.userRepository.update(id, updateUserDto);
  }

  async removeOne(id: number) {
    await this.userRepository.delete(id);
  }

  async getWishes(username: string): Promise<UserWishesDto[]> {
    const userPromise = this.userRepository.findOneBy({
      username: username,
    });
    return userPromise.then((user) => user.wishes);
  }
}
