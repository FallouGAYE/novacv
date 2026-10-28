import { describe, expect, it } from 'vitest';

import {
  createResumeEducationSchema,
  updateResumeEducationSchema,
} from './resume-education.dto.js';

const validEducation = {
  institution: 'Aix-Marseille Université',
  degree: 'Master Informatique',
  fieldOfStudy: 'Informatique et Mathématiques Discrètes',
  city: 'Marseille',
  country: 'France',
  startDate: '2024-09-01',
  endDate: '2026-06-30',
  isCurrent: false,
  description: 'Formation en informatique.',
  position: 0,
};

describe('CreateResumeEducationSchema', () => {
  it('accepts a valid education', () => {
    const result = createResumeEducationSchema.safeParse(
      validEducation,
    );

    expect(result.success).toBe(true);
  });

  it('converts dates into Date objects', () => {
    const result = createResumeEducationSchema.parse(
      validEducation,
    );

    expect(result.startDate).toBeInstanceOf(Date);
    expect(result.endDate).toBeInstanceOf(Date);
  });

  it('requires an institution', () => {
    const { institution: _institution, ...data } =
      validEducation;

    expect(
      createResumeEducationSchema.safeParse(data).success,
    ).toBe(false);
  });

  it('requires a degree', () => {
    const { degree: _degree, ...data } = validEducation;

    expect(
      createResumeEducationSchema.safeParse(data).success,
    ).toBe(false);
  });

  it('rejects an empty institution', () => {
    expect(
      createResumeEducationSchema.safeParse({
        ...validEducation,
        institution: '   ',
      }).success,
    ).toBe(false);
  });

  it('rejects an empty degree', () => {
    expect(
      createResumeEducationSchema.safeParse({
        ...validEducation,
        degree: '',
      }).success,
    ).toBe(false);
  });

  it('rejects an invalid start date', () => {
    expect(
      createResumeEducationSchema.safeParse({
        ...validEducation,
        startDate: '2024-99-99',
      }).success,
    ).toBe(false);
  });

  it('rejects an end date before the start date', () => {
    expect(
      createResumeEducationSchema.safeParse({
        ...validEducation,
        endDate: '2023-06-30',
      }).success,
    ).toBe(false);
  });

  it('rejects an end date for current education', () => {
    expect(
      createResumeEducationSchema.safeParse({
        ...validEducation,
        isCurrent: true,
      }).success,
    ).toBe(false);
  });

  it('accepts current education without an end date', () => {
    expect(
      createResumeEducationSchema.safeParse({
        ...validEducation,
        endDate: null,
        isCurrent: true,
      }).success,
    ).toBe(true);
  });

  it('rejects negative positions', () => {
    expect(
      createResumeEducationSchema.safeParse({
        ...validEducation,
        position: -1,
      }).success,
    ).toBe(false);
  });

  it('rejects unknown properties', () => {
    expect(
      createResumeEducationSchema.safeParse({
        ...validEducation,
        unauthorizedField: true,
      }).success,
    ).toBe(false);
  });
});

describe('UpdateResumeEducationSchema', () => {
  it('accepts a partial update', () => {
    expect(
      updateResumeEducationSchema.safeParse({
        degree: 'Master 2 Informatique',
      }).success,
    ).toBe(true);
  });

  it('accepts an empty update object', () => {
    expect(
      updateResumeEducationSchema.safeParse({}).success,
    ).toBe(true);
  });

  it('rejects an empty institution', () => {
    expect(
      updateResumeEducationSchema.safeParse({
        institution: '',
      }).success,
    ).toBe(false);
  });

  it('rejects an invalid date', () => {
    expect(
      updateResumeEducationSchema.safeParse({
        startDate: 'invalid-date',
      }).success,
    ).toBe(false);
  });

  it('rejects unknown properties', () => {
    expect(
      updateResumeEducationSchema.safeParse({
        userId: 'unauthorized',
      }).success,
    ).toBe(false);
  });
});
