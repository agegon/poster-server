import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { toNumber } from 'src/utils/transformers';

export class GetFeedArticlesDto {
  @Transform(toNumber)
  @IsNumber()
  @ApiProperty({
    description: 'Number of articles in response',
    example: 10,
    default: 10,
    required: false,
    type: 'number',
  })
  limit = 10;

  @Transform(toNumber)
  @IsNumber()
  @ApiProperty({
    description: 'Get articles after index',
    example: 0,
    default: 0,
    required: false,
    type: 'number',
  })
  offset = 0;
}
