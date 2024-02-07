import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { IAuthUser } from 'src/auth/auth.interfaces';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtOptionalAuthGuard } from 'src/auth/guards/jwt-optional.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from 'src/user/user.service';

import { IProfileSchema } from './profile.interfaces';
import { mapProfileSchema } from './profile.mappers';

@Controller('profiles')
export class ProfileController {
  public constructor(private readonly userService: UserService) {}

  @Get(':username')
  @UseGuards(new JwtOptionalAuthGuard())
  public async getProfile(
    @Param('username') username: string,
    @User() currentUser: IAuthUser,
  ): Promise<IProfileSchema> {
    const user = await this.userService.getUserByUsername(username);

    return mapProfileSchema(user, currentUser?.email);
  }

  @Post(':username/follow')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new JwtAuthGuard())
  public async followUser(
    @Param('username') username: string,
    @User() currentUser: IAuthUser,
  ): Promise<IProfileSchema> {
    const user = await this.userService.addFollower(
      username,
      currentUser.email,
    );

    return mapProfileSchema(user, currentUser.email);
  }

  @Delete(':username/follow')
  @UseGuards(new JwtAuthGuard())
  public async unfollowUser(
    @Param('username') username: string,
    @User() currentUser: IAuthUser,
  ): Promise<IProfileSchema> {
    const user = await this.userService.deleteFollower(
      username,
      currentUser.email,
    );

    return mapProfileSchema(user, currentUser.email);
  }
}
