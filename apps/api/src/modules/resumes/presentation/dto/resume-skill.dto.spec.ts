import { describe, expect, it } from 'vitest';

import {
  createResumeSkillSchema,
  updateResumeSkillSchema,
} from './resume-skill.dto.js';

describe('CreateResumeSkillSchema', () => {
  const validSkill = {
    name: 'TypeScript',
    category: 'Langages de programmation',
    level: 'Avancé',
    position: 0,
  };

  it('accepts a valid skill', () => {
    const result = createResumeSkillSchema.safeParse(validSkill);

    expect(result.success).toBe(true);
  });

  it('trims whitespace from the skill name', () => {
    const result = createResumeSkillSchema.parse({
      ...validSkill,
      name: '  TypeScript  ',
    });

    expect(result.name).toBe('TypeScript');
  });

  it('requires a skill name', () => {
    const result = createResumeSkillSchema.safeParse({
      category: 'Langages',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an empty skill name', () => {
    const result = createResumeSkillSchema.safeParse({
      ...validSkill,
      name: '   ',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a skill name longer than 150 characters', () => {
    const result = createResumeSkillSchema.safeParse({
      ...validSkill,
      name: 'A'.repeat(151),
    });

    expect(result.success).toBe(false);
  });

  it('accepts a skill without category or level', () => {
    const result = createResumeSkillSchema.safeParse({
      name: 'PostgreSQL',
    });

    expect(result.success).toBe(true);
  });

  it('accepts null category and level', () => {
    const result = createResumeSkillSchema.safeParse({
      name: 'Docker',
      category: null,
      level: null,
    });

    expect(result.success).toBe(true);
  });

  it('rejects a category longer than 100 characters', () => {
    const result = createResumeSkillSchema.safeParse({
      ...validSkill,
      category: 'A'.repeat(101),
    });

    expect(result.success).toBe(false);
  });

  it('rejects a level longer than 100 characters', () => {
    const result = createResumeSkillSchema.safeParse({
      ...validSkill,
      level: 'A'.repeat(101),
    });

    expect(result.success).toBe(false);
  });

  it('rejects a negative position', () => {
    const result = createResumeSkillSchema.safeParse({
      ...validSkill,
      position: -1,
    });

    expect(result.success).toBe(false);
  });

  it('rejects a decimal position', () => {
    const result = createResumeSkillSchema.safeParse({
      ...validSkill,
      position: 1.5,
    });

    expect(result.success).toBe(false);
  });

  it('rejects unknown properties', () => {
    const result = createResumeSkillSchema.safeParse({
      ...validSkill,
      userId: 'unauthorized',
    });

    expect(result.success).toBe(false);
  });
});

describe('UpdateResumeSkillSchema', () => {
  it('accepts a partial update', () => {
    const result = updateResumeSkillSchema.safeParse({
      level: 'Expert',
    });

    expect(result.success).toBe(true);
  });

  it('accepts an empty update object', () => {
    const result = updateResumeSkillSchema.safeParse({});

    expect(result.success).toBe(true);
  });

  it('accepts clearing a category', () => {
    const result = updateResumeSkillSchema.safeParse({
      category: null,
    });

    expect(result.success).toBe(true);
  });

  it('rejects an empty name', () => {
    const result = updateResumeSkillSchema.safeParse({
      name: '',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an invalid position', () => {
    const result = updateResumeSkillSchema.safeParse({
      position: -5,
    });

    expect(result.success).toBe(false);
  });

  it('rejects unknown properties', () => {
    const result = updateResumeSkillSchema.safeParse({
      resumeId: 'another-resume',
    });

    expect(result.success).toBe(false);
  });
});
