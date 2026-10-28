import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service.js';
import type {
  CreateResumeEducationData,
  ResumeEducation,
  ResumeEducationRepository,
  UpdateResumeEducationData,
} from '../domain/resume-education.repository.js';

@Injectable()
export class PrismaResumeEducationRepository
  implements ResumeEducationRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateResumeEducationData,
  ): Promise<ResumeEducation> {
    return this.prisma.resumeEducation.create({
      data: {
        resumeId: data.resumeId,
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        city: data.city,
        country: data.country,
        startDate: data.startDate,
        endDate: data.endDate,
        isCurrent: data.isCurrent ?? false,
        description: data.description,
        position: data.position ?? 0,
      },
    });
  }

  async findAllByResumeId(
    resumeId: string,
  ): Promise<ResumeEducation[]> {
    return this.prisma.resumeEducation.findMany({
      where: { resumeId },
      orderBy: [
        { position: 'asc' },
        { startDate: 'desc' },
      ],
    });
  }

  async findByIdAndResumeId(
    id: string,
    resumeId: string,
  ): Promise<ResumeEducation | null> {
    return this.prisma.resumeEducation.findFirst({
      where: {
        id,
        resumeId,
      },
    });
  }

  async update(
    id: string,
    resumeId: string,
    data: UpdateResumeEducationData,
  ): Promise<ResumeEducation | null> {
    const result = await this.prisma.resumeEducation.updateMany({
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

  async delete(
    id: string,
    resumeId: string,
  ): Promise<boolean> {
    const result = await this.prisma.resumeEducation.deleteMany({
      where: {
        id,
        resumeId,
      },
    });

    return result.count > 0;
  }
}
