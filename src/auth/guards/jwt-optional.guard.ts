import { AuthGuard } from '@nestjs/passport';

export class JwtOptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest(_, user) {
    return user;
  }
}
