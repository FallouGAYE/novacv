import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UsersService } from './users.service.js';

import type {
  User,
  UserRepository,
} from '../domain/user.repository.js';

describe('UsersService', () => {
  let service: UsersService;

  // Mock des méthodes du repository
  const findById = vi.fn<UserRepository['findById']>();
  const findByEmail = vi.fn<UserRepository['findByEmail']>();

  const findCredentialsByEmail =
    vi.fn<UserRepository['findCredentialsByEmail']>();

  const create = vi.fn<UserRepository['create']>();

  // Utilisateur utilisé pour les tests
  const user: User = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@novacv.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date('2026-10-12'),
    updatedAt: new Date('2026-10-12'),
  };

  beforeEach(() => {
    // Réinitialisation des mocks avant chaque test
    vi.resetAllMocks();

    const repository: UserRepository = {
      findById,
      findByEmail,
      findCredentialsByEmail,
      create,
    };

    service = new UsersService(repository);
  });

  it('should find a user by ID', async () => {
    findById.mockResolvedValue(user);

    const result = await service.findById(user.id);

    expect(result).toEqual(user);
    expect(findById).toHaveBeenCalledWith(user.id);
  });

  it('should return null when user ID does not exist', async () => {
    findById.mockResolvedValue(null);

    const result = await service.findById('unknown-id');

    expect(result).toBeNull();
  });

  it('should find a user by email', async () => {
    findByEmail.mockResolvedValue(user);

    const result = await service.findByEmail(user.email);

    expect(result).toEqual(user);
    expect(findByEmail).toHaveBeenCalledWith(user.email);
  });

  it('should return null when email does not exist', async () => {
    findByEmail.mockResolvedValue(null);

    const result = await service.findByEmail('unknown@novacv.com');

    expect(result).toBeNull();
  });
});
