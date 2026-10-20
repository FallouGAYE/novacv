import { describe, expect, it } from 'vitest';

import { registerSchema } from './register.dto.js';

describe('RegisterDto', () => {
  const validInput = {
    email: 'test@novacv.com',
    password: 'SecurePassword123!',
    firstName: 'Test',
    lastName: 'User',
  };

  it('should accept valid registration data', () => {
    const result = registerSchema.safeParse(validInput);

    expect(result.success).toBe(true);
  });

  it('should reject an invalid email', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      email: 'invalid-email',
    });

    expect(result.success).toBe(false);
  });

  it('should reject a password shorter than 12 characters', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      password: '123456',
    });

    expect(result.success).toBe(false);
  });

  it('should reject a password longer than 128 characters', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      password: 'A'.repeat(129),
    });

    expect(result.success).toBe(false);
  });

  it('should accept missing optional names', () => {
    const result = registerSchema.safeParse({
      email: 'test@novacv.com',
      password: 'SecurePassword123!',
    });

    expect(result.success).toBe(true);
  });

  it('should reject an empty first name', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      firstName: '   ',
    });

    expect(result.success).toBe(false);
  });

  it('should trim first and last names', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      firstName: '  Test  ',
      lastName: '  User  ',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.firstName).toBe('Test');
      expect(result.data.lastName).toBe('User');
    }
  });

  it('should reject unknown fields', () => {
    const result = registerSchema.safeParse({
      ...validInput,
      role: 'ADMIN',
    });

    expect(result.success).toBe(false);
  });
});
