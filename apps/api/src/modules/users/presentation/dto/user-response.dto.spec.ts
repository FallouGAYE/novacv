import { describe, expect, it } from 'vitest';

import { UserResponseDto } from './user-response.dto.js';

import type { User } from '../../domain/user.repository.js';

describe('UserResponseDto', () => {
  it('should return only public user information', () => {
    const user: User = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@novacv.com',
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date('2026-10-12'),
      updatedAt: new Date('2026-10-12'),
    };

    const result = UserResponseDto.fromDomain(user);

    expect(result).toEqual({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    expect(result).not.toHaveProperty('passwordHash');
    expect(result).not.toHaveProperty('createdAt');
    expect(result).not.toHaveProperty('updatedAt');
  });
});
