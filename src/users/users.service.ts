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
import { Wish } from '../wishes/entities/wish.entity';
import { hashPassword } from '../utils/password-utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: await hashPassword(password),
    });
    return this.usersRepository.save(user);
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
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserPublicProfileResponseDto> {
    return this.usersRepository.findOneBy({
      id: id,
    });
  }

  async findByNamePublic(
    username: string,
  ): Promise<UserPublicProfileResponseDto> {
    return this.usersRepository
      .findOneBy({
        username: username,
      })
      .then((user) => UserPublicProfileResponseDto.getFromUser(user));
  }

  async findByName(username: string): Promise<User> {
    return this.usersRepository.findOneBy({
      username: username,
    });
  }

  async findMany(findUserDto: FindUsersDto): Promise<UserProfileResponseDto[]> {
    const byEmail = this.usersRepository.findBy({
      email: findUserDto.query,
    });
    return byEmail.then((usersByEmail) =>
      this.usersRepository
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
      return this.usersRepository.update(id, {
        ...updateUserDto,
        password: await hashPassword(password),
      });
    } else return this.usersRepository.update(id, updateUserDto);
  }

  async removeOne(id: number) {
    await this.usersRepository.delete(id);
  }

  async getWishes(username: string): Promise<UserWishesDto[]> {
    return this.usersRepository
      .findOne({
        where: { username: username },
        select: ['wishes'],
        relations: ['wishes'],
      })
      .then((user) => {
        return user.wishes;
      });
    // const wishesPromise = this.wishesRepository.findBy({
    //   owner.username: username
    // });
    // console.log(username);
    // return await userPromise.then((user) => {
    //   console.log(user.wishes);
    //   return user.wishes
    // });
  }
}
