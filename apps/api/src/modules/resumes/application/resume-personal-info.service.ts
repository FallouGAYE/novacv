import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  ResumesService,
} from './resumes.service.js';

import type {
  ResumePersonalInfo,
  ResumePersonalInfoRepository,
  UpsertResumePersonalInfoData,
} from '../domain/resume-personal-info.repository.js';

export const RESUME_PERSONAL_INFO_REPOSITORY = Symbol(
  'RESUME_PERSONAL_INFO_REPOSITORY',
);

@Injectable()
export class ResumePersonalInfoService {
  constructor(
    private readonly resumesService: ResumesService,

    @Inject(RESUME_PERSONAL_INFO_REPOSITORY)
    private readonly personalInfoRepository: ResumePersonalInfoRepository,
  ) {}

  /**
   * Retrieve personal information belonging to a user's resume.
   */
  async findByResumeId(
    resumeId: string,
    userId: string,
  ): Promise<ResumePersonalInfo> {
    // Verify ownership before accessing personal information.
    await this.resumesService.findOne(resumeId, userId);

    const personalInfo =
      await this.personalInfoRepository.findByResumeId(resumeId);

    if (!personalInfo) {
      throw new NotFoundException(
        'Resume personal information not found',
      );
    }

    return personalInfo;
  }

  /**
   * Create or update personal information for a user's resume.
   */
  async upsert(
    resumeId: string,
    userId: string,
    data: UpsertResumePersonalInfoData,
  ): Promise<ResumePersonalInfo> {
    // Prevent users from modifying another user's resume.
    await this.resumesService.findOne(resumeId, userId);

    return this.personalInfoRepository.upsert(
      resumeId,
      data,
    );
  }
}
