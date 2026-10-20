import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConflictException } from '@nestjs/common';

import { RegisterService } from './register.service.js';

import type { PasswordHasher } from '../domain/password-hasher.js';
import type {
  User,
  UserRepository,
} from '../../users/domain/user.repository.js';

describe('RegisterService', () => {
  let service: RegisterService;

  const findById = vi.fn<UserRepository['findById']>();
  const findByEmail = vi.fn<UserRepository['findByEmail']>();

  const findCredentialsByEmail =
    vi.fn<UserRepository['findCredentialsByEmail']>();

  const create = vi.fn<UserRepository['create']>();

  const hash = vi.fn<PasswordHasher['hash']>();
  const verify = vi.fn<PasswordHasher['verify']>();

  const user: User = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@novacv.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date('2026-10-12'),
    updatedAt: new Date('2026-10-12'),
  };

  beforeEach(() => {
    vi.resetAllMocks();

    const userRepository: UserRepository = {
      findById,
      findByEmail,
      findCredentialsByEmail,
      create,
    };

    const passwordHasher: PasswordHasher = {
      hash,
      verify,
    };

    service = new RegisterService(userRepository, passwordHasher);
  });

  it('should register a new user', async () => {
    findByEmail.mockResolvedValue(null);
    hash.mockResolvedValue('hashed-password');
    create.mockResolvedValue(user);

    const result = await service.execute({
      email: 'test@novacv.com',
      password: 'SecurePassword123!',
      firstName: 'Test',
      lastName: 'User',
    });

    expect(result).toEqual({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    expect(create).toHaveBeenCalledWith({
      email: 'test@novacv.com',
      passwordHash: 'hashed-password',
      firstName: 'Test',
      lastName: 'User',
    });
  });

  it('should normalize the email address', async () => {
    findByEmail.mockResolvedValue(null);
    hash.mockResolvedValue('hashed-password');
    create.mockResolvedValue(user);

    await service.execute({
      email: '  TEST@NOVACV.COM  ',
      password: 'SecurePassword123!',
    });

    expect(findByEmail).toHaveBeenCalledWith('test@novacv.com');

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test@novacv.com',
      }),
    );
  });

  it('should reject an already registered email', async () => {
    findByEmail.mockResolvedValue(user);

    await expect(
      service.execute({
        email: 'test@novacv.com',
        password: 'SecurePassword123!',
      }),
    ).rejects.toThrow(ConflictException);

    expect(create).not.toHaveBeenCalled();
    expect(hash).not.toHaveBeenCalled();
  });

  it('should hash the password before creating the user', async () => {
    findByEmail.mockResolvedValue(null);
    hash.mockResolvedValue('argon2-hashed-password');
    create.mockResolvedValue(user);

    await service.execute({
      email: 'test@novacv.com',
      password: 'SecurePassword123!',
    });

    expect(hash).toHaveBeenCalledWith('SecurePassword123!');

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        passwordHash: 'argon2-hashed-password',
      }),
    );
  });

  it('should not expose sensitive information', async () => {
    findByEmail.mockResolvedValue(null);
    hash.mockResolvedValue('hashed-password');
    create.mockResolvedValue(user);

    const result = await service.execute({
      email: 'test@novacv.com',
      password: 'SecurePassword123!',
    });

    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('passwordHash');
  });
});
