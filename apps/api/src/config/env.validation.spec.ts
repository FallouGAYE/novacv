import { describe, expect, it } from 'vitest';

import { validateEnv } from './env.validation.js';

describe('validateEnv', () => {
  it('should use default values when configuration is empty', () => {
    const config = validateEnv({});

    expect(config.NODE_ENV).toBe('development');
    expect(config.PORT).toBe(3001);
  });

  it('should accept a valid configuration', () => {
    const config = validateEnv({
      NODE_ENV: 'production',
      PORT: '8080',
    });

    expect(config.NODE_ENV).toBe('production');
    expect(config.PORT).toBe(8080);
  });

  it('should reject a non-numeric port', () => {
    expect(() =>
      validateEnv({
        PORT: 'abc',
      }),
    ).toThrow();
  });

  it('should reject a port outside the allowed range', () => {
    expect(() =>
      validateEnv({
        PORT: '99999',
      }),
    ).toThrow();
  });

  it('should reject an invalid environment', () => {
    expect(() =>
      validateEnv({
        NODE_ENV: 'invalid',
      }),
    ).toThrow();
  });
});
