import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PostDto {
  @IsNotEmpty()
  @ApiProperty()
  public content: string;
}
