import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagsResponseSchema } from './schemas/tags-response';
import { TagService } from './tag.service';

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available tags' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all tags.',
    type: TagsResponseSchema,
  })
  public async getAll(): Promise<TagsResponseSchema> {
    const tags = await this.tagService.getAll();

    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
