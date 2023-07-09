import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsNotEmpty, MaxLength, IsDate, IsNumber } from 'class-validator';

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
  @IsDate()
  public birthDate: string; // YYYY-MM-DD

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  public height: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  public weight: number;

  @ApiProperty()
  public image: string;
}
