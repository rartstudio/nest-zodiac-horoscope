import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class ChangeEmailUserdDto extends PickType(UserDto, ['email']) {}
