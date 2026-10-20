import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type {
  TokenPayload,
  TokenSigner,
} from '../domain/token-signer.js';

@Injectable()
export class JwtTokenSigner implements TokenSigner {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async signAccessToken(
    payload: TokenPayload,
  ): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: payload.sub,
        email: payload.email,
      },
      {
        algorithm: 'HS256',
        expiresIn: '15m',
      },
    );
  }
}
