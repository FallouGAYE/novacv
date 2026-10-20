import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../infrastructure/database/prisma.service.js';

import type {
  CreateResumeExperienceData,
  ResumeExperience,
  ResumeExperienceRepository,
  UpdateResumeExperienceData,
} from '../domain/resume-experience.repository.js';

@Injectable()
export class PrismaResumeExperienceRepository
  implements ResumeExperienceRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Create a new professional experience.
   */
  async create(
    data: CreateResumeExperienceData,
  ): Promise<ResumeExperience> {
    return this.prisma.resumeExperience.create({
      data,
    });
  }

  /**
   * Retrieve all experiences belonging to a resume.
   */
  async findAllByResumeId(
    resumeId: string,
  ): Promise<ResumeExperience[]> {
    return this.prisma.resumeExperience.findMany({
      where: {
        resumeId,
      },
      orderBy: [
        {
          position: 'asc',
        },
        {
          startDate: 'desc',
        },
      ],
    });
  }

  /**
   * Retrieve an experience belonging to a specific resume.
   */
  async findByIdAndResumeId(
    id: string,
    resumeId: string,
  ): Promise<ResumeExperience | null> {
    return this.prisma.resumeExperience.findFirst({
      where: {
        id,
        resumeId,
      },
    });
  }

  /**
   * Update an experience belonging to a specific resume.
   */
  async update(
    id: string,
    resumeId: string,
    data: UpdateResumeExperienceData,
  ): Promise<ResumeExperience | null> {
    const result = await this.prisma.resumeExperience.updateMany({
      where: {
        id,
        resumeId,
      },
      data,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findByIdAndResumeId(id, resumeId);
  }

  /**
   * Delete an experience belonging to a specific resume.
   */
  async delete(
    id: string,
    resumeId: string,
  ): Promise<boolean> {
    const result = await this.prisma.resumeExperience.deleteMany({
      where: {
        id,
        resumeId,
      },
    });

    return result.count > 0;
  }
}
