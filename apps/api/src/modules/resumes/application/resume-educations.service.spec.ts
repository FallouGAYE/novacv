import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { ResumeEducationsService } from './resume-educations.service.js';

import type { ResumesService } from './resumes.service.js';

import type {
  ResumeEducationRepository,
} from '../domain/resume-education.repository.js';

describe('ResumeEducationsService', () => {
  const resumeId = 'resume-123';
  const userId = 'user-456';
  const educationId = 'education-789';

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

  let service: ResumeEducationsService;

  beforeEach(() => {
    vi.clearAllMocks();

    resumesService.findOne.mockResolvedValue({
      id: resumeId,
      userId,
    });

    service = new ResumeEducationsService(
      resumesService as unknown as ResumesService,
      repository as unknown as ResumeEducationRepository,
    );
  });

  describe('create', () => {
    it('should create an education for an owned resume', async () => {
      repository.create.mockResolvedValue(education);

      const result = await service.create(resumeId, userId, {
        institution: ' Aix-Marseille Université ',
        degree: ' Master Informatique ',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2026-06-30'),
      });

      expect(resumesService.findOne).toHaveBeenCalledWith(
        resumeId,
        userId,
      );

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          resumeId,
          institution: 'Aix-Marseille Université',
          degree: 'Master Informatique',
          isCurrent: false,
        }),
      );

      expect(result).toEqual(education);
    });

    it('should reject an invalid start date', async () => {
      await expect(
        service.create(resumeId, userId, {
          institution: 'Université',
          degree: 'Licence',
          startDate: new Date('invalid'),
        }),
      ).rejects.toThrow(BadRequestException);

      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should reject an invalid end date', async () => {
      await expect(
        service.create(resumeId, userId, {
          institution: 'Université',
          degree: 'Licence',
          startDate: new Date('2024-09-01'),
          endDate: new Date('invalid'),
        }),
      ).rejects.toThrow(BadRequestException);

      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should reject an end date before the start date', async () => {
      await expect(
        service.create(resumeId, userId, {
          institution: 'Université',
          degree: 'Licence',
          startDate: new Date('2025-09-01'),
          endDate: new Date('2024-06-30'),
        }),
      ).rejects.toThrow(
        'End date cannot be before start date',
      );

      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should reject an end date for current education', async () => {
      await expect(
        service.create(resumeId, userId, {
          institution: 'Université',
          degree: 'Licence',
          startDate: new Date('2024-09-01'),
          endDate: new Date('2026-06-30'),
          isCurrent: true,
        }),
      ).rejects.toThrow(
        'Current education cannot have an end date',
      );

      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should reject an empty institution', async () => {
      await expect(
        service.create(resumeId, userId, {
          institution: '   ',
          degree: 'Licence',
          startDate: new Date('2024-09-01'),
        }),
      ).rejects.toThrow(BadRequestException);

      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should reject an empty degree', async () => {
      await expect(
        service.create(resumeId, userId, {
          institution: 'Université',
          degree: '   ',
          startDate: new Date('2024-09-01'),
        }),
      ).rejects.toThrow(BadRequestException);

      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should reject creation for another user resume', async () => {
      resumesService.findOne.mockRejectedValue(
        new NotFoundException('Resume not found'),
      );

      await expect(
        service.create(resumeId, userId, {
          institution: 'Université',
          degree: 'Licence',
          startDate: new Date('2024-09-01'),
        }),
      ).rejects.toThrow(NotFoundException);

      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should list educations belonging to an owned resume', async () => {
      repository.findAllByResumeId.mockResolvedValue([
        education,
      ]);

      const result = await service.findAll(resumeId, userId);

      expect(repository.findAllByResumeId).toHaveBeenCalledWith(
        resumeId,
      );

      expect(result).toEqual([education]);
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
    it('should retrieve an existing education', async () => {
      repository.findByIdAndResumeId.mockResolvedValue(
        education,
      );

      const result = await service.findOne(
        resumeId,
        educationId,
        userId,
      );

      expect(repository.findByIdAndResumeId).toHaveBeenCalledWith(
        educationId,
        resumeId,
      );

      expect(result).toEqual(education);
    });

    it('should reject an education that does not exist', async () => {
      repository.findByIdAndResumeId.mockResolvedValue(null);

      await expect(
        service.findOne(resumeId, educationId, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reject access to another user education', async () => {
      resumesService.findOne.mockRejectedValue(
        new NotFoundException('Resume not found'),
      );

      await expect(
        service.findOne(resumeId, educationId, userId),
      ).rejects.toThrow(NotFoundException);

      expect(repository.findByIdAndResumeId).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a degree without deleting other fields', async () => {
      repository.findByIdAndResumeId.mockResolvedValue(
        education,
      );

      repository.update.mockResolvedValue({
        ...education,
        degree: 'Master 2 Informatique',
      });

      const result = await service.update(
        resumeId,
        educationId,
        userId,
        {
          degree: ' Master 2 Informatique ',
        },
      );

      expect(repository.update).toHaveBeenCalledWith(
        educationId,
        resumeId,
        {
          degree: 'Master 2 Informatique',
          institution: undefined,
        },
      );

      expect(result.degree).toBe('Master 2 Informatique');
    });

    it('should reject an invalid date change', async () => {
      repository.findByIdAndResumeId.mockResolvedValue(
        education,
      );

      await expect(
        service.update(resumeId, educationId, userId, {
          endDate: new Date('2023-01-01'),
        }),
      ).rejects.toThrow(BadRequestException);

      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should reject an empty degree', async () => {
      repository.findByIdAndResumeId.mockResolvedValue(
        education,
      );

      await expect(
        service.update(resumeId, educationId, userId, {
          degree: '   ',
        }),
      ).rejects.toThrow(BadRequestException);

      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should reject updates to a missing education', async () => {
      repository.findByIdAndResumeId.mockResolvedValue(null);

      await expect(
        service.update(resumeId, educationId, userId, {
          degree: 'Master 2',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should reject updates to another user resume', async () => {
      resumesService.findOne.mockRejectedValue(
        new NotFoundException('Resume not found'),
      );

      await expect(
        service.update(resumeId, educationId, userId, {
          degree: 'Modification interdite',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete an existing education', async () => {
      repository.delete.mockResolvedValue(true);

      await expect(
        service.remove(resumeId, educationId, userId),
      ).resolves.toBeUndefined();

      expect(repository.delete).toHaveBeenCalledWith(
        educationId,
        resumeId,
      );
    });

    it('should reject deletion of a missing education', async () => {
      repository.delete.mockResolvedValue(false);

      await expect(
        service.remove(resumeId, educationId, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reject deletion from another user resume', async () => {
      resumesService.findOne.mockRejectedValue(
        new NotFoundException('Resume not found'),
      );

      await expect(
        service.remove(resumeId, educationId, userId),
      ).rejects.toThrow(NotFoundException);

      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
