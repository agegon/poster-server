import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthUser } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public signAccessToken(email: string): Promise<string> {
    const payload: IAuthUser = {
      email,
    };

    return this.jwtService.signAsync(payload);
  }
}
