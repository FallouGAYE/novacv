import {
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  USER_REPOSITORY,
} from '../../users/application/users.service.js';

import type {
  UserRepository,
} from '../../users/domain/user.repository.js';

import type {
  PasswordHasher,
} from '../domain/password-hasher.js';

import type {
  RegisterInput,
  RegisterResult,
} from './register.types.js';

export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

@Injectable()
export class RegisterService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterResult> {
    const email = input.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = await this.userRepository.create({
      email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
