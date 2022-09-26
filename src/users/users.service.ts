import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Offer} from "../offers/entities/offer.entity";
import {Repository} from "typeorm";
import {CreateOfferDto} from "../offers/dto/create-offer.dto";
import {UpdateOfferDto} from "../offers/dto/update-offer.dto";
import {User} from "./entities/user.entity";
import {FindUserDto} from "./dto/find-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  async create(user: CreateUserDto): Promise<User> {
    const newUser = {
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(user: FindUserDto): Promise<User> {
    return user.username
      ? this.userRepository.findOneBy({
        username: user.username
      })
      : this.userRepository.findOneBy({
        email: user.email
      });
  }

  async updateOne(id: number, user: UpdateUserDto) {
    return this.userRepository.update(id, user);
  }

  async removeOne(id: number) {
    await this.userRepository.delete(id);
  }
}
