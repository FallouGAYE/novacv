import {
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import type { INestApplication } from '@nestjs/common';
import type { Server } from 'node:http';

import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import request from 'supertest';

import { AuthController } from './auth.controller.js';

import { LoginService } from '../application/login.service.js';
import { RegisterService } from '../application/register.service.js';

import { UsersService } from '../../users/application/users.service.js';

import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

import type { LoginResult } from '../application/login.types.js';
import type { RegisterResult } from '../application/register.types.js';
import type { User } from '../../users/domain/user.repository.js';

describe('AuthController HTTP', () => {
  let app: INestApplication;

  const registerExecute = vi.fn<RegisterService['execute']>();
  const loginExecute = vi.fn<LoginService['execute']>();

  const findById = vi.fn<UsersService['findById']>();

  const verifyAsync = vi.fn<JwtService['verifyAsync']>();

  const user: RegisterResult = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@novacv.com',
    firstName: 'Test',
    lastName: 'User',
  };

  const loginResult: LoginResult = {
    id: user.id,
    email: user.email,
    accessToken: 'header.payload.signature',
    tokenType: 'Bearer',
  };

  const databaseUser: User = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: new Date('2026-10-14T10:00:00.000Z'),
    updatedAt: new Date('2026-10-14T10:00:00.000Z'),
  };

  const validRegisterInput = {
    email: 'test@novacv.com',
    password: 'SecurePassword123!',
    firstName: 'Test',
    lastName: 'User',
  };

  const validLoginInput = {
    email: 'test@novacv.com',
    password: 'SecurePassword123!',
  };

  const validJwtPayload = {
    sub: user.id,
    email: user.email,
    iat: 1791985090,
    exp: 1791985990,
  };

  const httpServer = () => app.getHttpServer() as Server;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],

      providers: [
        {
          provide: RegisterService,
          useValue: {
            execute: registerExecute,
          },
        },
        {
          provide: LoginService,
          useValue: {
            execute: loginExecute,
          },
        },
        {
          provide: UsersService,
          useValue: {
            findById,
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync,
          },
        },
        JwtAuthGuard,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterAll(async () => {
    await app?.close();
  });

  // INSCRIPTION

  it('should return 201 when registration succeeds', async () => {
    registerExecute.mockResolvedValue(user);

    const response = await request(httpServer())
      .post('/auth/register')
      .send(validRegisterInput)
      .expect(201);

    expect(response.body).toEqual(user);

    expect(registerExecute).toHaveBeenCalledWith(
      validRegisterInput,
    );
  });

  it('should return 409 when email is already registered', async () => {
    registerExecute.mockRejectedValue(
      new ConflictException('Email already registered'),
    );

    await request(httpServer())
      .post('/auth/register')
      .send(validRegisterInput)
      .expect(409);
  });

  it('should return 400 for invalid registration email', async () => {
    await request(httpServer())
      .post('/auth/register')
      .send({
        ...validRegisterInput,
        email: 'invalid-email',
      })
      .expect(400);

    expect(registerExecute).not.toHaveBeenCalled();
  });

  it('should return 400 for short registration password', async () => {
    await request(httpServer())
      .post('/auth/register')
      .send({
        ...validRegisterInput,
        password: '12345',
      })
      .expect(400);

    expect(registerExecute).not.toHaveBeenCalled();
  });

  it('should reject unknown registration fields', async () => {
    await request(httpServer())
      .post('/auth/register')
      .send({
        ...validRegisterInput,
        role: 'ADMIN',
      })
      .expect(400);

    expect(registerExecute).not.toHaveBeenCalled();
  });

  it('should not expose sensitive information on registration', async () => {
    registerExecute.mockResolvedValue(user);

    const response = await request(httpServer())
      .post('/auth/register')
      .send(validRegisterInput)
      .expect(201);

    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  // CONNEXION

  it('should return 200 when login succeeds', async () => {
    loginExecute.mockResolvedValue(loginResult);

    const response = await request(httpServer())
      .post('/auth/login')
      .send(validLoginInput)
      .expect(200);

    expect(response.body).toEqual(loginResult);

    expect(loginExecute).toHaveBeenCalledWith(validLoginInput);
  });

  it('should return 401 for invalid credentials', async () => {
    loginExecute.mockRejectedValue(
      new UnauthorizedException('Invalid credentials'),
    );

    await request(httpServer())
      .post('/auth/login')
      .send({
        ...validLoginInput,
        password: 'WrongPassword123!',
      })
      .expect(401);
  });

  it('should return 400 for invalid login email', async () => {
    await request(httpServer())
      .post('/auth/login')
      .send({
        ...validLoginInput,
        email: 'invalid-email',
      })
      .expect(400);

    expect(loginExecute).not.toHaveBeenCalled();
  });

  it('should return 400 for empty login password', async () => {
    await request(httpServer())
      .post('/auth/login')
      .send({
        ...validLoginInput,
        password: '',
      })
      .expect(400);

    expect(loginExecute).not.toHaveBeenCalled();
  });

  it('should reject unknown login fields', async () => {
    await request(httpServer())
      .post('/auth/login')
      .send({
        ...validLoginInput,
        role: 'ADMIN',
      })
      .expect(400);

    expect(loginExecute).not.toHaveBeenCalled();
  });

  it('should not expose sensitive information on login', async () => {
    loginExecute.mockResolvedValue(loginResult);

    const response = await request(httpServer())
      .post('/auth/login')
      .send(validLoginInput)
      .expect(200);

    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  // ROUTE PROTÉGÉE /auth/me

  it('should return 200 with a valid JWT', async () => {
    verifyAsync.mockResolvedValue(validJwtPayload);
    findById.mockResolvedValue(databaseUser);

    const response = await request(httpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer valid-token')
      .expect(200);

    expect(response.body).toEqual({
      ...databaseUser,
      createdAt: databaseUser.createdAt.toISOString(),
      updatedAt: databaseUser.updatedAt.toISOString(),
    });

    expect(verifyAsync).toHaveBeenCalledWith(
      'valid-token',
      {
        algorithms: ['HS256'],
      },
    );

    expect(findById).toHaveBeenCalledWith(user.id);
  });

  it('should return 401 without a JWT', async () => {
    await request(httpServer())
      .get('/auth/me')
      .expect(401);

    expect(verifyAsync).not.toHaveBeenCalled();
    expect(findById).not.toHaveBeenCalled();
  });

  it('should return 401 for an invalid JWT', async () => {
    verifyAsync.mockRejectedValue(
      new Error('Invalid signature'),
    );

    await request(httpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);

    expect(findById).not.toHaveBeenCalled();
  });

  it('should return 401 for an expired JWT', async () => {
    verifyAsync.mockRejectedValue(
      new Error('jwt expired'),
    );

    await request(httpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer expired-token')
      .expect(401);

    expect(findById).not.toHaveBeenCalled();
  });

  it('should return 404 when the user no longer exists', async () => {
    verifyAsync.mockResolvedValue(validJwtPayload);
    findById.mockResolvedValue(null);

    await request(httpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer valid-token')
      .expect(404);

    expect(findById).toHaveBeenCalledWith(user.id);
  });

  it('should not expose sensitive information on /auth/me', async () => {
    verifyAsync.mockResolvedValue(validJwtPayload);
    findById.mockResolvedValue(databaseUser);

    const response = await request(httpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer valid-token')
      .expect(200);

    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('passwordHash');
  });
});
