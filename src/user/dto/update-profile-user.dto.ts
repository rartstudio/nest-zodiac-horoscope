import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UpdateProfileUserdDto extends PickType(UserDto, [
  'name',
  'countryCode',
  'phoneNumber',
]) {}
