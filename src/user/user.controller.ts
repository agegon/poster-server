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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IAuthUser } from '../auth/auth.interfaces';
import { AuthService } from '../auth/auth.service';

import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { mapUserSchema } from './user.mappers';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { UserResponseSchema } from './schemas/user-response';

@ApiBearerAuth()
@ApiTags('Users')
@Controller()
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('users')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return the user info',
    type: UserResponseSchema,
  })
  async registerUser(
    @Body(new ValidationPipe()) userDto: CreateUserDto,
  ): Promise<UserResponseSchema> {
    const user = await this.userService.createUser(userDto);
    const token = await this.authService.signAccessToken(user.email);

    return {
      token,
      user: mapUserSchema(user),
    };
  }

  @Post('users/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the user info',
    type: UserResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authorized',
  })
  async loginUser(
    @Body(new ValidationPipe()) userDto: LoginUserDto,
  ): Promise<UserResponseSchema> {
    const user = await this.userService.authenticateUser(userDto);
    const token = await this.authService.signAccessToken(user.email);

    return {
      token,
      user: mapUserSchema(user),
    };
  }

  @Get('user')
  @UseGuards(new JwtAuthGuard())
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the user info',
    type: UserResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authorized',
  })
  async getCurrentUser(
    @User() authUser: IAuthUser,
    @Headers('authorization') authorization: string,
  ): Promise<UserResponseSchema> {
    const user = await this.userService.getUserByEmail(authUser.email);
    const token = authorization.split(' ')[1];

    return {
      token,
      user: mapUserSchema(user),
    };
  }

  @Patch('user')
  @UseGuards(new JwtAuthGuard())
  @ApiOperation({ summary: 'Update current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the user info',
    type: UserResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authorized',
  })
  async updateCurrentUser(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    userDto: UpdateUserDto,
    @User() authUser: IAuthUser,
  ): Promise<UserResponseSchema> {
    const user = await this.userService.updateUser(authUser.email, userDto);
    const token = await this.authService.signAccessToken(user.email);

    return {
      token,
      user: mapUserSchema(user),
    };
  }
}
