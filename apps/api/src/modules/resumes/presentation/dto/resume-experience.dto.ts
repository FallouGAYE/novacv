import { z } from 'zod';

/**
 * Required text field.
 */
const requiredText = (maxLength: number) =>
  z.string().trim().min(1).max(maxLength);

/**
 * Optional text field.
 * Null allows clearing an existing value.
 */
const optionalText = (maxLength: number) =>
  z.string().trim().max(maxLength).nullable().optional();

/**
 * Convert a YYYY-MM-DD string into a Date.
 * Reject invalid calendar dates.
 */
const dateSchema = z
  .iso.date()
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

/**
 * Shared fields for creating and updating experiences.
 */
const experienceFields = {
  jobTitle: requiredText(150),
  company: requiredText(150),

  city: optionalText(120),
  country: optionalText(120),

  startDate: dateSchema,
  endDate: dateSchema.nullable().optional(),

  isCurrent: z.boolean().optional(),

  description: optionalText(5000),

  position: z.number().int().min(0).max(10000).optional(),
};

/**
 * Create a professional experience.
 */
export const createResumeExperienceSchema = z
  .object(experienceFields)
  .strict()
  .superRefine((data, context) => {
    if (data.endDate && data.endDate < data.startDate) {
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'End date cannot be before start date',
      });
    }

    if (data.isCurrent && data.endDate) {
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Current experience cannot have an end date',
      });
    }
  });

/**
 * Update an existing professional experience.
 *
 * All fields are optional because updates are partial.
 * The service validates the final combination of dates.
 */
export const updateResumeExperienceSchema = z
  .object(experienceFields)
  .partial()
  .strict();

export type CreateResumeExperienceDto = z.infer<
  typeof createResumeExperienceSchema
>;

export type UpdateResumeExperienceDto = z.infer<
  typeof updateResumeExperienceSchema
>;
