import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../infrastructure/database/database.module.js';

import {
  USER_REPOSITORY,
  UsersService,
} from './application/users.service.js';

import { PrismaUserRepository } from './infrastructure/prisma-user.repository.js';

@Module({
  imports: [DatabaseModule],

  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],

  exports: [
    UsersService,
    USER_REPOSITORY,
  ],
})
export class UsersModule {}
