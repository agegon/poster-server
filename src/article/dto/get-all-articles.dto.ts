import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { toNumber } from 'src/utils/transformers';

export class GetAllArticlesDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Get articles by author',
    example: 'test',
    required: false,
  })
  author: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Get favorite articles for user',
    example: 'test',
    required: false,
  })
  favorite_for: string;

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

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Find articles by tag',
    example: 'tag-1',
    required: false,
  })
  tag: string;
}
