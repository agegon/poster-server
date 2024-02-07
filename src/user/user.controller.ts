import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IAuthUser } from '../auth/auth.interfaces';
import { AuthService } from '../auth/auth.service';

import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { IUserResponseSchema } from './user.interfaces';
import { mapUserSchema } from './user.mappers';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async registerUser(
    @Body(new ValidationPipe()) userDto: CreateUserDto,
  ): Promise<IUserResponseSchema> {
    const user = await this.userService.createUser(userDto);
    const token = await this.authService.signAccessToken(user.email);

    return {
      token,
      user: mapUserSchema(user),
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginUser(
    @Body(new ValidationPipe()) userDto: LoginUserDto,
  ): Promise<IUserResponseSchema> {
    const user = await this.userService.authenticateUser(userDto);
    const token = await this.authService.signAccessToken(user.email);

    return {
      token,
      user: mapUserSchema(user),
    };
  }

  @Get()
  @UseGuards(new JwtAuthGuard())
  async getCurrentUser(
    @User() authUser: IAuthUser,
    @Headers('authorization') authorization: string,
  ): Promise<IUserResponseSchema> {
    const user = await this.userService.getUserByEmail(authUser.email);
    const token = authorization.split(' ')[1];

    return {
      token,
      user: mapUserSchema(user),
    };
  }

  @Patch()
  @UseGuards(new JwtAuthGuard())
  async updateCurrentUser(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    userDto: UpdateUserDto,
    @User() authUser: IAuthUser,
  ): Promise<IUserResponseSchema> {
    const user = await this.userService.updateUser(authUser.email, userDto);
    const token = await this.authService.signAccessToken(user.email);

    return {
      token,
      user: mapUserSchema(user),
    };
  }
}
