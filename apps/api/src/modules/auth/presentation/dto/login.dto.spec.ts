import { describe, expect, it } from 'vitest';

import { loginSchema } from './login.dto.js';

describe('loginSchema', () => {
  const validInput = {
    email: 'test@novacv.com',
    password: 'SecurePassword123!',
  };

  it('should accept valid login data', () => {
    const result = loginSchema.safeParse(validInput);

    expect(result.success).toBe(true);
  });

  it('should reject an invalid email', () => {
    const result = loginSchema.safeParse({
      ...validInput,
      email: 'invalid-email',
    });

    expect(result.success).toBe(false);
  });

  it('should reject an empty password', () => {
    const result = loginSchema.safeParse({
      ...validInput,
      password: '',
    });

    expect(result.success).toBe(false);
  });

  it('should accept a short password for existing accounts', () => {
    const result = loginSchema.safeParse({
      ...validInput,
      password: '12345',
    });

    expect(result.success).toBe(true);
  });

  it('should reject unknown fields', () => {
    const result = loginSchema.safeParse({
      ...validInput,
      role: 'ADMIN',
    });

    expect(result.success).toBe(false);
  });

  it('should reject a password that is not a string', () => {
    const result = loginSchema.safeParse({
      ...validInput,
      password: 123456,
    });

    expect(result.success).toBe(false);
  });

  it('should reject a missing email', () => {
    const result = loginSchema.safeParse({
      password: 'SecurePassword123!',
    });

    expect(result.success).toBe(false);
  });

  it('should reject a missing password', () => {
    const result = loginSchema.safeParse({
      email: 'test@novacv.com',
    });

    expect(result.success).toBe(false);
  });
});
