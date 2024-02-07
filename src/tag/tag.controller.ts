import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  public async getAll(): Promise<string[]> {
    const tags = await this.tagService.getAll();

    return tags.map((tag) => tag.name);
  }
}
