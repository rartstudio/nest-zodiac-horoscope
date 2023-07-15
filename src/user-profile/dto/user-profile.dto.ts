import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  MaxLength,
  IsDate,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class UserProfileDto {
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(100)
  public name: string;

  @IsNotEmpty()
  @ApiProperty()
  public gender: Gender;

  @IsNotEmpty()
  @ApiProperty()
  @IsDateString()
  public birthDate: string; // YYYY-MM-DD

  @IsNotEmpty()
  @ApiProperty()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  public height: number;

  @IsNotEmpty()
  @ApiProperty()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  public weight: number;

  @ApiProperty()
  public image: string;
}
