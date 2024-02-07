import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { Tag } from 'src/tag/tag.entity';
import { UserService } from 'src/user/user.service';

import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetAllArticlesDto } from './dto/get-all-articles.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { GetFeedArticlesDto } from './dto/get-feed-articles.dto';
import { slugify } from 'src/utils/slug';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
    @InjectDataSource() private dataSource: DataSource,
    private userService: UserService,
  ) {}

  public async getAllArticles(
    dto: GetAllArticlesDto,
  ): Promise<{ articles: Article[]; count: number }> {
    const [articles, count] = await this.articleRepository.findAndCount({
      take: dto.limit,
      skip: dto.offset,
      where: {
        author: dto.author ? { username: dto.author } : undefined,
        favorite: dto.favorite_for ? { username: dto.favorite_for } : undefined,
        tags: dto.tag ? { name: dto.tag } : undefined,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return { articles, count };
  }

  public async getFeedArticles(
    dto: GetFeedArticlesDto,
    currentUserEmail: string,
  ): Promise<{ articles: Article[]; count: number }> {
    const followingUsers = await this.userService.getFollowingUsersByEmail(
      currentUserEmail,
    );

    const [articles, count] = await this.articleRepository.findAndCount({
      take: dto.limit,
      skip: dto.offset,
      where: {
        author: {
          email: In(followingUsers.map((u) => u.email)),
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return { articles, count };
  }

  public async getArticleBySlug(slug: string): Promise<Article | null> {
    const article = await this.articleRepository.findOne({
      where: {
        slug,
      },
    });

    if (!article) {
      throw new NotFoundException();
    }

    return article;
  }

  public async createArticle(
    articleDto: CreateArticleDto,
    userEmail: string,
  ): Promise<Article> {
    const author = await this.userService.getUserByEmail(userEmail);

    const article = this.articleRepository.create({
      ...articleDto,
      author,
      slug: slugify(articleDto.title),
      favorite: [],
      tags: [],
    });

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      if (articleDto.tags && articleDto.tags.length >= 0) {
        const existedTags = await this.tagsRepository.find({
          where: {
            name: In(articleDto.tags),
          },
        });

        const tagsToCreate = articleDto.tags
          .filter((tagName) => existedTags.every((tag) => tag.name !== tagName))
          .map((tagName) => this.tagsRepository.create({ name: tagName }));

        const createdTags = await queryRunner.manager.save(tagsToCreate);

        article.tags = articleDto.tags.map((tagName) =>
          [...existedTags, ...createdTags].find((tag) => tag.name === tagName),
        );
      }

      const newArticle = await queryRunner.manager.save(article);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return newArticle;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw error;
    }
  }

  public async updateArticle(
    slug: string,
    articleDto: UpdateArticleDto,
    userEmail: string,
  ): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException();
    }

    if (userEmail !== article.author.email) {
      throw new ForbiddenException();
    }

    Object.assign(article, articleDto);

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      if (articleDto.tags && articleDto.tags.length >= 0) {
        const existedTags = await this.tagsRepository.find({
          where: {
            name: In(articleDto.tags),
          },
        });

        const tagsToCreate = articleDto.tags
          .filter((tagName) => existedTags.every((tag) => tag.name !== tagName))
          .map((tagName) => this.tagsRepository.create({ name: tagName }));

        const createdTags = await queryRunner.manager.save(tagsToCreate);

        article.tags = articleDto.tags.map((tagName) =>
          [...existedTags, ...createdTags].find((tag) => tag.name === tagName),
        );
      }

      const newArticle = await queryRunner.manager.save(article);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return newArticle;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw error;
    }
  }

  public async deleteArticle(
    slug: string,
    userEmail: string,
  ): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException();
    }

    if (userEmail !== article.author.email) {
      throw new ForbiddenException();
    }

    return this.articleRepository.remove(article);
  }

  public async addToFavorites(
    slug: string,
    userEmail: string,
  ): Promise<Article> {
    const [article, user] = await Promise.all([
      this.articleRepository.findOne({
        where: { slug },
      }),
      this.userService.getUserByEmail(userEmail),
    ]);

    if (!article) {
      throw new NotFoundException();
    }

    const isFavorite = article.favorite.some(
      (user) => user.email === userEmail,
    );

    if (isFavorite) {
      return article;
    }

    article.favorite.push(user);

    return this.articleRepository.save(article);
  }

  public async removeFromFavorites(
    slug: string,
    userEmail: string,
  ): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException();
    }

    article.favorite = article.favorite.filter(
      (user) => user.email !== userEmail,
    );

    return this.articleRepository.save(article);
  }
}
