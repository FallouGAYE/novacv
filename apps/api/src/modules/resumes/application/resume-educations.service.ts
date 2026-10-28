import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateResumeEducationData,
  ResumeEducation,
  ResumeEducationRepository,
  UpdateResumeEducationData,
} from '../domain/resume-education.repository.js';
import { ResumesService } from './resumes.service.js';

export const RESUME_EDUCATION_REPOSITORY = Symbol(
  'RESUME_EDUCATION_REPOSITORY',
);

@Injectable()
export class ResumeEducationsService {
  constructor(
    private readonly resumesService: ResumesService,
    @Inject(RESUME_EDUCATION_REPOSITORY)
    private readonly educationRepository: ResumeEducationRepository,
  ) {}

  private async verifyOwnership(
    resumeId: string,
    userId: string,
  ): Promise<void> {
    await this.resumesService.findOne(resumeId, userId);
  }

  private validateDates(
    startDate: Date,
    endDate: Date | null,
    isCurrent: boolean,
  ): void {
    if (Number.isNaN(startDate.getTime())) {
      throw new BadRequestException('Invalid start date');
    }

    if (endDate && Number.isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid end date');
    }

    if (endDate && endDate < startDate) {
      throw new BadRequestException(
        'End date cannot be before start date',
      );
    }

    if (isCurrent && endDate !== null) {
      throw new BadRequestException(
        'Current education cannot have an end date',
      );
    }
  }

  async create(
    resumeId: string,
    userId: string,
    data: Omit<CreateResumeEducationData, 'resumeId'>,
  ): Promise<ResumeEducation> {
    await this.verifyOwnership(resumeId, userId);

    const endDate = data.endDate ?? null;
    const isCurrent = data.isCurrent ?? false;

    this.validateDates(data.startDate, endDate, isCurrent);

    if (!data.institution.trim() || !data.degree.trim()) {
      throw new BadRequestException(
        'Institution and degree are required',
      );
    }

    return this.educationRepository.create({
      ...data,
      resumeId,
      institution: data.institution.trim(),
      degree: data.degree.trim(),
      endDate,
      isCurrent,
    });
  }

  async findAll(
    resumeId: string,
    userId: string,
  ): Promise<ResumeEducation[]> {
    await this.verifyOwnership(resumeId, userId);

    return this.educationRepository.findAllByResumeId(resumeId);
  }

  async findOne(
    resumeId: string,
    educationId: string,
    userId: string,
  ): Promise<ResumeEducation> {
    await this.verifyOwnership(resumeId, userId);

    const education =
      await this.educationRepository.findByIdAndResumeId(
        educationId,
        resumeId,
      );

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    return education;
  }

  async update(
    resumeId: string,
    educationId: string,
    userId: string,
    data: UpdateResumeEducationData,
  ): Promise<ResumeEducation> {
    const existing = await this.findOne(
      resumeId,
      educationId,
      userId,
    );

    const startDate = data.startDate ?? existing.startDate;
    const endDate =
      data.endDate === undefined
        ? existing.endDate
        : data.endDate;
    const isCurrent = data.isCurrent ?? existing.isCurrent;

    this.validateDates(startDate, endDate, isCurrent);

    if (
      data.institution !== undefined &&
      !data.institution.trim()
    ) {
      throw new BadRequestException('Institution cannot be empty');
    }

    if (data.degree !== undefined && !data.degree.trim()) {
      throw new BadRequestException('Degree cannot be empty');
    }

    const updated = await this.educationRepository.update(
      educationId,
      resumeId,
      {
        ...data,
        institution: data.institution?.trim(),
        degree: data.degree?.trim(),
      },
    );

    if (!updated) {
      throw new NotFoundException('Education not found');
    }

    return updated;
  }

  async remove(
    resumeId: string,
    educationId: string,
    userId: string,
  ): Promise<void> {
    await this.verifyOwnership(resumeId, userId);

    const deleted = await this.educationRepository.delete(
      educationId,
      resumeId,
    );

    if (!deleted) {
      throw new NotFoundException('Education not found');
    }
  }
}
