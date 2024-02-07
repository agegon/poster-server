import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleModule } from './article/article.module';
import { getTypeORMConfig } from './configs/database';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeORMConfig,
      inject: [ConfigService],
    }),
    ArticleModule,
    UserModule,
    AuthModule,
    TagModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
