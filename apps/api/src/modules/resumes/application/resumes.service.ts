import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type {
  CreateResumeData,
  Resume,
  ResumeRepository,
  UpdateResumeData,
} from '../domain/resume.repository.js';

export const RESUME_REPOSITORY = Symbol('RESUME_REPOSITORY');

@Injectable()
export class ResumesService {
  constructor(
    @Inject(RESUME_REPOSITORY)
    private readonly resumeRepository: ResumeRepository,
  ) {}

  async create(data: CreateResumeData): Promise<Resume> {
    return this.resumeRepository.create({
      userId: data.userId,
      title: data.title.trim(),
    });
  }

  async findAll(userId: string): Promise<Resume[]> {
    return this.resumeRepository.findAllByUserId(userId);
  }

  async findOne(
    id: string,
    userId: string,
  ): Promise<Resume> {
    const resume = await this.resumeRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return resume;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateResumeData,
  ): Promise<Resume> {
    const resume = await this.resumeRepository.update(
      id,
      userId,
      {
        title: data.title?.trim(),
      },
    );

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return resume;
  }

  async remove(
    id: string,
    userId: string,
  ): Promise<void> {
    const deleted = await this.resumeRepository.delete(
      id,
      userId,
    );

    if (!deleted) {
      throw new NotFoundException('Resume not found');
    }
  }
}
