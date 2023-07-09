import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  @MaxLength(100)
  public email: string;

  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(100)
  public username: string;

  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  @Matches(/(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  @ApiProperty()
  public password: string;
}
