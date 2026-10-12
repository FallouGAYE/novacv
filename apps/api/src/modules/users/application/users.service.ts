import { Inject, Injectable } from '@nestjs/common';

import type {
  User,
  UserRepository,
} from '../domain/user.repository.js';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
