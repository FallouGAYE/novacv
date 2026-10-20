import { z } from 'zod';

/**
 * Shared validation rules for resume titles.
 */
const resumeTitleSchema = z
  .string()
  .trim()
  .min(1, 'Resume title is required')
  .max(120, 'Resume title must not exceed 120 characters');

/**
 * Validation schema for creating a resume.
 *
 * POST /resumes
 */
export const createResumeSchema = z
  .object({
    title: resumeTitleSchema,
  })
  .strict();

/**
 * Validation schema for updating a resume.
 *
 * PATCH /resumes/:id
 */
export const updateResumeSchema = z
  .object({
    title: resumeTitleSchema,
  })
  .strict();

/**
 * TypeScript types inferred directly from Zod.
 */
export type CreateResumeDto = z.infer<typeof createResumeSchema>;

export type UpdateResumeDto = z.infer<typeof updateResumeSchema>;
