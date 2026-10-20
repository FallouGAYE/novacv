import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnv } from './config/env.validation.js';

import { DatabaseModule } from './infrastructure/database/database.module.js';

import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { ResumesModule } from './modules/resumes/resumes.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),

    DatabaseModule,
    UsersModule,
    AuthModule,
    ResumesModule,
  ],
})
export class AppModule {}
