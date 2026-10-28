import { z } from 'zod';

const optionalTextSchema = z
  .string()
  .trim()
  .max(100)
  .nullable()
  .optional();

export const createResumeSkillSchema = z
  .object({
    name: z.string().trim().min(1).max(150),

    category: optionalTextSchema,

    level: optionalTextSchema,

    position: z.number().int().min(0).optional(),
  })
  .strict();

export const updateResumeSkillSchema =
  createResumeSkillSchema.partial();

export type CreateResumeSkillDto = z.infer<
  typeof createResumeSkillSchema
>;

export type UpdateResumeSkillDto = z.infer<
  typeof updateResumeSkillSchema
>;
