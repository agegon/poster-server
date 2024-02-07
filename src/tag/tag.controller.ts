import { Controller, Get } from '@nestjs/common';
import { ITagsResponseSchema } from './tag.interfaces';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  public async getAll(): Promise<ITagsResponseSchema> {
    const tags = await this.tagService.getAll();

    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
