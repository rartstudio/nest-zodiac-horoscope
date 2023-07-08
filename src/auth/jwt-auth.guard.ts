import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtStrategy: JwtStrategy) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const request = context.switchToHttp().getRequest();

    try {
      await super.canActivate(context);
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
