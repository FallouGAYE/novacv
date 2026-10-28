import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../infrastructure/database/prisma.service.js';

import type {
  CreateResumeSkillData,
  ResumeSkill,
  ResumeSkillRepository,
  UpdateResumeSkillData,
} from '../domain/resume-skill.repository.js';

@Injectable()
export class PrismaResumeSkillRepository
  implements ResumeSkillRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateResumeSkillData): Promise<ResumeSkill> {
    return this.prisma.resumeSkill.create({
      data: {
        resumeId: data.resumeId,
        name: data.name,
        category: data.category ?? null,
        level: data.level ?? null,
        position: data.position ?? 0,
      },
    });
  }

  async findAllByResumeId(
    resumeId: string,
  ): Promise<ResumeSkill[]> {
    return this.prisma.resumeSkill.findMany({
      where: {
        resumeId,
      },
      orderBy: [
        { position: 'asc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async findByIdAndResumeId(
    skillId: string,
    resumeId: string,
  ): Promise<ResumeSkill | null> {
    return this.prisma.resumeSkill.findFirst({
      where: {
        id: skillId,
        resumeId,
      },
    });
  }

  async update(
    skillId: string,
    resumeId: string,
    data: UpdateResumeSkillData,
  ): Promise<ResumeSkill | null> {
    const result = await this.prisma.resumeSkill.updateMany({
      where: {
        id: skillId,
        resumeId,
      },
      data,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findByIdAndResumeId(skillId, resumeId);
  }

  async delete(
    skillId: string,
    resumeId: string,
  ): Promise<boolean> {
    const result = await this.prisma.resumeSkill.deleteMany({
      where: {
        id: skillId,
        resumeId,
      },
    });

    return result.count > 0;
  }
}
