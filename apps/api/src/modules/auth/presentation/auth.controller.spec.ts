import { NotFoundException } from '@nestjs/common';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthController } from './auth.controller.js';

import type { AuthenticatedRequest } from './guards/jwt-auth.guard.js';

import type { LoginService } from '../application/login.service.js';
import type { RegisterService } from '../application/register.service.js';

import type { LoginResult } from '../application/login.types.js';
import type { RegisterResult } from '../application/register.types.js';

import type { UsersService } from '../../users/application/users.service.js';
import type { User } from '../../users/domain/user.repository.js';

describe('AuthController', () => {
  const registerExecute = vi.fn<RegisterService['execute']>();
  const loginExecute = vi.fn<LoginService['execute']>();

  const findById = vi.fn<UsersService['findById']>();

  const registerService = {
    execute: registerExecute,
  } as unknown as RegisterService;

  const loginService = {
    execute: loginExecute,
  } as unknown as LoginService;

  const usersService = {
    findById,
  } as unknown as UsersService;

  const controller = new AuthController(
    registerService,
    loginService,
    usersService,
  );

  const user: RegisterResult = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@novacv.com',
    firstName: 'Test',
    lastName: 'User',
  };

  const loginResult: LoginResult = {
    id: user.id,
    email: user.email,
    accessToken: 'header.payload.signature',
    tokenType: 'Bearer',
  };

  const databaseUser: User = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: new Date('2026-10-14T10:00:00.000Z'),
    updatedAt: new Date('2026-10-14T10:00:00.000Z'),
  };

  function createRequest(
    authenticatedUser?: {
      id: string;
      email: string;
    },
  ): AuthenticatedRequest {
    return {
      user: authenticatedUser,
    } as AuthenticatedRequest;
  }

  beforeEach(() => {
    vi.resetAllMocks();
  });

  // INSCRIPTION

  it('should register a user', async () => {
    registerExecute.mockResolvedValue(user);

    const input = {
      email: 'test@novacv.com',
      password: 'SecurePassword123!',
      firstName: 'Test',
      lastName: 'User',
    };

    const result = await controller.register(input);

    expect(registerExecute).toHaveBeenCalledWith(input);
    expect(result).toEqual(user);
  });

  it('should return only public user information', async () => {
    registerExecute.mockResolvedValue(user);

    const result = await controller.register({
      email: 'test@novacv.com',
      password: 'SecurePassword123!',
    });

    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('should propagate registration errors', async () => {
    const error = new Error('Registration failed');

    registerExecute.mockRejectedValue(error);

    await expect(
      controller.register({
        email: 'test@novacv.com',
        password: 'SecurePassword123!',
      }),
    ).rejects.toBe(error);
  });

  // CONNEXION

  it('should login a user', async () => {
    loginExecute.mockResolvedValue(loginResult);

    const input = {
      email: 'test@novacv.com',
      password: 'SecurePassword123!',
    };

    const result = await controller.login(input);

    expect(loginExecute).toHaveBeenCalledWith(input);
    expect(result).toEqual(loginResult);
  });

  it('should not expose sensitive information on login', async () => {
    loginExecute.mockResolvedValue(loginResult);

    const result = await controller.login({
      email: 'test@novacv.com',
      password: 'SecurePassword123!',
    });

    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('should propagate login errors', async () => {
    const error = new Error('Invalid credentials');

    loginExecute.mockRejectedValue(error);

    await expect(
      controller.login({
        email: 'test@novacv.com',
        password: 'WrongPassword123!',
      }),
    ).rejects.toBe(error);
  });

  // PROFIL UTILISATEUR CONNECTÉ

  it('should return the authenticated user profile', async () => {
    findById.mockResolvedValue(databaseUser);

    const request = createRequest({
      id: user.id,
      email: user.email,
    });

    const result = await controller.me(request);

    expect(findById).toHaveBeenCalledWith(user.id);
    expect(result).toEqual(databaseUser);
  });

  it('should reject a request without an authenticated user', async () => {
    const request = createRequest();

    await expect(
      controller.me(request),
    ).rejects.toThrow(NotFoundException);

    expect(findById).not.toHaveBeenCalled();
  });

  it('should return 404 when the user no longer exists', async () => {
    findById.mockResolvedValue(null);

    const request = createRequest({
      id: user.id,
      email: user.email,
    });

    await expect(
      controller.me(request),
    ).rejects.toThrow(NotFoundException);

    expect(findById).toHaveBeenCalledWith(user.id);
  });
});
