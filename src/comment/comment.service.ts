import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ArticleService } from 'src/article/article.service';
import { UserService } from 'src/user/user.service';

import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
  ) {}

  public async getCommentsByArticle(slug: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: {
        article: { slug },
      },
    });
  }

  public async addComment(
    commentDto: CreateCommentDto,
    slug: string,
    userEmail: string,
  ): Promise<Comment> {
    const [user, article] = await Promise.all([
      this.userService.getUserByEmail(userEmail),
      this.articleService.getArticleBySlug(slug),
    ]);

    const comment = this.commentRepository.create({
      ...commentDto,
      article,
      author: user,
    });

    return this.commentRepository.save(comment);
  }

  public async deleteComment(
    id: number,
    slug: string,
    userEmail: string,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: {
        id,
        article: { slug },
      },
    });

    if (!comment) {
      throw new NotFoundException();
    }

    if (comment.author.email !== userEmail) {
      throw new ForbiddenException();
    }

    await this.commentRepository.remove(comment);

    return comment;
  }
}
