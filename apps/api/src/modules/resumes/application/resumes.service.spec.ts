import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';

import { ResumesService } from './resumes.service.js';

import type {
  Resume,
  ResumeRepository,
} from '../domain/resume.repository.js';

describe('ResumesService', () => {
  const repository = {
    create: vi.fn(),
    findAllByUserId: vi.fn(),
    findByIdAndUserId: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const service = new ResumesService(
    repository as unknown as ResumeRepository,
  );

  const userId = '550e8400-e29b-41d4-a716-446655440000';

  const resumeId = '660e8400-e29b-41d4-a716-446655440000';

  const otherUserId = '770e8400-e29b-41d4-a716-446655440000';

  const resume: Resume = {
    id: resumeId,
    userId,
    title: 'Software Engineer',
    createdAt: new Date('2026-10-15T10:00:00.000Z'),
    updatedAt: new Date('2026-10-15T10:00:00.000Z'),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('create', () => {
    it('should create a resume and trim its title', async () => {
      repository.create.mockResolvedValue(resume);

      const result = await service.create({
        userId,
        title: '  Software Engineer  ',
      });

      expect(repository.create).toHaveBeenCalledWith({
        userId,
        title: 'Software Engineer',
      });

      expect(result).toEqual(resume);
    });
  });

  describe('findAll', () => {
    it('should return resumes belonging to the user', async () => {
      repository.findAllByUserId.mockResolvedValue([resume]);

      const result = await service.findAll(userId);

      expect(repository.findAllByUserId).toHaveBeenCalledWith(
        userId,
      );

      expect(result).toEqual([resume]);
    });

    it('should return an empty array when no resumes exist', async () => {
      repository.findAllByUserId.mockResolvedValue([]);

      const result = await service.findAll(userId);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a resume belonging to the user', async () => {
      repository.findByIdAndUserId.mockResolvedValue(resume);

      const result = await service.findOne(resumeId, userId);

      expect(repository.findByIdAndUserId).toHaveBeenCalledWith(
        resumeId,
        userId,
      );

      expect(result).toEqual(resume);
    });

    it('should throw 404 when the resume does not exist', async () => {
      repository.findByIdAndUserId.mockResolvedValue(null);

      await expect(
        service.findOne(resumeId, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not expose another user resume', async () => {
      repository.findByIdAndUserId.mockResolvedValue(null);

      await expect(
        service.findOne(resumeId, otherUserId),
      ).rejects.toThrow(NotFoundException);

      expect(repository.findByIdAndUserId).toHaveBeenCalledWith(
        resumeId,
        otherUserId,
      );
    });
  });

  describe('update', () => {
    it('should update a resume and trim its title', async () => {
      const updatedResume: Resume = {
        ...resume,
        title: 'Senior Software Engineer',
      };

      repository.update.mockResolvedValue(updatedResume);

      const result = await service.update(
        resumeId,
        userId,
        {
          title: '  Senior Software Engineer  ',
        },
      );

      expect(repository.update).toHaveBeenCalledWith(
        resumeId,
        userId,
        {
          title: 'Senior Software Engineer',
        },
      );

      expect(result).toEqual(updatedResume);
    });

    it('should throw 404 when the resume cannot be updated', async () => {
      repository.update.mockResolvedValue(null);

      await expect(
        service.update(resumeId, userId, {
          title: 'Updated Resume',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not update another user resume', async () => {
      repository.update.mockResolvedValue(null);

      await expect(
        service.update(resumeId, otherUserId, {
          title: 'Unauthorized Update',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(repository.update).toHaveBeenCalledWith(
        resumeId,
        otherUserId,
        {
          title: 'Unauthorized Update',
        },
      );
    });
  });

  describe('remove', () => {
    it('should delete a resume belonging to the user', async () => {
      repository.delete.mockResolvedValue(true);

      await expect(
        service.remove(resumeId, userId),
      ).resolves.toBeUndefined();

      expect(repository.delete).toHaveBeenCalledWith(
        resumeId,
        userId,
      );
    });

    it('should throw 404 when the resume does not exist', async () => {
      repository.delete.mockResolvedValue(false);

      await expect(
        service.remove(resumeId, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not delete another user resume', async () => {
      repository.delete.mockResolvedValue(false);

      await expect(
        service.remove(resumeId, otherUserId),
      ).rejects.toThrow(NotFoundException);

      expect(repository.delete).toHaveBeenCalledWith(
        resumeId,
        otherUserId,
      );
    });
  });
});
