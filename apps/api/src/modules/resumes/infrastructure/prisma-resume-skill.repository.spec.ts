import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PrismaResumeSkillRepository } from './prisma-resume-skill.repository.js';
import { PrismaService } from '../../../infrastructure/database/prisma.service.js';

describe('PrismaResumeSkillRepository', () => {
  const resumeId = 'resume-1';
  const skillId = 'skill-1';

  const skill = {
    id: skillId,
    resumeId,
    name: 'TypeScript',
    category: 'Programmation',
    level: 'Avancé',
    position: 0,
    createdAt: new Date('2026-10-28T10:00:00.000Z'),
    updatedAt: new Date('2026-10-28T10:00:00.000Z'),
  };

  let repository: PrismaResumeSkillRepository;

  let prisma: {
    resumeSkill: {
      create: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
      findFirst: ReturnType<typeof vi.fn>;
      updateMany: ReturnType<typeof vi.fn>;
      deleteMany: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(() => {
    prisma = {
      resumeSkill: {
        create: vi.fn().mockResolvedValue(skill),
        findMany: vi.fn().mockResolvedValue([skill]),
        findFirst: vi.fn().mockResolvedValue(skill),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
    };

    repository = new PrismaResumeSkillRepository(
      prisma as unknown as PrismaService,
    );
  });

  describe('create', () => {
    it('creates a skill with the provided values', async () => {
      const result = await repository.create({
        resumeId,
        name: 'TypeScript',
        category: 'Programmation',
        level: 'Avancé',
        position: 2,
      });

      expect(result).toEqual(skill);

      expect(prisma.resumeSkill.create).toHaveBeenCalledWith({
        data: {
          resumeId,
          name: 'TypeScript',
          category: 'Programmation',
          level: 'Avancé',
          position: 2,
        },
      });
    });

    it('uses default values for optional fields', async () => {
      await repository.create({
        resumeId,
        name: 'Docker',
      });

      expect(prisma.resumeSkill.create).toHaveBeenCalledWith({
        data: {
          resumeId,
          name: 'Docker',
          category: null,
          level: null,
          position: 0,
        },
      });
    });
  });

  describe('findAllByResumeId', () => {
    it('returns skills ordered by position and creation date', async () => {
      const result = await repository.findAllByResumeId(resumeId);

      expect(result).toEqual([skill]);

      expect(prisma.resumeSkill.findMany).toHaveBeenCalledWith({
        where: {
          resumeId,
        },
        orderBy: [
          { position: 'asc' },
          { createdAt: 'asc' },
        ],
      });
    });
  });

  describe('findByIdAndResumeId', () => {
    it('finds a skill belonging to the specified resume', async () => {
      const result = await repository.findByIdAndResumeId(
        skillId,
        resumeId,
      );

      expect(result).toEqual(skill);

      expect(prisma.resumeSkill.findFirst).toHaveBeenCalledWith({
        where: {
          id: skillId,
          resumeId,
        },
      });
    });

    it('returns null when the skill does not exist', async () => {
      prisma.resumeSkill.findFirst.mockResolvedValue(null);

      const result = await repository.findByIdAndResumeId(
        skillId,
        resumeId,
      );

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('updates a skill scoped to its resume', async () => {
      const result = await repository.update(
        skillId,
        resumeId,
        {
          level: 'Expert',
          position: 1,
        },
      );

      expect(result).toEqual(skill);

      expect(prisma.resumeSkill.updateMany).toHaveBeenCalledWith({
        where: {
          id: skillId,
          resumeId,
        },
        data: {
          level: 'Expert',
          position: 1,
        },
      });

      expect(prisma.resumeSkill.findFirst).toHaveBeenCalledWith({
        where: {
          id: skillId,
          resumeId,
        },
      });
    });

    it('returns null when no row is updated', async () => {
      prisma.resumeSkill.updateMany.mockResolvedValue({ count: 0 });

      const result = await repository.update(
        skillId,
        resumeId,
        {
          level: 'Expert',
        },
      );

      expect(result).toBeNull();
      expect(prisma.resumeSkill.findFirst).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deletes a skill scoped to its resume', async () => {
      const result = await repository.delete(skillId, resumeId);

      expect(result).toBe(true);

      expect(prisma.resumeSkill.deleteMany).toHaveBeenCalledWith({
        where: {
          id: skillId,
          resumeId,
        },
      });
    });

    it('returns false when no skill is deleted', async () => {
      prisma.resumeSkill.deleteMany.mockResolvedValue({ count: 0 });

      const result = await repository.delete(skillId, resumeId);

      expect(result).toBe(false);
    });
  });
});
