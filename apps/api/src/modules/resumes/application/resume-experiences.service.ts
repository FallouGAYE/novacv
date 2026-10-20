import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ResumesService } from './resumes.service.js';

import type {
  CreateResumeExperienceData,
  ResumeExperience,
  ResumeExperienceRepository,
  UpdateResumeExperienceData,
} from '../domain/resume-experience.repository.js';

export const RESUME_EXPERIENCE_REPOSITORY = Symbol(
  'RESUME_EXPERIENCE_REPOSITORY',
);

@Injectable()
export class ResumeExperiencesService {
  constructor(
    private readonly resumesService: ResumesService,

    @Inject(RESUME_EXPERIENCE_REPOSITORY)
    private readonly experienceRepository: ResumeExperienceRepository,
  ) {}

  /**
   * Ensure that the authenticated user owns the resume.
   */
  private async verifyOwnership(
    resumeId: string,
    userId: string,
  ): Promise<void> {
    await this.resumesService.findOne(resumeId, userId);
  }

  /**
   * Validate professional experience dates.
   */
  private validateDates(
    startDate: Date,
    endDate: Date | null,
    isCurrent: boolean,
  ): void {
    if (
      Number.isNaN(startDate.getTime()) ||
      (endDate !== null && Number.isNaN(endDate.getTime()))
    ) {
      throw new BadRequestException('Invalid experience dates');
    }

    if (endDate && endDate < startDate) {
      throw new BadRequestException(
        'End date cannot be before start date',
      );
    }

    if (isCurrent && endDate !== null) {
      throw new BadRequestException(
        'Current experience cannot have an end date',
      );
    }
  }

  /**
   * Create a professional experience.
   */
  async create(
    resumeId: string,
    userId: string,
    data: Omit<CreateResumeExperienceData, 'resumeId'>,
  ): Promise<ResumeExperience> {
    await this.verifyOwnership(resumeId, userId);

    const startDate = data.startDate;
    const endDate = data.endDate ?? null;
    const isCurrent = data.isCurrent ?? false;

    this.validateDates(startDate, endDate, isCurrent);

    return this.experienceRepository.create({
      ...data,
      resumeId,
      jobTitle: data.jobTitle.trim(),
      company: data.company.trim(),
      endDate,
      isCurrent,
    });
  }

  /**
   * List all experiences belonging to a resume.
   */
  async findAll(
    resumeId: string,
    userId: string,
  ): Promise<ResumeExperience[]> {
    await this.verifyOwnership(resumeId, userId);

    return this.experienceRepository.findAllByResumeId(resumeId);
  }

  /**
   * Retrieve one professional experience.
   */
  async findOne(
    resumeId: string,
    userId: string,
    experienceId: string,
  ): Promise<ResumeExperience> {
    await this.verifyOwnership(resumeId, userId);

    const experience =
      await this.experienceRepository.findByIdAndResumeId(
        experienceId,
        resumeId,
      );

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    return experience;
  }

  /**
   * Update an existing professional experience.
   */
  async update(
    resumeId: string,
    userId: string,
    experienceId: string,
    data: UpdateResumeExperienceData,
  ): Promise<ResumeExperience> {
    await this.verifyOwnership(resumeId, userId);

    const existing =
      await this.experienceRepository.findByIdAndResumeId(
        experienceId,
        resumeId,
      );

    if (!existing) {
      throw new NotFoundException('Experience not found');
    }

    const startDate = data.startDate ?? existing.startDate;

    const endDate =
      data.endDate === undefined
        ? existing.endDate
        : data.endDate;

    const isCurrent = data.isCurrent ?? existing.isCurrent;

    this.validateDates(startDate, endDate, isCurrent);

    const updated = await this.experienceRepository.update(
      experienceId,
      resumeId,
      {
        ...data,
        jobTitle: data.jobTitle?.trim(),
        company: data.company?.trim(),
      },
    );

    if (!updated) {
      throw new NotFoundException('Experience not found');
    }

    return updated;
  }

  /**
   * Delete a professional experience.
   */
  async remove(
    resumeId: string,
    userId: string,
    experienceId: string,
  ): Promise<void> {
    await this.verifyOwnership(resumeId, userId);

    const deleted = await this.experienceRepository.delete(
      experienceId,
      resumeId,
    );

    if (!deleted) {
      throw new NotFoundException('Experience not found');
    }
  }
}
