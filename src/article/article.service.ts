import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { Tag } from 'src/tag/tag.entity';
import { UserService } from 'src/user/user.service';

import { EXISTED_ARTICLE_SLUG_ERROR } from './article.constants';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article-dto';
import { GetAllArticlesDto } from './dto/get-all-articles-dto';
import { UpdateArticleDto } from './dto/update-article-dto';

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

  public async getAllArticles(dto: GetAllArticlesDto): Promise<Article[]> {
    return this.articleRepository.find({
      take: dto.limit,
      skip: dto.offset,
      where: {
        author:
          'author' in dto && !('favorited' in dto)
            ? { username: dto.author }
            : undefined,
        // TODO: Add favorite_for_user field as username for searching favorite for certain user
        favorite:
          'author' in dto && 'favorited' in dto
            ? { username: dto.author }
            : undefined,
        tags: 'tag' in dto ? { name: dto.tag } : undefined,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        author: true,
        favorite: true,
        tags: true,
      },
    });
  }

  public async getArticleBySlug(slug: string): Promise<Article | null> {
    const article = await this.articleRepository.findOne({
      where: {
        slug,
      },
      relations: {
        author: true,
        favorite: true,
        tags: true,
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
    const existedArticle = await this.articleRepository.findOne({
      where: { slug: articleDto.slug },
    });

    if (existedArticle) {
      throw new UnprocessableEntityException(EXISTED_ARTICLE_SLUG_ERROR);
    }

    const article = this.articleRepository.create({
      ...articleDto,
      author,
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
      relations: {
        author: true,
        favorite: true,
        tags: true,
      },
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
      relations: {
        author: true,
        favorite: true,
        tags: true,
      },
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
        relations: {
          author: true,
          favorite: true,
          tags: true,
        },
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
      relations: {
        author: true,
        favorite: true,
        tags: true,
      },
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
