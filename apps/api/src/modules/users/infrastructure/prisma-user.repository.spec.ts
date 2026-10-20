import { ConflictException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Prisma } from '../../../generated/prisma/client.js';
import { PrismaUserRepository } from './prisma-user.repository.js';

import type { PrismaService } from '../../../infrastructure/database/prisma.service.js';

describe('PrismaUserRepository', () => {
  const input = {
    email: 'test@novacv.com',
    passwordHash: 'hashed-password',
  };

  // Simulation des méthodes Prisma
  const create = vi.fn();
  const findUnique = vi.fn();

  const prisma = {
    user: {
      create,
      findUnique,
    },
  } as unknown as PrismaService;

  const repository = new PrismaUserRepository(prisma);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  // TEST 1 : Adresse e-mail déjà utilisée
  it('should throw ConflictException on Prisma P2002', async () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: '7.10.0',
      },
    );

    create.mockRejectedValueOnce(error);

    await expect(repository.create(input)).rejects.toThrow(
      ConflictException,
    );
  });

  // TEST 2 : Erreur inattendue de la base de données
  it('should preserve unexpected database errors', async () => {
    const error = new Error('Database unavailable');

    create.mockRejectedValueOnce(error);

    await expect(repository.create(input)).rejects.toBe(error);
  });

  // TEST 3 : Récupération des identifiants
  it('should find user credentials by email', async () => {
    const credentials = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@novacv.com',
      passwordHash: '$argon2id$hashed-password',
    };

    findUnique.mockResolvedValueOnce(credentials);

    const result = await repository.findCredentialsByEmail(
      'test@novacv.com',
    );

    expect(result).toEqual(credentials);

    expect(findUnique).toHaveBeenCalledWith({
      where: {
        email: 'test@novacv.com',
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
      },
    });
  });

  // TEST 4 : Utilisateur introuvable
  it('should return null when credentials are not found', async () => {
    findUnique.mockResolvedValueOnce(null);

    const result = await repository.findCredentialsByEmail(
      'unknown@novacv.com',
    );

    expect(result).toBeNull();

    expect(findUnique).toHaveBeenCalledWith({
      where: {
        email: 'unknown@novacv.com',
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
      },
    });
  });
});
