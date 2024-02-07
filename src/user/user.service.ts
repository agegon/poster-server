import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import {
  AUTHENTICATION_ERROR,
  EXISTED_USER_ERROR,
  FOLLOW_SAME_USER_ERROR,
  INVALID_USER_PASSWORD_ERROR,
  NOT_EXISTED_USER_ERROR,
} from './user.constants';
import { User } from './user.entity';
import { hashPassword, matchPassword } from './utils';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async createUser(userDto: CreateUserDto): Promise<User> {
    const existedUser = await this.userRepository.findOne({
      where: [{ email: userDto.email }, { username: userDto.username }],
    });

    if (existedUser) {
      throw new UnprocessableEntityException(EXISTED_USER_ERROR);
    }

    const password = await hashPassword(userDto.password);

    const newUser = this.userRepository.create({
      ...userDto,
      password,
    });

    return this.userRepository.save(newUser);
  }

  public async updateUser(
    email: string,
    userDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(NOT_EXISTED_USER_ERROR);
    }

    Object.entries(userDto).forEach(([key, value]) => {
      if (['password', 'newPassword'].includes(key)) {
        return;
      }

      user[key] = value;
    });

    if ('newPassword' in userDto) {
      const isSamePassword = await matchPassword(
        user.password,
        userDto.password,
      );

      if (!isSamePassword) {
        throw new UnauthorizedException(INVALID_USER_PASSWORD_ERROR);
      }

      user.password = await hashPassword(userDto.newPassword);
    }

    return this.userRepository.save(user);
  }

  public async authenticateUser(userDto: LoginUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: userDto.email },
    });

    if (!user) {
      throw new UnauthorizedException(AUTHENTICATION_ERROR);
    }

    const isSamePassword = await matchPassword(user.password, userDto.password);

    if (!isSamePassword) {
      throw new UnauthorizedException(AUTHENTICATION_ERROR);
    }

    return user;
  }

  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  public async getUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: {
        followers: true,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  public async addFollower(
    username: string,
    currentUserEmail: string,
  ): Promise<User> {
    const [user, currentUser] = await Promise.all([
      this.getUserByUsername(username),
      this.getUserByEmail(currentUserEmail),
    ]);

    if (user.id === currentUser.id) {
      throw new UnprocessableEntityException(FOLLOW_SAME_USER_ERROR);
    }

    if (user.followers.some((u) => u.id === currentUser.id)) {
      return user;
    }

    user.followers.push(currentUser);

    return this.userRepository.save(user);
  }

  public async deleteFollower(
    username: string,
    currentUserEmail: string,
  ): Promise<User> {
    const [user, currentUser] = await Promise.all([
      this.getUserByUsername(username),
      this.getUserByEmail(currentUserEmail),
    ]);

    user.followers = user.followers.filter((u) => u.id !== currentUser.id);

    return this.userRepository.save(user);
  }

  public async getFollowingUsersByEmail(email: string): Promise<User[]> {
    return this.userRepository.find({
      where: {
        followers: { email },
      },
    });
  }
}
