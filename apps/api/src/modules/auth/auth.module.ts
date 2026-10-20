import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module.js';

import { TOKEN_SIGNER } from './auth.tokens.js';

import {
  PASSWORD_HASHER,
  RegisterService,
} from './application/register.service.js';

import { LoginService } from './application/login.service.js';

import { Argon2PasswordHasher } from './infrastructure/argon2-password-hasher.js';

import { JwtTokenSigner } from './infrastructure/jwt-token-signer.js';

import { AuthController } from './presentation/auth.controller.js';

import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard.js';

@Module({
  imports: [
    UsersModule,

    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>(
          'JWT_ACCESS_SECRET',
        ),

        signOptions: {
          algorithm: 'HS256',
          expiresIn: '15m',
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    RegisterService,

    LoginService,

    JwtAuthGuard,

    {
      provide: PASSWORD_HASHER,
      useClass: Argon2PasswordHasher,
    },

    {
      provide: TOKEN_SIGNER,
      useClass: JwtTokenSigner,
    },
  ],

  exports: [
    RegisterService,
    LoginService,
    TOKEN_SIGNER,
    JwtModule,
  ],
})
export class AuthModule {}
