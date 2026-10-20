import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { ZodValidationPipe } from './zod-validation.pipe.js';

describe('ZodValidationPipe', () => {
  const schema = z.strictObject({
    email: z.email(),
    firstName: z.string().trim().min(1),
  });

  const pipe = new ZodValidationPipe(schema);

  it('should accept valid data', () => {
    const input = {
      email: 'test@novacv.com',
      firstName: 'Fallou',
    };

    expect(pipe.transform(input)).toEqual(input);
  });

  it('should reject invalid data', () => {
    const input = {
      email: 'invalid-email',
      firstName: 'Fallou',
    };

    expect(() => pipe.transform(input)).toThrow(
      BadRequestException,
    );
  });

  it('should return HTTP 400 for invalid data', () => {
    const input = {
      email: 'invalid-email',
      firstName: 'Fallou',
    };

    try {
      pipe.transform(input);
      throw new Error('Expected validation to fail');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(BadRequestException);

      if (error instanceof BadRequestException) {
        expect(error.getStatus()).toBe(400);
      }
    }
  });

  it('should transform valid data using Zod', () => {
    const input = {
      email: 'test@novacv.com',
      firstName: '  Fallou  ',
    };

    expect(pipe.transform(input)).toEqual({
      email: 'test@novacv.com',
      firstName: 'Fallou',
    });
  });

  it('should return readable validation errors', () => {
    const input = {
      email: 'invalid-email',
      firstName: '',
    };

    try {
      pipe.transform(input);
      throw new Error('Expected validation to fail');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(BadRequestException);

      if (error instanceof BadRequestException) {
        expect(error.getResponse()).toEqual({
          message: 'Validation failed',
          errors: expect.arrayContaining([
            expect.objectContaining({
              field: 'email',
            }),
            expect.objectContaining({
              field: 'firstName',
            }),
          ]),
        });
      }
    }
  });
});
