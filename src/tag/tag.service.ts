import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tag } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  public async getAll(): Promise<Tag[]> {
    return this.tagRepository.find({
      order: { name: 'ASC' },
    });
  }

  @Cron('0 0 1 * * *')
  public async removeUnusedTags(): Promise<Tag[]> {
    const tags = await this.tagRepository.find({
      relations: {
        articles: true,
      },
    });

    const tagsToRemove = tags.filter(({ articles }) => !articles.length);
    await this.tagRepository.remove(tagsToRemove);

    return tagsToRemove;
  }
}
