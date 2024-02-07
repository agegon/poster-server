import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

import { IAuthUser } from 'src/auth/auth.interfaces';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtOptionalAuthGuard } from 'src/auth/guards/jwt-optional.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { mapArticleSchema } from './article.mappers';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetAllArticlesDto } from './dto/get-all-articles.dto';
import { GetFeedArticlesDto } from './dto/get-feed-articles.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseSchema } from './schemas/article-response';
import { ArticlesResponseSchema } from './schemas/articles-response';

@ApiBearerAuth()
@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @UseGuards(new JwtOptionalAuthGuard())
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all found articles.',
    type: ArticlesResponseSchema,
  })
  public async getAll(
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllArticlesDto,
    @User() user: IAuthUser,
  ): Promise<ArticlesResponseSchema> {
    const { articles, count } = await this.articleService.getAllArticles(query);

    return {
      articles: articles.map((article) =>
        mapArticleSchema(article, user?.email),
      ),
      articlesCount: count,
    };
  }

  @Get('feed')
  @UseGuards(new JwtAuthGuard())
  @ApiOperation({ summary: 'Get all articles from following users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all found articles from following users.',
    type: ArticlesResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized users do not have following users',
  })
  public async getFeed(
    @Query(new ValidationPipe({ transform: true }))
    query: GetFeedArticlesDto,
    @User() user: IAuthUser,
  ): Promise<ArticlesResponseSchema> {
    const { articles, count } = await this.articleService.getFeedArticles(
      query,
      user.email,
    );

    return {
      articles: articles.map((article) =>
        mapArticleSchema(article, user?.email),
      ),
      articlesCount: count,
    };
  }

  @Post()
  @UseGuards(new JwtAuthGuard())
  @ApiOperation({ summary: 'Create an article' })
  @ApiBody({ type: CreateArticleDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns current article',
    type: ArticleResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized users cannot create an article',
  })
  public async create(
    @Body(new ValidationPipe())
    articleDto: CreateArticleDto,
    @User() user: IAuthUser,
  ): Promise<ArticleResponseSchema> {
    const article = await this.articleService.createArticle(
      articleDto,
      user.email,
    );

    return {
      article: mapArticleSchema(article, user.email),
    };
  }

  @Get(':slug')
  @UseGuards(new JwtOptionalAuthGuard())
  @ApiOperation({ summary: 'Get the article by slug' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns current article',
    type: ArticleResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The article was not found',
  })
  public async getBySlug(
    @Param('slug')
    slug: string,
    @User() user: IAuthUser,
  ): Promise<ArticleResponseSchema> {
    const article = await this.articleService.getArticleBySlug(slug);

    return {
      article: mapArticleSchema(article, user?.email),
    };
  }

  @Patch(':slug')
  @UseGuards(new JwtAuthGuard())
  @ApiOperation({ summary: 'Update the article by slug' })
  @ApiBody({ type: UpdateArticleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns current article',
    type: ArticleResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized users cannot update an article',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Current user cannot update the article',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The article was not found',
  })
  public async updateBySlug(
    @Param('slug')
    slug: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    articleDto: UpdateArticleDto,
    @User() user: IAuthUser,
  ): Promise<ArticleResponseSchema> {
    const article = await this.articleService.updateArticle(
      slug,
      articleDto,
      user.email,
    );

    return {
      article: mapArticleSchema(article, user.email),
    };
  }

  @Delete(':slug')
  @UseGuards(new JwtAuthGuard())
  @ApiOperation({ summary: 'Delete the article by slug' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns current article',
    type: ArticleResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized users cannot delete an article',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Current user cannot delete the article',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The article was not found',
  })
  public async deleteBySlug(
    @Param('slug')
    slug: string,
    @User() user: IAuthUser,
  ): Promise<ArticleResponseSchema> {
    const article = await this.articleService.deleteArticle(slug, user.email);

    return {
      article: mapArticleSchema(article, user.email),
    };
  }

  @Post(':slug/favorite')
  @UseGuards(new JwtAuthGuard())
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add article to favorite' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns current article',
    type: ArticleResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized users cannot add an article to favorite',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The article was not found',
  })
  public async addFavorite(
    @Param('slug')
    slug: string,
    @User() user: IAuthUser,
  ): Promise<ArticleResponseSchema> {
    const article = await this.articleService.addToFavorites(slug, user.email);

    return {
      article: mapArticleSchema(article, user.email),
    };
  }

  @Delete(':slug/favorite')
  @UseGuards(new JwtAuthGuard())
  @ApiOperation({ summary: 'Delete article from favorite' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns current article',
    type: ArticleResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized users cannot delete an article from favorite',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The article was not found',
  })
  public async deleteFavorite(
    @Param('slug')
    slug: string,
    @User() user: IAuthUser,
  ): Promise<ArticleResponseSchema> {
    const article = await this.articleService.removeFromFavorites(
      slug,
      user.email,
    );

    return {
      article: mapArticleSchema(article, user.email),
    };
  }
}
