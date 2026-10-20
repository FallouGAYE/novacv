import { describe, expect, it } from 'vitest';

import { Argon2PasswordHasher } from './argon2-password-hasher.js';

describe('Argon2PasswordHasher', () => {
  const passwordHasher = new Argon2PasswordHasher();

  const password = 'NovaCV-SecurePassword-2026!';

  it('should hash a password using Argon2id', async () => {
    const hash = await passwordHasher.hash(password);

    expect(hash).not.toBe(password);
    expect(hash).toMatch(/^\$argon2id\$/);
  });

  it('should verify a correct password', async () => {
    const hash = await passwordHasher.hash(password);

    const result = await passwordHasher.verify(hash, password);

    expect(result).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const hash = await passwordHasher.hash(password);

    const result = await passwordHasher.verify(
      hash,
      'WrongPassword123!',
    );

    expect(result).toBe(false);
  });

  it('should generate different hashes for the same password', async () => {
    const firstHash = await passwordHasher.hash(password);
    const secondHash = await passwordHasher.hash(password);

    expect(firstHash).not.toBe(secondHash);
  });
});
