import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PrismaResumeEducationRepository } from './prisma-resume-education.repository.js';

import type { PrismaService } from '../../../infrastructure/database/prisma.service.js';

describe('PrismaResumeEducationRepository', () => {
  const resumeId = 'resume-123';
  const educationId = 'education-456';

  const education = {
    id: educationId,
    resumeId,
    institution: 'Aix-Marseille Université',
    degree: 'Master Informatique',
    fieldOfStudy: 'Informatique et Mathématiques Discrètes',
    city: 'Marseille',
    country: 'France',
    startDate: new Date('2024-09-01'),
    endDate: new Date('2026-06-30'),
    isCurrent: false,
    description: 'Formation en informatique',
    position: 0,
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-09-01'),
  };

  const prisma = {
    resumeEducation: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  };

  let repository: PrismaResumeEducationRepository;

  beforeEach(() => {
    vi.resetAllMocks();

    repository = new PrismaResumeEducationRepository(
      prisma as unknown as PrismaService,
    );
  });

  describe('create', () => {
    it('creates an education', async () => {
      prisma.resumeEducation.create.mockResolvedValue(education);

      const result = await repository.create({
        resumeId,
        institution: 'Aix-Marseille Université',
        degree: 'Master Informatique',
        startDate: new Date('2024-09-01'),
      });

      expect(prisma.resumeEducation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          resumeId,
          institution: 'Aix-Marseille Université',
          degree: 'Master Informatique',
          isCurrent: false,
          position: 0,
        }),
      });

      expect(result).toEqual(education);
    });
  });

  describe('findAllByResumeId', () => {
    it('returns educations ordered by position and start date', async () => {
      prisma.resumeEducation.findMany.mockResolvedValue([education]);

      const result = await repository.findAllByResumeId(resumeId);

      expect(prisma.resumeEducation.findMany).toHaveBeenCalledWith({
        where: { resumeId },
        orderBy: [
          { position: 'asc' },
          { startDate: 'desc' },
        ],
      });

      expect(result).toEqual([education]);
    });

    it('returns an empty array when no education exists', async () => {
      prisma.resumeEducation.findMany.mockResolvedValue([]);

      const result = await repository.findAllByResumeId(resumeId);

      expect(result).toEqual([]);
    });
  });

  describe('findByIdAndResumeId', () => {
    it('finds an education belonging to the specified resume', async () => {
      prisma.resumeEducation.findFirst.mockResolvedValue(education);

      const result = await repository.findByIdAndResumeId(
        educationId,
        resumeId,
      );

      expect(prisma.resumeEducation.findFirst).toHaveBeenCalledWith({
        where: {
          id: educationId,
          resumeId,
        },
      });

      expect(result).toEqual(education);
    });

    it('returns null when the education is not found', async () => {
      prisma.resumeEducation.findFirst.mockResolvedValue(null);

      const result = await repository.findByIdAndResumeId(
        educationId,
        resumeId,
      );

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('updates an education belonging to the specified resume', async () => {
      prisma.resumeEducation.updateMany.mockResolvedValue({
        count: 1,
      });

      prisma.resumeEducation.findFirst.mockResolvedValue({
        ...education,
        degree: 'Master 2 Informatique',
      });

      const result = await repository.update(
        educationId,
        resumeId,
        {
          degree: 'Master 2 Informatique',
        },
      );

      expect(prisma.resumeEducation.updateMany).toHaveBeenCalledWith({
        where: {
          id: educationId,
          resumeId,
        },
        data: {
          degree: 'Master 2 Informatique',
        },
      });

      expect(result?.degree).toBe('Master 2 Informatique');
    });

    it('returns null when no education was updated', async () => {
      prisma.resumeEducation.updateMany.mockResolvedValue({
        count: 0,
      });

      const result = await repository.update(
        educationId,
        resumeId,
        {
          degree: 'Master 2 Informatique',
        },
      );

      expect(result).toBeNull();

      expect(prisma.resumeEducation.findFirst).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('returns true when an education is deleted', async () => {
      prisma.resumeEducation.deleteMany.mockResolvedValue({
        count: 1,
      });

      const result = await repository.delete(
        educationId,
        resumeId,
      );

      expect(prisma.resumeEducation.deleteMany).toHaveBeenCalledWith({
        where: {
          id: educationId,
          resumeId,
        },
      });

      expect(result).toBe(true);
    });

    it('returns false when no education is deleted', async () => {
      prisma.resumeEducation.deleteMany.mockResolvedValue({
        count: 0,
      });

      const result = await repository.delete(
        educationId,
        resumeId,
      );

      expect(result).toBe(false);
    });
  });
});
