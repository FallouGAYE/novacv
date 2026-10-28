import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ResumesService } from './resumes.service.js';

import type {
  CreateResumeSkillData,
  ResumeSkill,
  ResumeSkillRepository,
  UpdateResumeSkillData,
} from '../domain/resume-skill.repository.js';

export const RESUME_SKILL_REPOSITORY = Symbol(
  'RESUME_SKILL_REPOSITORY',
);

@Injectable()
export class ResumeSkillsService {
  constructor(
    private readonly resumesService: ResumesService,

    @Inject(RESUME_SKILL_REPOSITORY)
    private readonly repository: ResumeSkillRepository,
  ) {}

  private validateName(name: string): string {
    const trimmed = name.trim();

    if (!trimmed || trimmed.length > 150) {
      throw new BadRequestException(
        'Skill name must contain between 1 and 150 characters',
      );
    }

    return trimmed;
  }

  private validatePosition(position: number | undefined): void {
    if (
      position !== undefined &&
      (!Number.isInteger(position) || position < 0)
    ) {
      throw new BadRequestException(
        'Position must be a non-negative integer',
      );
    }
  }

  private normalizeOptionalText(
    value: string | null | undefined,
    field: string,
  ): string | null | undefined {
    if (value === undefined || value === null) {
      return value;
    }

    const trimmed = value.trim();

    if (trimmed.length > 100) {
      throw new BadRequestException(
        `${field} must contain at most 100 characters`,
      );
    }

    return trimmed || null;
  }

  async create(
    resumeId: string,
    userId: string,
    data: Omit<CreateResumeSkillData, 'resumeId'>,
  ): Promise<ResumeSkill> {
    await this.resumesService.findOne(resumeId, userId);

    this.validatePosition(data.position);

    return this.repository.create({
      resumeId,
      name: this.validateName(data.name),
      category: this.normalizeOptionalText(
        data.category,
        'Category',
      ),
      level: this.normalizeOptionalText(
        data.level,
        'Level',
      ),
      position: data.position ?? 0,
    });
  }

  async findAll(
    resumeId: string,
    userId: string,
  ): Promise<ResumeSkill[]> {
    await this.resumesService.findOne(resumeId, userId);

    return this.repository.findAllByResumeId(resumeId);
  }

  async findOne(
    resumeId: string,
    skillId: string,
    userId: string,
  ): Promise<ResumeSkill> {
    await this.resumesService.findOne(resumeId, userId);

    const skill = await this.repository.findByIdAndResumeId(
      skillId,
      resumeId,
    );

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return skill;
  }

  async update(
    resumeId: string,
    skillId: string,
    userId: string,
    data: UpdateResumeSkillData,
  ): Promise<ResumeSkill> {
    await this.findOne(resumeId, skillId, userId);

    this.validatePosition(data.position);

    const updated = await this.repository.update(
      skillId,
      resumeId,
      {
        ...(data.name !== undefined && {
          name: this.validateName(data.name),
        }),
        ...(data.category !== undefined && {
          category: this.normalizeOptionalText(
            data.category,
            'Category',
          ),
        }),
        ...(data.level !== undefined && {
          level: this.normalizeOptionalText(
            data.level,
            'Level',
          ),
        }),
        ...(data.position !== undefined && {
          position: data.position,
        }),
      },
    );

    if (!updated) {
      throw new NotFoundException('Skill not found');
    }

    return updated;
  }

  async remove(
    resumeId: string,
    skillId: string,
    userId: string,
  ): Promise<void> {
    await this.resumesService.findOne(resumeId, userId);

    const deleted = await this.repository.delete(
      skillId,
      resumeId,
    );

    if (!deleted) {
      throw new NotFoundException('Skill not found');
    }
  }
}
