import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
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
import { IAuthUser } from 'src/auth/auth.interfaces';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { mapCommentSchema } from './comment.mappers';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseSchema } from './schemas/comment-response';
import { CommentsResponseSchema } from './schemas/comments-response';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('articles/:slug/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all comments for the article' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns list of comments',
    type: CommentsResponseSchema,
  })
  public async getComments(
    @Param('slug') slug: string,
  ): Promise<CommentsResponseSchema> {
    const comments = await this.commentService.getCommentsByArticle(slug);

    return {
      comments: comments.map(mapCommentSchema),
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a new comment for the article' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns the comment',
    type: CommentResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized users cannot create comments',
  })
  public async addComment(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    commentDto: CreateCommentDto,
    @Param('slug') slug: string,
    @User() user: IAuthUser,
  ): Promise<CommentResponseSchema> {
    const comment = await this.commentService.addComment(
      commentDto,
      slug,
      user.email,
    );

    return {
      comment: mapCommentSchema(comment),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete the comment for the article' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the comment',
    type: CommentResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized users cannot delete comments',
  })
  public async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Param('slug') slug: string,
    @User() user: IAuthUser,
  ): Promise<CommentResponseSchema> {
    const comment = await this.commentService.deleteComment(
      id,
      slug,
      user.email,
    );

    return {
      comment: mapCommentSchema(comment),
    };
  }
}
