import { describe, expect, it } from 'vitest';

import { validateEnv } from './env.validation.js';

const validDatabaseUrl =
  'postgresql://novacv:test_password@localhost:5433/novacv_db';

describe('validateEnv', () => {
  it('should use default values when optional configuration is missing', () => {
    const config = validateEnv({
      DATABASE_URL: validDatabaseUrl,
    });

    expect(config.NODE_ENV).toBe('development');
    expect(config.PORT).toBe(3001);
    expect(config.DATABASE_URL).toBe(validDatabaseUrl);
  });

  it('should accept a valid configuration', () => {
    const config = validateEnv({
      NODE_ENV: 'production',
      PORT: '8080',
      DATABASE_URL: validDatabaseUrl,
    });

    expect(config.NODE_ENV).toBe('production');
    expect(config.PORT).toBe(8080);
    expect(config.DATABASE_URL).toBe(validDatabaseUrl);
  });

  it('should reject a non-numeric port', () => {
    expect(() =>
      validateEnv({
        PORT: 'abc',
        DATABASE_URL: validDatabaseUrl,
      }),
    ).toThrow();
  });

  it('should reject a port outside the allowed range', () => {
    expect(() =>
      validateEnv({
        PORT: '99999',
        DATABASE_URL: validDatabaseUrl,
      }),
    ).toThrow();
  });

  it('should reject an invalid environment', () => {
    expect(() =>
      validateEnv({
        NODE_ENV: 'invalid',
        DATABASE_URL: validDatabaseUrl,
      }),
    ).toThrow();
  });

  it('should reject a missing database URL', () => {
    expect(() =>
      validateEnv({
        NODE_ENV: 'development',
        PORT: 3001,
      }),
    ).toThrow();
  });

  it('should reject an empty database URL', () => {
    expect(() =>
      validateEnv({
        DATABASE_URL: '',
      }),
    ).toThrow();
  });

  it('should reject an invalid database URL', () => {
    expect(() =>
      validateEnv({
        DATABASE_URL: 'mysql://localhost:3306/novacv',
      }),
    ).toThrow();
  });

  it('should accept a PostgreSQL connection URL', () => {
    const config = validateEnv({
      DATABASE_URL: validDatabaseUrl,
    });

    expect(config.DATABASE_URL).toBe(validDatabaseUrl);
  });
});
