import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { ResumeExperiencesService } from './resume-experiences.service.js';

import type { ResumesService } from './resumes.service.js';

import type {
  ResumeExperienceRepository,
} from '../domain/resume-experience.repository.js';

describe('ResumeExperiencesService', () => {
  const resumeId = 'resume-123';
  const userId = 'user-456';
  const experienceId = 'experience-789';

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
    description: 'Développement d’applications web',
    position: 0,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  const resumesService = {
    findOne: vi.fn(),
  };

  const repository = {
    create: vi.fn(),
    findAllByResumeId: vi.fn(),
    findByIdAndResumeId: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  let service: ResumeExperiencesService;

  beforeEach(() => {
    vi.clearAllMocks();

    resumesService.findOne.mockResolvedValue({
      id: resumeId,
      userId,
    });

    service = new ResumeExperiencesService(
      resumesService as unknown as ResumesService,
      repository as unknown as ResumeExperienceRepository,
    );
  });

  describe('create', () => {
    it('should create an experience for an owned resume', async () => {
      repository.create.mockResolvedValue(experience);

      const result = await service.create(resumeId, userId, {
        jobTitle: ' Développeur Full Stack ',
        company: ' NovaTech ',
        startDate: new Date('2025-01-01'),
        isCurrent: true,
      });

      expect(resumesService.findOne).toHaveBeenCalledWith(
        resumeId,
        userId,
      );

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          resumeId,
          jobTitle: 'Développeur Full Stack',
          company: 'NovaTech',
          isCurrent: true,
          endDate: null,
        }),
      );

      expect(result).toEqual(experience);
    });

    it('should reject an experience with an invalid start date', async () => {
      await expect(
        service.create(resumeId, userId, {
          jobTitle: 'Développeur',
          company: 'NovaTech',
          startDate: new Date('invalid'),
        }),
      ).rejects.toThrow(BadRequestException);

      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should reject an end date before the start date', async () => {
      await expect(
        service.create(resumeId, userId, {
          jobTitle: 'Développeur',
          company: 'NovaTech',
          startDate: new Date('2025-06-01'),
          endDate: new Date('2025-01-01'),
        }),
      ).rejects.toThrow(
        'End date cannot be before start date',
      );

      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should reject an end date for a current position', async () => {
      await expect(
        service.create(resumeId, userId, {
          jobTitle: 'Développeur',
          company: 'NovaTech',
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-06-01'),
          isCurrent: true,
        }),
      ).rejects.toThrow(
        'Current experience cannot have an end date',
      );

      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should reject creation for a resume owned by another user', async () => {
      resumesService.findOne.mockRejectedValue(
        new NotFoundException('Resume not found'),
      );

      await expect(
        service.create(resumeId, userId, {
          jobTitle: 'Développeur',
          company: 'NovaTech',
          startDate: new Date('2025-01-01'),
        }),
      ).rejects.toThrow(NotFoundException);

      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should list experiences belonging to an owned resume', async () => {
      repository.findAllByResumeId.mockResolvedValue([
        experience,
      ]);

      const result = await service.findAll(resumeId, userId);

      expect(repository.findAllByResumeId).toHaveBeenCalledWith(
        resumeId,
      );

      expect(result).toEqual([experience]);
    });

    it('should reject access to another user resume', async () => {
      resumesService.findOne.mockRejectedValue(
        new NotFoundException('Resume not found'),
      );

      await expect(
        service.findAll(resumeId, userId),
      ).rejects.toThrow(NotFoundException);

      expect(repository.findAllByResumeId).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should retrieve an existing experience', async () => {
      repository.findByIdAndResumeId.mockResolvedValue(
        experience,
      );

      const result = await service.findOne(
        resumeId,
        userId,
        experienceId,
      );

      expect(repository.findByIdAndResumeId).toHaveBeenCalledWith(
        experienceId,
        resumeId,
      );

      expect(result).toEqual(experience);
    });

    it('should reject an experience that does not exist', async () => {
      repository.findByIdAndResumeId.mockResolvedValue(null);

      await expect(
        service.findOne(resumeId, userId, experienceId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an experience without deleting other fields', async () => {
      repository.findByIdAndResumeId.mockResolvedValue(
        experience,
      );

      repository.update.mockResolvedValue({
        ...experience,
        jobTitle: 'Ingénieur logiciel',
      });

      const result = await service.update(
        resumeId,
        userId,
        experienceId,
        {
          jobTitle: ' Ingénieur logiciel ',
        },
      );

      expect(repository.update).toHaveBeenCalledWith(
        experienceId,
        resumeId,
        {
          jobTitle: 'Ingénieur logiciel',
          company: undefined,
        },
      );

      expect(result.jobTitle).toBe('Ingénieur logiciel');
    });

    it('should reject an invalid date change', async () => {
      repository.findByIdAndResumeId.mockResolvedValue(
        experience,
      );

      await expect(
        service.update(resumeId, userId, experienceId, {
          endDate: new Date('2024-01-01'),
        }),
      ).rejects.toThrow(BadRequestException);

      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should reject an update when the experience does not exist', async () => {
      repository.findByIdAndResumeId.mockResolvedValue(null);

      await expect(
        service.update(resumeId, userId, experienceId, {
          jobTitle: 'Ingénieur logiciel',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should reject updates to another user resume', async () => {
      resumesService.findOne.mockRejectedValue(
        new NotFoundException('Resume not found'),
      );

      await expect(
        service.update(resumeId, userId, experienceId, {
          jobTitle: 'Modification interdite',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete an existing experience', async () => {
      repository.delete.mockResolvedValue(true);

      await expect(
        service.remove(resumeId, userId, experienceId),
      ).resolves.toBeUndefined();

      expect(repository.delete).toHaveBeenCalledWith(
        experienceId,
        resumeId,
      );
    });

    it('should reject deletion of a missing experience', async () => {
      repository.delete.mockResolvedValue(false);

      await expect(
        service.remove(resumeId, userId, experienceId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reject deletion from another user resume', async () => {
      resumesService.findOne.mockRejectedValue(
        new NotFoundException('Resume not found'),
      );

      await expect(
        service.remove(resumeId, userId, experienceId),
      ).rejects.toThrow(NotFoundException);

      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
