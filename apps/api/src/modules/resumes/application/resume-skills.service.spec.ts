import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import {
  ResumeSkillsService,
} from './resume-skills.service.js';

import type {
  ResumeSkill,
  ResumeSkillRepository,
} from '../domain/resume-skill.repository.js';

import { ResumesService } from './resumes.service.js';

describe('ResumeSkillsService', () => {
  const resumeId = 'resume-1';
  const userId = 'user-1';
  const skillId = 'skill-1';

  const skill: ResumeSkill = {
    id: skillId,
    resumeId,
    name: 'TypeScript',
    category: 'Programmation',
    level: 'Avancé',
    position: 0,
    createdAt: new Date('2026-10-28T10:00:00.000Z'),
    updatedAt: new Date('2026-10-28T10:00:00.000Z'),
  };

  let service: ResumeSkillsService;

  let resumesService: {
    findOne: ReturnType<typeof vi.fn>;
  };

  let repository: {
    create: ReturnType<typeof vi.fn>;
    findAllByResumeId: ReturnType<typeof vi.fn>;
    findByIdAndResumeId: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    resumesService = {
      findOne: vi.fn().mockResolvedValue({ id: resumeId }),
    };

    repository = {
      create: vi.fn().mockResolvedValue(skill),
      findAllByResumeId: vi.fn().mockResolvedValue([skill]),
      findByIdAndResumeId: vi.fn().mockResolvedValue(skill),
      update: vi.fn().mockResolvedValue(skill),
      delete: vi.fn().mockResolvedValue(true),
    };

    service = new ResumeSkillsService(
      resumesService as unknown as ResumesService,
      repository as unknown as ResumeSkillRepository,
    );
  });

  describe('create', () => {
    it('creates a skill for the resume owner', async () => {
      const result = await service.create(resumeId, userId, {
        name: 'TypeScript',
        category: 'Programmation',
        level: 'Avancé',
      });

      expect(result).toEqual(skill);
      expect(resumesService.findOne).toHaveBeenCalledWith(resumeId, userId);
      expect(repository.create).toHaveBeenCalledWith({
        resumeId,
        name: 'TypeScript',
        category: 'Programmation',
        level: 'Avancé',
        position: 0,
      });
    });

    it('trims the skill name', async () => {
      await service.create(resumeId, userId, {
        name: '  TypeScript  ',
      });

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'TypeScript',
        }),
      );
    });

    it('rejects an empty name', async () => {
      await expect(
        service.create(resumeId, userId, {
          name: '   ',
        }),
      ).rejects.toThrow(BadRequestException);

      expect(repository.create).not.toHaveBeenCalled();
    });

    it('rejects a negative position', async () => {
      await expect(
        service.create(resumeId, userId, {
          name: 'Docker',
          position: -1,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects a name longer than 150 characters', async () => {
      await expect(
        service.create(resumeId, userId, {
          name: 'A'.repeat(151),
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('does not create a skill when the user does not own the resume', async () => {
      resumesService.findOne.mockRejectedValue(
        new NotFoundException('Resume not found'),
      );

      await expect(
        service.create(resumeId, 'another-user', {
          name: 'TypeScript',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns the resume skills', async () => {
      const result = await service.findAll(resumeId, userId);

      expect(result).toEqual([skill]);
      expect(repository.findAllByResumeId).toHaveBeenCalledWith(resumeId);
    });

    it('rejects access to another user resume', async () => {
      resumesService.findOne.mockRejectedValue(
        new NotFoundException('Resume not found'),
      );

      await expect(
        service.findAll(resumeId, 'another-user'),
      ).rejects.toThrow(NotFoundException);

      expect(repository.findAllByResumeId).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns an existing skill', async () => {
      const result = await service.findOne(resumeId, skillId, userId);

      expect(result).toEqual(skill);

      expect(repository.findByIdAndResumeId).toHaveBeenCalledWith(
        skillId,
        resumeId,
      );
    });

    it('throws 404 when the skill does not exist', async () => {
      repository.findByIdAndResumeId.mockResolvedValue(null);

      await expect(
        service.findOne(resumeId, skillId, userId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates an existing skill', async () => {
      const result = await service.update(resumeId, skillId, userId, {
        name: 'JavaScript',
        level: 'Expert',
        position: 1,
      });

      expect(result).toEqual(skill);

      expect(repository.update).toHaveBeenCalledWith(
        skillId,
        resumeId,
        {
          name: 'JavaScript',
          level: 'Expert',
          position: 1,
        },
      );
    });

    it('rejects an invalid position', async () => {
      await expect(
        service.update(resumeId, skillId, userId, {
          position: -2,
        }),
      ).rejects.toThrow(BadRequestException);

      expect(repository.update).not.toHaveBeenCalled();
    });

    it('throws 404 when the skill does not exist', async () => {
      repository.findByIdAndResumeId.mockResolvedValue(null);

      await expect(
        service.update(resumeId, skillId, userId, {
          level: 'Expert',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(repository.update).not.toHaveBeenCalled();
    });

    it('throws 404 when the update finds no matching row', async () => {
      repository.update.mockResolvedValue(null);

      await expect(
        service.update(resumeId, skillId, userId, {
          level: 'Expert',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes an existing skill', async () => {
      await expect(
        service.remove(resumeId, skillId, userId),
      ).resolves.toBeUndefined();

      expect(repository.delete).toHaveBeenCalledWith(
        skillId,
        resumeId,
      );
    });

    it('throws 404 when the skill cannot be deleted', async () => {
      repository.delete.mockResolvedValue(false);

      await expect(
        service.remove(resumeId, skillId, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('does not delete a skill belonging to another user', async () => {
      resumesService.findOne.mockRejectedValue(
        new NotFoundException('Resume not found'),
      );

      await expect(
        service.remove(resumeId, skillId, 'another-user'),
      ).rejects.toThrow(NotFoundException);

      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
