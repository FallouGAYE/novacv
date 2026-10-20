import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../infrastructure/database/prisma.service.js';

import type {
  ResumePersonalInfo,
  ResumePersonalInfoRepository,
  UpsertResumePersonalInfoData,
} from '../domain/resume-personal-info.repository.js';

@Injectable()
export class PrismaResumePersonalInfoRepository
  implements ResumePersonalInfoRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Find personal information associated with a resume.
   */
  async findByResumeId(
    resumeId: string,
  ): Promise<ResumePersonalInfo | null> {
    return this.prisma.resumePersonalInfo.findUnique({
      where: {
        resumeId,
      },
    });
  }

  /**
   * Create or update the personal information of a resume.
   */
  async upsert(
    resumeId: string,
    data: UpsertResumePersonalInfoData,
  ): Promise<ResumePersonalInfo> {
    return this.prisma.resumePersonalInfo.upsert({
      where: {
        resumeId,
      },
      create: {
        resumeId,
        ...data,
      },
      update: {
        ...data,
      },
    });
  }
}
