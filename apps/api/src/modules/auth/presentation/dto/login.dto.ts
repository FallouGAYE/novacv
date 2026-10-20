import { z } from 'zod';

export const loginSchema = z.strictObject({
  email: z.email({
    error: 'Invalid email address',
  }),

  password: z
    .string()
    .min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof loginSchema>;
