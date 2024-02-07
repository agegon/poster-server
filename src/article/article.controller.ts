import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { IAuthUser } from 'src/auth/auth.interfaces';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtOptionalAuthGuard } from 'src/auth/guards/jwt-optional.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { IArticleResponseSchema } from './article.interfaces';
import { mapArticleSchema } from './article.mappers';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article-dto';
import { GetAllArticlesDto } from './dto/get-all-articles-dto';
import { UpdateArticleDto } from './dto/update-article-dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @UseGuards(new JwtOptionalAuthGuard())
  public async getAll(
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllArticlesDto,
    @User() user: IAuthUser,
  ): Promise<IArticleResponseSchema[]> {
    const articles = await this.articleService.getAllArticles(query);

    return articles.map((article) => mapArticleSchema(article, user?.email));
  }

  @Post()
  @UseGuards(new JwtAuthGuard())
  public async create(
    @Body(new ValidationPipe())
    articleDto: CreateArticleDto,
    @User() user: IAuthUser,
  ) {
    const article = await this.articleService.createArticle(
      articleDto,
      user.email,
    );

    return mapArticleSchema(article, user.email);
  }

  @Get(':slug')
  @UseGuards(new JwtOptionalAuthGuard())
  public async getBySlug(
    @Param('slug')
    slug: string,
    @User() user: IAuthUser,
  ) {
    const article = await this.articleService.getArticleBySlug(slug);

    return mapArticleSchema(article, user?.email);
  }

  @Patch(':slug')
  @UseGuards(new JwtAuthGuard())
  public async updateBySlug(
    @Param('slug')
    slug: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    articleDto: UpdateArticleDto,
    @User() user: IAuthUser,
  ) {
    const article = await this.articleService.updateArticle(
      slug,
      articleDto,
      user.email,
    );

    return mapArticleSchema(article, user.email);
  }

  @Delete(':slug')
  @UseGuards(new JwtAuthGuard())
  public async deleteBySlug(
    @Param('slug')
    slug: string,
    @User() user: IAuthUser,
  ) {
    const article = await this.articleService.deleteArticle(slug, user.email);

    return mapArticleSchema(article, user.email);
  }

  @Post(':slug/favorite')
  @UseGuards(new JwtAuthGuard())
  @HttpCode(200)
  public async addFavorite(
    @Param('slug')
    slug: string,
    @User() user: IAuthUser,
  ) {
    const article = await this.articleService.addToFavorites(slug, user.email);

    return mapArticleSchema(article, user.email);
  }

  @Delete(':slug/favorite')
  @UseGuards(new JwtAuthGuard())
  public async deleteFavorite(
    @Param('slug')
    slug: string,
    @User() user: IAuthUser,
  ) {
    const article = await this.articleService.removeFromFavorites(
      slug,
      user.email,
    );

    return mapArticleSchema(article, user.email);
  }
}
