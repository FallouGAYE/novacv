import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { JwtService } from '@nestjs/jwt';

import { JwtTokenSigner } from './jwt-token-signer.js';

describe('JwtTokenSigner', () => {
  const signAsync = vi.fn<JwtService['signAsync']>();

  const jwtService = {
    signAsync,
  } as unknown as JwtService;

  const tokenSigner = new JwtTokenSigner(jwtService);

  const payload = {
    sub: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@novacv.com',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should sign an access token', async () => {
    signAsync.mockResolvedValue('signed.jwt.token');

    const result = await tokenSigner.signAccessToken(payload);

    expect(result).toBe('signed.jwt.token');
  });

  it('should include user ID and email in the payload', async () => {
    signAsync.mockResolvedValue('signed.jwt.token');

    await tokenSigner.signAccessToken(payload);

    expect(signAsync).toHaveBeenCalledWith(
      {
        sub: payload.sub,
        email: payload.email,
      },
      expect.any(Object),
    );
  });

  it('should use HS256 algorithm', async () => {
    signAsync.mockResolvedValue('signed.jwt.token');

    await tokenSigner.signAccessToken(payload);

    expect(signAsync).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        algorithm: 'HS256',
      }),
    );
  });

  it('should set access token expiration to 15 minutes', async () => {
    signAsync.mockResolvedValue('signed.jwt.token');

    await tokenSigner.signAccessToken(payload);

    expect(signAsync).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        expiresIn: '15m',
      }),
    );
  });

  it('should propagate JWT signing errors', async () => {
    const error = new Error('JWT signing failed');

    signAsync.mockRejectedValue(error);

    await expect(
      tokenSigner.signAccessToken(payload),
    ).rejects.toBe(error);
  });
});
