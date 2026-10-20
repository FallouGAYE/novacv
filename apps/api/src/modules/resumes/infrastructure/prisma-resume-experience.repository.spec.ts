import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PrismaResumeExperienceRepository } from './prisma-resume-experience.repository.js';

import type { PrismaService } from '../../../infrastructure/database/prisma.service.js';

describe('PrismaResumeExperienceRepository', () => {
  const resumeId = 'resume-123';
  const experienceId = 'experience-456';

  const experience = {
    id: experienceId,
    resumeId,
    jobTitle: 'Développeur Full Stack',
    company: 'NovaTech',
    city: 'Marseille',
    country: 'France',
    startDate: new Date('2025-01-01'),
    endDate: null,
    isCurrent: true,
    description: 'Développement web et API REST',
    position: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const prisma = {
    resumeExperience: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  };

  let repository: PrismaResumeExperienceRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    repository = new PrismaResumeExperienceRepository(
      prisma as unknown as PrismaService,
    );
  });

  describe('create', () => {
    it('should create a professional experience', async () => {
      prisma.resumeExperience.create.mockResolvedValue(experience);

      const data = {
        resumeId,
        jobTitle: 'Développeur Full Stack',
        company: 'NovaTech',
        startDate: new Date('2025-01-01'),
      };

      const result = await repository.create(data);

      expect(prisma.resumeExperience.create).toHaveBeenCalledWith({
        data,
      });

      expect(result).toEqual(experience);
    });
  });

  describe('findAllByResumeId', () => {
    it('should retrieve experiences belonging to a resume', async () => {
      prisma.resumeExperience.findMany.mockResolvedValue([experience]);

      const result = await repository.findAllByResumeId(resumeId);

      expect(prisma.resumeExperience.findMany).toHaveBeenCalledWith({
        where: {
          resumeId,
        },
        orderBy: [
          { position: 'asc' },
          { startDate: 'desc' },
        ],
      });

      expect(result).toEqual([experience]);
    });

    it('should return an empty array when no experiences exist', async () => {
      prisma.resumeExperience.findMany.mockResolvedValue([]);

      const result = await repository.findAllByResumeId(resumeId);

      expect(result).toEqual([]);
    });
  });

  describe('findByIdAndResumeId', () => {
    it('should retrieve an experience using both identifiers', async () => {
      prisma.resumeExperience.findFirst.mockResolvedValue(experience);

      const result = await repository.findByIdAndResumeId(
        experienceId,
        resumeId,
      );

      expect(prisma.resumeExperience.findFirst).toHaveBeenCalledWith({
        where: {
          id: experienceId,
          resumeId,
        },
      });

      expect(result).toEqual(experience);
    });

    it('should return null when the experience is not found', async () => {
      prisma.resumeExperience.findFirst.mockResolvedValue(null);

      const result = await repository.findByIdAndResumeId(
        experienceId,
        resumeId,
      );

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an experience belonging to the resume', async () => {
      prisma.resumeExperience.updateMany.mockResolvedValue({
        count: 1,
      });

      prisma.resumeExperience.findFirst.mockResolvedValue(experience);

      const data = {
        jobTitle: 'Ingénieur logiciel',
      };

      const result = await repository.update(
        experienceId,
        resumeId,
        data,
      );

      expect(prisma.resumeExperience.updateMany).toHaveBeenCalledWith({
        where: {
          id: experienceId,
          resumeId,
        },
        data,
      });

      expect(prisma.resumeExperience.findFirst).toHaveBeenCalledWith({
        where: {
          id: experienceId,
          resumeId,
        },
      });

      expect(result).toEqual(experience);
    });

    it('should return null when no experience was updated', async () => {
      prisma.resumeExperience.updateMany.mockResolvedValue({
        count: 0,
      });

      const result = await repository.update(
        experienceId,
        resumeId,
        {
          jobTitle: 'Ingénieur logiciel',
        },
      );

      expect(result).toBeNull();

      expect(prisma.resumeExperience.findFirst).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should return true when an experience is deleted', async () => {
      prisma.resumeExperience.deleteMany.mockResolvedValue({
        count: 1,
      });

      const result = await repository.delete(
        experienceId,
        resumeId,
      );

      expect(prisma.resumeExperience.deleteMany).toHaveBeenCalledWith({
        where: {
          id: experienceId,
          resumeId,
        },
      });

      expect(result).toBe(true);
    });

    it('should return false when no experience was deleted', async () => {
      prisma.resumeExperience.deleteMany.mockResolvedValue({
        count: 0,
      });

      const result = await repository.delete(
        experienceId,
        resumeId,
      );

      expect(result).toBe(false);
    });
  });
});
