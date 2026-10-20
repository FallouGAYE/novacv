import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PrismaResumePersonalInfoRepository } from './prisma-resume-personal-info.repository.js';

import type { PrismaService } from '../../../infrastructure/database/prisma.service.js';

const mockPersonalInfo = {
  id: 'personal-info-id',
  resumeId: 'resume-id',
  firstName: 'Fallou',
  lastName: 'Gaye',
  jobTitle: 'Ingénieur logiciel',
  email: 'contact@example.com',
  phone: null,
  city: 'Marseille',
  country: 'France',
  linkedin: null,
  github: null,
  website: null,
  summary: null,
  createdAt: new Date('2026-10-19T10:00:00.000Z'),
  updatedAt: new Date('2026-10-19T10:00:00.000Z'),
};

describe('PrismaResumePersonalInfoRepository', () => {
  const findUnique = vi.fn();
  const upsert = vi.fn();

  let repository: PrismaResumePersonalInfoRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    const prisma = {
      resumePersonalInfo: {
        findUnique,
        upsert,
      },
    } as unknown as PrismaService;

    repository = new PrismaResumePersonalInfoRepository(prisma);
  });

  describe('findByResumeId', () => {
    it('should return personal information when it exists', async () => {
      findUnique.mockResolvedValue(mockPersonalInfo);

      const result = await repository.findByResumeId('resume-id');

      expect(result).toEqual(mockPersonalInfo);

      expect(findUnique).toHaveBeenCalledExactlyOnceWith({
        where: {
          resumeId: 'resume-id',
        },
      });
    });

    it('should return null when personal information does not exist', async () => {
      findUnique.mockResolvedValue(null);

      const result = await repository.findByResumeId('resume-id');

      expect(result).toBeNull();

      expect(findUnique).toHaveBeenCalledExactlyOnceWith({
        where: {
          resumeId: 'resume-id',
        },
      });
    });
  });

  describe('upsert', () => {
    it('should create or update personal information', async () => {
      upsert.mockResolvedValue(mockPersonalInfo);

      const data = {
        firstName: 'Fallou',
        lastName: 'Gaye',
        jobTitle: 'Ingénieur logiciel',
      };

      const result = await repository.upsert('resume-id', data);

      expect(result).toEqual(mockPersonalInfo);

      expect(upsert).toHaveBeenCalledExactlyOnceWith({
        where: {
          resumeId: 'resume-id',
        },
        create: {
          resumeId: 'resume-id',
          ...data,
        },
        update: {
          ...data,
        },
      });
    });

    it('should preserve omitted fields in the update payload', async () => {
      upsert.mockResolvedValue(mockPersonalInfo);

      const data = {
        city: 'Marseille',
      };

      await repository.upsert('resume-id', data);

      expect(upsert).toHaveBeenCalledExactlyOnceWith({
        where: {
          resumeId: 'resume-id',
        },
        create: {
          resumeId: 'resume-id',
          city: 'Marseille',
        },
        update: {
          city: 'Marseille',
        },
      });
    });
  });
});
