import { UnauthorizedException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginService } from './login.service.js';

import type { PasswordHasher } from '../domain/password-hasher.js';
import type { TokenSigner } from '../domain/token-signer.js';
import type { UserRepository } from '../../users/domain/user.repository.js';

describe('LoginService', () => {
  let service: LoginService;

  const findById = vi.fn<UserRepository['findById']>();
  const findByEmail = vi.fn<UserRepository['findByEmail']>();

  const findCredentialsByEmail =
    vi.fn<UserRepository['findCredentialsByEmail']>();

  const create = vi.fn<UserRepository['create']>();

  const hash = vi.fn<PasswordHasher['hash']>();
  const verify = vi.fn<PasswordHasher['verify']>();

  const signAccessToken = vi.fn<TokenSigner['signAccessToken']>();

  const accessToken = 'header.payload.signature';

  const credentials = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@novacv.com',
    passwordHash: '$argon2id$hashed-password',
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

    const tokenSigner: TokenSigner = {
      signAccessToken,
    };

    signAccessToken.mockResolvedValue(accessToken);

    service = new LoginService(
      userRepository,
      passwordHasher,
      tokenSigner,
    );
  });

  // TESTS DE CONNEXION

  it('should login with valid credentials', async () => {
    findCredentialsByEmail.mockResolvedValue(credentials);
    verify.mockResolvedValue(true);

    const result = await service.execute({
      email: 'test@novacv.com',
      password: 'SecurePassword123!',
    });

    expect(result).toEqual({
      id: credentials.id,
      email: credentials.email,
      accessToken,
      tokenType: 'Bearer',
    });

    expect(verify).toHaveBeenCalledWith(
      credentials.passwordHash,
      'SecurePassword123!',
    );
  });

  it('should normalize the email address', async () => {
    findCredentialsByEmail.mockResolvedValue(credentials);
    verify.mockResolvedValue(true);

    await service.execute({
      email: '  TEST@NOVACV.COM  ',
      password: 'SecurePassword123!',
    });

    expect(findCredentialsByEmail).toHaveBeenCalledWith(
      'test@novacv.com',
    );
  });

  it('should reject an unknown user', async () => {
    findCredentialsByEmail.mockResolvedValue(null);

    await expect(
      service.execute({
        email: 'unknown@novacv.com',
        password: 'SecurePassword123!',
      }),
    ).rejects.toThrow(UnauthorizedException);

    expect(verify).not.toHaveBeenCalled();
    expect(signAccessToken).not.toHaveBeenCalled();
  });

  it('should reject an incorrect password', async () => {
    findCredentialsByEmail.mockResolvedValue(credentials);
    verify.mockResolvedValue(false);

    await expect(
      service.execute({
        email: 'test@novacv.com',
        password: 'WrongPassword123!',
      }),
    ).rejects.toThrow(UnauthorizedException);

    expect(signAccessToken).not.toHaveBeenCalled();
  });

  it('should reject an account without a password', async () => {
    findCredentialsByEmail.mockResolvedValue({
      ...credentials,
      passwordHash: null,
    });

    await expect(
      service.execute({
        email: 'test@novacv.com',
        password: 'SecurePassword123!',
      }),
    ).rejects.toThrow(UnauthorizedException);

    expect(verify).not.toHaveBeenCalled();
    expect(signAccessToken).not.toHaveBeenCalled();
  });

  it('should not expose sensitive information', async () => {
    findCredentialsByEmail.mockResolvedValue(credentials);
    verify.mockResolvedValue(true);

    const result = await service.execute({
      email: 'test@novacv.com',
      password: 'SecurePassword123!',
    });

    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('should use the same error for unknown users and wrong passwords', async () => {
    findCredentialsByEmail.mockResolvedValueOnce(null);

    await expect(
      service.execute({
        email: 'unknown@novacv.com',
        password: 'SecurePassword123!',
      }),
    ).rejects.toThrow('Invalid credentials');

    findCredentialsByEmail.mockResolvedValueOnce(credentials);
    verify.mockResolvedValueOnce(false);

    await expect(
      service.execute({
        email: 'test@novacv.com',
        password: 'WrongPassword123!',
      }),
    ).rejects.toThrow('Invalid credentials');

    expect(signAccessToken).not.toHaveBeenCalled();
  });

  // TESTS JWT

  it('should generate a JWT after successful authentication', async () => {
    findCredentialsByEmail.mockResolvedValue(credentials);
    verify.mockResolvedValue(true);

    const result = await service.execute({
      email: 'test@novacv.com',
      password: 'SecurePassword123!',
    });

    expect(signAccessToken).toHaveBeenCalledOnce();
    expect(result.accessToken).toBe(accessToken);
    expect(result.tokenType).toBe('Bearer');
  });

  it('should sign the JWT with user ID and email', async () => {
    findCredentialsByEmail.mockResolvedValue(credentials);
    verify.mockResolvedValue(true);

    await service.execute({
      email: 'test@novacv.com',
      password: 'SecurePassword123!',
    });

    expect(signAccessToken).toHaveBeenCalledWith({
      sub: credentials.id,
      email: credentials.email,
    });
  });

  it('should propagate JWT signing errors', async () => {
    findCredentialsByEmail.mockResolvedValue(credentials);
    verify.mockResolvedValue(true);

    const error = new Error('JWT signing failed');

    signAccessToken.mockRejectedValue(error);

    await expect(
      service.execute({
        email: 'test@novacv.com',
        password: 'SecurePassword123!',
      }),
    ).rejects.toBe(error);
  });
});
