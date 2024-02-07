import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { IAuthUser } from 'src/auth/auth.interfaces';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import {
  ICommentResponseSchema,
  ICommentsResponseSchema,
} from './comment.interfaces';
import { mapCommentSchema } from './comment.mappers';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('articles/:slug/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  public async getComments(
    @Param('slug') slug: string,
  ): Promise<ICommentsResponseSchema> {
    const comments = await this.commentService.getCommentsByArticle(slug);

    return {
      comments: comments.map(mapCommentSchema),
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async addComment(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    commentDto: CreateCommentDto,
    @Param('slug') slug: string,
    @User() user: IAuthUser,
  ): Promise<ICommentResponseSchema> {
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
  public async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Param('slug') slug: string,
    @User() user: IAuthUser,
  ): Promise<ICommentResponseSchema> {
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
