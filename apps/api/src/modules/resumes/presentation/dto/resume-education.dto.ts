import { z } from 'zod';

const dateSchema = z.iso.date().transform(
  (value) => new Date(`${value}T00:00:00.000Z`),
);

const educationFields = {
  institution: z.string().trim().min(1).max(200),
  degree: z.string().trim().min(1).max(200),

  fieldOfStudy: z.string().trim().max(200).nullable().optional(),

  city: z.string().trim().max(120).nullable().optional(),
  country: z.string().trim().max(120).nullable().optional(),

  startDate: dateSchema,
  endDate: dateSchema.nullable().optional(),

  isCurrent: z.boolean().optional(),

  description: z.string().trim().max(5000).nullable().optional(),

  position: z.number().int().min(0).max(10000).optional(),
};

function validateEducationDates(
  data: {
    startDate?: Date;
    endDate?: Date | null;
    isCurrent?: boolean;
  },
  ctx: z.RefinementCtx,
): void {
  if (
    data.startDate &&
    data.endDate &&
    data.endDate < data.startDate
  ) {
    ctx.addIssue({
      code: 'custom',
      message: 'End date cannot be before start date',
      path: ['endDate'],
    });
  }

  if (data.isCurrent === true && data.endDate != null) {
    ctx.addIssue({
      code: 'custom',
      message: 'Current education cannot have an end date',
      path: ['endDate'],
    });
  }
}

export const createResumeEducationSchema = z
  .object(educationFields)
  .strict()
  .superRefine(validateEducationDates);

export const updateResumeEducationSchema = z
  .object(educationFields)
  .partial()
  .strict()
  .superRefine(validateEducationDates);

export type CreateResumeEducationDto = z.infer<
  typeof createResumeEducationSchema
>;

export type UpdateResumeEducationDto = z.infer<
  typeof updateResumeEducationSchema
>;
