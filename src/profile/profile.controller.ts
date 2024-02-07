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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { IAuthUser } from 'src/auth/auth.interfaces';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtOptionalAuthGuard } from 'src/auth/guards/jwt-optional.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from 'src/user/user.service';

import { mapProfileSchema } from './profile.mappers';
import { ProfileResponseSchema } from './schemas/profile-response';

@ApiTags('Profiles')
@ApiBearerAuth()
@Controller('profiles')
export class ProfileController {
  public constructor(private readonly userService: UserService) {}

  @Get(':username')
  @UseGuards(new JwtOptionalAuthGuard())
  @ApiOperation({ summary: 'Get user profile by username' })
  @ApiOkResponse({
    description: 'Returns the profile',
    type: ProfileResponseSchema,
  })
  public async getProfile(
    @Param('username') username: string,
    @User() currentUser: IAuthUser,
  ): Promise<ProfileResponseSchema> {
    const user = await this.userService.getUserByUsername(username);

    return {
      profile: mapProfileSchema(user, currentUser?.email),
    };
  }

  @Post(':username/follow')
  @HttpCode(HttpStatus.OK)
  @UseGuards(new JwtAuthGuard())
  @ApiOperation({ summary: 'Add user to following' })
  @ApiOkResponse({
    description: 'Returns the profile',
    type: ProfileResponseSchema,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized users cannot follow profile',
  })
  public async followUser(
    @Param('username') username: string,
    @User() currentUser: IAuthUser,
  ): Promise<ProfileResponseSchema> {
    const user = await this.userService.addFollower(
      username,
      currentUser.email,
    );

    return {
      profile: mapProfileSchema(user, currentUser.email),
    };
  }

  @Delete(':username/follow')
  @UseGuards(new JwtAuthGuard())
  @ApiOperation({ summary: 'Delete user from following' })
  @ApiOkResponse({
    description: 'Returns the profile',
    type: ProfileResponseSchema,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized users cannot follow profile',
  })
  public async unfollowUser(
    @Param('username') username: string,
    @User() currentUser: IAuthUser,
  ): Promise<ProfileResponseSchema> {
    const user = await this.userService.deleteFollower(
      username,
      currentUser.email,
    );

    return {
      profile: mapProfileSchema(user, currentUser.email),
    };
  }
}
