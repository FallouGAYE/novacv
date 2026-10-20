import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { USER_REPOSITORY } from '../../users/application/users.service.js';

import type { UserRepository } from '../../users/domain/user.repository.js';

import { PASSWORD_HASHER } from './register.service.js';

import type { PasswordHasher } from '../domain/password-hasher.js';

import { TOKEN_SIGNER } from '../auth.tokens.js';

import type { TokenSigner } from '../domain/token-signer.js';

import type {
  LoginInput,
  LoginResult,
} from './login.types.js';

@Injectable()
export class LoginService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,

    @Inject(TOKEN_SIGNER)
    private readonly tokenSigner: TokenSigner,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const email = input.email.trim().toLowerCase();

    const credentials =
      await this.userRepository.findCredentialsByEmail(email);

    if (!credentials?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordHasher.verify(
      credentials.passwordHash,
      input.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.tokenSigner.signAccessToken({
      sub: credentials.id,
      email: credentials.email,
    });

    return {
      id: credentials.id,
      email: credentials.email,
      accessToken,
      tokenType: 'Bearer',
    };
  }
}
