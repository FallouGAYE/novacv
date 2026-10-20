import { z } from 'zod';

export const registerSchema = z.strictObject({
  email: z.email({
    error: 'Invalid email address',
  }),

  password: z
    .string()
    .min(12, 'Password must contain at least 12 characters')
    .max(128, 'Password must not exceed 128 characters'),

  firstName: z
    .string()
    .trim()
    .min(1, 'First name cannot be empty')
    .max(100, 'First name is too long')
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(1, 'Last name cannot be empty')
    .max(100, 'Last name is too long')
    .optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
