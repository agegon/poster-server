import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleModule } from 'src/article/article.module';
import { UserModule } from 'src/user/user.module';

import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), ArticleModule, UserModule],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
