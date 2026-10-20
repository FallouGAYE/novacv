import {
  NotFoundException,
} from '@nestjs/common';

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { ResumePersonalInfoService } from './resume-personal-info.service.js';

import type { ResumesService } from './resumes.service.js';

import type { ResumePersonalInfoRepository } from '../domain/resume-personal-info.repository.js';

describe('ResumePersonalInfoService', () => {
  const resumeId = 'resume-id';
  const userId = 'user-id';

  const mockPersonalInfo = {
    id: 'personal-info-id',
    resumeId,
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

  const findOne = vi.fn();
  const findByResumeId = vi.fn();
  const upsert = vi.fn();

  let service: ResumePersonalInfoService;

  beforeEach(() => {
    vi.resetAllMocks();

    const resumesService = {
      findOne,
    } as unknown as ResumesService;

    const personalInfoRepository = {
      findByResumeId,
      upsert,
    } as unknown as ResumePersonalInfoRepository;

    service = new ResumePersonalInfoService(
      resumesService,
      personalInfoRepository,
    );
  });

  describe('findByResumeId', () => {
    it('should return personal information for an owned resume', async () => {
      findOne.mockResolvedValue({ id: resumeId, userId });
      findByResumeId.mockResolvedValue(mockPersonalInfo);

      const result = await service.findByResumeId(
        resumeId,
        userId,
      );

      expect(result).toEqual(mockPersonalInfo);

      expect(findOne).toHaveBeenCalledExactlyOnceWith(
        resumeId,
        userId,
      );

      expect(findByResumeId).toHaveBeenCalledExactlyOnceWith(
        resumeId,
      );
    });

    it('should throw 404 when personal information does not exist', async () => {
      findOne.mockResolvedValue({ id: resumeId, userId });
      findByResumeId.mockResolvedValue(null);

      await expect(
        service.findByResumeId(resumeId, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should deny access to another user resume', async () => {
      findOne.mockRejectedValue(
        new NotFoundException('Resume not found'),
      );

      await expect(
        service.findByResumeId(resumeId, 'other-user-id'),
      ).rejects.toThrow(NotFoundException);

      expect(findByResumeId).not.toHaveBeenCalled();
    });
  });

  describe('upsert', () => {
    it('should create or update personal information for an owned resume', async () => {
      findOne.mockResolvedValue({ id: resumeId, userId });
      upsert.mockResolvedValue(mockPersonalInfo);

      const data = {
        firstName: 'Fallou',
        lastName: 'Gaye',
        jobTitle: 'Ingénieur logiciel',
      };

      const result = await service.upsert(
        resumeId,
        userId,
        data,
      );

      expect(result).toEqual(mockPersonalInfo);

      expect(findOne).toHaveBeenCalledExactlyOnceWith(
        resumeId,
        userId,
      );

      expect(upsert).toHaveBeenCalledExactlyOnceWith(
        resumeId,
        data,
      );
    });

    it('should deny modifications to another user resume', async () => {
      findOne.mockRejectedValue(
        new NotFoundException('Resume not found'),
      );

      await expect(
        service.upsert(
          resumeId,
          'other-user-id',
          { firstName: 'Unauthorized' },
        ),
      ).rejects.toThrow(NotFoundException);

      expect(upsert).not.toHaveBeenCalled();
    });
  });
});
