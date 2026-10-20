import { z } from 'zod';

/**
 * Optional text field with a maximum length.
 *
 * Null allows the user to clear an existing field.
 */
const optionalText = (maxLength: number) =>
  z.string().trim().max(maxLength).nullable().optional();

/**
 * Optional email address.
 */
const optionalEmail = z
  .email('Invalid email address')
  .max(254)
  .nullable()
  .optional();

/**
 * Optional URL.
 *
 * Only HTTP and HTTPS URLs are accepted.
 */
const optionalUrl = z
  .url('Invalid URL')
  .refine(
    (value) =>
      value.startsWith('https://') ||
      value.startsWith('http://'),
    'URL must use HTTP or HTTPS',
  )
  .nullable()
  .optional();

/**
 * Create or update resume personal information.
 *
 * All fields are optional to support partial updates.
 */
export const upsertResumePersonalInfoSchema = z
  .object({
    firstName: optionalText(100),
    lastName: optionalText(100),
    jobTitle: optionalText(150),

    email: optionalEmail,
    phone: optionalText(30),

    city: optionalText(120),
    country: optionalText(120),

    linkedin: optionalUrl,
    github: optionalUrl,
    website: optionalUrl,

    summary: optionalText(5000),
  })
  .strict();

export type UpsertResumePersonalInfoDto = z.infer<
  typeof upsertResumePersonalInfoSchema
>;
