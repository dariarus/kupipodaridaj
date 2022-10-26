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
    const user = await this.usersRepository.findOneBy({
      username: username,
    });
    return UserPublicProfileResponseDto.getFromUser(user);
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
    const usersByEmail = await byEmail;
    const usersByName = await this.usersRepository.findBy({
      username: findUserDto.query,
    });
    const users: User[] = usersByEmail.concat(usersByName);
    return users.map((user) => UserProfileResponseDto.getFromUser(user));
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
    const user = await this.usersRepository.findOne({
      where: { username: username },
      select: ['wishes'],
      relations: ['wishes'],
    });
    return user.wishes;
  }
}
