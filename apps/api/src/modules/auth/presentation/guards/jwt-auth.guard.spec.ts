import {
  UnauthorizedException,
} from '@nestjs/common';

import type { ExecutionContext } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  JwtAuthGuard,
} from './jwt-auth.guard.js';

import type {
  AuthenticatedRequest,
} from './jwt-auth.guard.js';

describe('JwtAuthGuard', () => {
  const verifyAsync = vi.fn<JwtService['verifyAsync']>();

  const jwtService = {
    verifyAsync,
  } as unknown as JwtService;

  const guard = new JwtAuthGuard(jwtService);

  const payload = {
    sub: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@novacv.com',
    iat: 1791985090,
    exp: 1791985990,
  };

  function createContext(
    authorization?: string,
  ): {
    context: ExecutionContext;
    request: AuthenticatedRequest;
  } {
    const request = {
      headers: authorization
        ? { authorization }
        : {},
    } as AuthenticatedRequest;

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    return {
      context,
      request,
    };
  }

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should accept a valid JWT', async () => {
    verifyAsync.mockResolvedValue(payload);

    const { context, request } = createContext(
      'Bearer valid-token',
    );

    const result = await guard.canActivate(context);

    expect(result).toBe(true);

    expect(request.user).toEqual({
      id: payload.sub,
      email: payload.email,
    });

    expect(verifyAsync).toHaveBeenCalledWith(
      'valid-token',
      {
        algorithms: ['HS256'],
      },
    );
  });

  it('should reject a missing authorization header', async () => {
    const { context } = createContext();

    await expect(
      guard.canActivate(context),
    ).rejects.toThrow(UnauthorizedException);

    expect(verifyAsync).not.toHaveBeenCalled();
  });

  it('should reject a token without Bearer prefix', async () => {
    const { context } = createContext(
      'Basic valid-token',
    );

    await expect(
      guard.canActivate(context),
    ).rejects.toThrow(UnauthorizedException);

    expect(verifyAsync).not.toHaveBeenCalled();
  });

  it('should reject a malformed authorization header', async () => {
    const { context } = createContext(
      'Bearer token extra',
    );

    await expect(
      guard.canActivate(context),
    ).rejects.toThrow(UnauthorizedException);

    expect(verifyAsync).not.toHaveBeenCalled();
  });

  it('should reject an invalid JWT signature', async () => {
    verifyAsync.mockRejectedValue(
      new Error('Invalid signature'),
    );

    const { context } = createContext(
      'Bearer invalid-token',
    );

    await expect(
      guard.canActivate(context),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should reject an expired JWT', async () => {
    verifyAsync.mockRejectedValue(
      new Error('jwt expired'),
    );

    const { context } = createContext(
      'Bearer expired-token',
    );

    await expect(
      guard.canActivate(context),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should reject a JWT with invalid payload', async () => {
    verifyAsync.mockResolvedValue({
      sub: '',
      email: '',
    });

    const { context } = createContext(
      'Bearer invalid-payload',
    );

    await expect(
      guard.canActivate(context),
    ).rejects.toThrow(UnauthorizedException);
  });
});
