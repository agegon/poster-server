import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { getTypeORMConfig } from './configs/database';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeORMConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    ArticleModule,
    CommentModule,
    TagModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
