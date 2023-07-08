import { PickType } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';

export class ForgotPasswordDto extends PickType(UserDto, ['email']) {}
