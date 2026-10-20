import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PrismaResumeRepository } from './prisma-resume.repository.js';

import type { PrismaService } from '../../../infrastructure/database/prisma.service.js';
import type { Resume } from '../domain/resume.repository.js';

describe('PrismaResumeRepository', () => {
  const create = vi.fn();
  const findFirst = vi.fn();
  const findMany = vi.fn();
  const updateMany = vi.fn();
  const deleteMany = vi.fn();

  const prisma = {
    resume: {
      create,
      findFirst,
      findMany,
      updateMany,
      deleteMany,
    },
  } as unknown as PrismaService;

  const repository = new PrismaResumeRepository(prisma);

  const userId = '550e8400-e29b-41d4-a716-446655440000';
  const resumeId = '660e8400-e29b-41d4-a716-446655440000';

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

  // CREATE

  it('should create a resume', async () => {
    create.mockResolvedValue(resume);

    const result = await repository.create({
      userId,
      title: 'Software Engineer',
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        userId,
        title: 'Software Engineer',
      },
    });

    expect(result).toEqual(resume);
  });

  // READ ONE

  it('should find a resume belonging to a user', async () => {
    findFirst.mockResolvedValue(resume);

    const result = await repository.findByIdAndUserId(
      resumeId,
      userId,
    );

    expect(findFirst).toHaveBeenCalledWith({
      where: {
        id: resumeId,
        userId,
      },
    });

    expect(result).toEqual(resume);
  });

  it('should return null when a resume is not accessible', async () => {
    findFirst.mockResolvedValue(null);

    const otherUserId = '770e8400-e29b-41d4-a716-446655440000';

    const result = await repository.findByIdAndUserId(
      resumeId,
      otherUserId,
    );

    expect(result).toBeNull();

    expect(findFirst).toHaveBeenCalledWith({
      where: {
        id: resumeId,
        userId: otherUserId,
      },
    });
  });

  // READ ALL

  it('should list only the resumes belonging to a user', async () => {
    findMany.mockResolvedValue([resume]);

    const result = await repository.findAllByUserId(userId);

    expect(findMany).toHaveBeenCalledWith({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    expect(result).toEqual([resume]);
  });

  // UPDATE

  it('should update a resume belonging to a user', async () => {
    updateMany.mockResolvedValue({ count: 1 });

    const updatedResume: Resume = {
      ...resume,
      title: 'Senior Software Engineer',
    };

    findFirst.mockResolvedValue(updatedResume);

    const result = await repository.update(
      resumeId,
      userId,
      {
        title: 'Senior Software Engineer',
      },
    );

    expect(updateMany).toHaveBeenCalledWith({
      where: {
        id: resumeId,
        userId,
      },
      data: {
        title: 'Senior Software Engineer',
      },
    });

    expect(result).toEqual(updatedResume);
  });

  it('should not update another user resume', async () => {
    updateMany.mockResolvedValue({ count: 0 });

    const otherUserId = '770e8400-e29b-41d4-a716-446655440000';

    const result = await repository.update(
      resumeId,
      otherUserId,
      {
        title: 'Unauthorized Update',
      },
    );

    expect(result).toBeNull();

    expect(updateMany).toHaveBeenCalledWith({
      where: {
        id: resumeId,
        userId: otherUserId,
      },
      data: {
        title: 'Unauthorized Update',
      },
    });

    expect(findFirst).not.toHaveBeenCalled();
  });

  // DELETE

  it('should delete a resume belonging to a user', async () => {
    deleteMany.mockResolvedValue({ count: 1 });

    const result = await repository.delete(
      resumeId,
      userId,
    );

    expect(deleteMany).toHaveBeenCalledWith({
      where: {
        id: resumeId,
        userId,
      },
    });

    expect(result).toBe(true);
  });

  it('should not delete another user resume', async () => {
    deleteMany.mockResolvedValue({ count: 0 });

    const otherUserId = '770e8400-e29b-41d4-a716-446655440000';

    const result = await repository.delete(
      resumeId,
      otherUserId,
    );

    expect(deleteMany).toHaveBeenCalledWith({
      where: {
        id: resumeId,
        userId: otherUserId,
      },
    });

    expect(result).toBe(false);
  });
});
