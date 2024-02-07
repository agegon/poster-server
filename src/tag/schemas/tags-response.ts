import { ApiProperty } from '@nestjs/swagger';

export class TagsResponseSchema {
  @ApiProperty({
    description: 'List of tags',
    example: ['tag-1', 'tag-2'],
  })
  tags: string[];
}
