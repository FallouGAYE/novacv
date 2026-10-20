import { describe, expect, it } from 'vitest';

import {
  createResumeExperienceSchema,
  updateResumeExperienceSchema,
} from './resume-experience.dto.js';

describe('ResumeExperience DTO validation', () => {
  const validExperience = {
    jobTitle: 'Développeur Full Stack',
    company: 'Capgemini',
    city: 'Marseille',
    country: 'France',
    startDate: '2025-01-01',
    endDate: null,
    isCurrent: true,
    description: 'Développement web avec NestJS et Angular.',
    position: 0,
  };

  describe('createResumeExperienceSchema', () => {
    it('should accept a valid professional experience', () => {
      const result =
        createResumeExperienceSchema.safeParse(validExperience);

      expect(result.success).toBe(true);
    });

    it('should transform date strings into Date objects', () => {
      const result =
        createResumeExperienceSchema.parse(validExperience);

      expect(result.startDate).toBeInstanceOf(Date);

      expect(result.startDate.toISOString()).toBe(
        '2025-01-01T00:00:00.000Z',
      );
    });

    it('should reject an empty job title', () => {
      const result = createResumeExperienceSchema.safeParse({
        ...validExperience,
        jobTitle: '   ',
      });

      expect(result.success).toBe(false);
    });

    it('should reject an empty company', () => {
      const result = createResumeExperienceSchema.safeParse({
        ...validExperience,
        company: '',
      });

      expect(result.success).toBe(false);
    });

    it('should reject an invalid calendar date', () => {
      const result = createResumeExperienceSchema.safeParse({
        ...validExperience,
        startDate: '2025-02-30',
      });

      expect(result.success).toBe(false);
    });

    it('should reject an invalid date format', () => {
      const result = createResumeExperienceSchema.safeParse({
        ...validExperience,
        startDate: '01/01/2025',
      });

      expect(result.success).toBe(false);
    });

    it('should reject an end date before the start date', () => {
      const result = createResumeExperienceSchema.safeParse({
        ...validExperience,
        startDate: '2025-06-01',
        endDate: '2025-01-01',
        isCurrent: false,
      });

      expect(result.success).toBe(false);
    });

    it('should reject an end date for a current position', () => {
      const result = createResumeExperienceSchema.safeParse({
        ...validExperience,
        endDate: '2025-12-31',
        isCurrent: true,
      });

      expect(result.success).toBe(false);
    });

    it('should reject a negative position', () => {
      const result = createResumeExperienceSchema.safeParse({
        ...validExperience,
        position: -1,
      });

      expect(result.success).toBe(false);
    });

    it('should reject an unknown field', () => {
      const result = createResumeExperienceSchema.safeParse({
        ...validExperience,
        userId: 'another-user',
      });

      expect(result.success).toBe(false);
    });

    it('should reject a job title longer than 150 characters', () => {
      const result = createResumeExperienceSchema.safeParse({
        ...validExperience,
        jobTitle: 'A'.repeat(151),
      });

      expect(result.success).toBe(false);
    });
  });

  describe('updateResumeExperienceSchema', () => {
    it('should accept a partial update', () => {
      const result = updateResumeExperienceSchema.safeParse({
        jobTitle: 'Ingénieur logiciel',
      });

      expect(result.success).toBe(true);
    });

    it('should accept an empty object', () => {
      const result = updateResumeExperienceSchema.safeParse({});

      expect(result.success).toBe(true);
    });

    it('should allow clearing the end date', () => {
      const result = updateResumeExperienceSchema.safeParse({
        endDate: null,
        isCurrent: true,
      });

      expect(result.success).toBe(true);
    });

    it('should transform an updated start date', () => {
      const result = updateResumeExperienceSchema.parse({
        startDate: '2026-01-01',
      });

      expect(result.startDate).toBeInstanceOf(Date);
    });

    it('should reject an unknown field during update', () => {
      const result = updateResumeExperienceSchema.safeParse({
        resumeId: 'another-resume',
      });

      expect(result.success).toBe(false);
    });

    it('should reject an invalid position during update', () => {
      const result = updateResumeExperienceSchema.safeParse({
        position: 1.5,
      });

      expect(result.success).toBe(false);
    });
  });
});
