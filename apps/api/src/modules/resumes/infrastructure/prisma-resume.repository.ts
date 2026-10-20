import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service.js';

import type {
  CreateResumeData,
  Resume,
  ResumeRepository,
  UpdateResumeData,
} from '../domain/resume.repository.js';

@Injectable()
export class PrismaResumeRepository implements ResumeRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(data: CreateResumeData): Promise<Resume> {
    return this.prisma.resume.create({
      data: {
        userId: data.userId,
        title: data.title,
      },
    });
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Resume | null> {
    return this.prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async findAllByUserId(
    userId: string,
  ): Promise<Resume[]> {
    return this.prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: UpdateResumeData,
  ): Promise<Resume | null> {
    const result = await this.prisma.resume.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        title: data.title,
      },
    });

    if (result.count === 0) {
      return null;
    }

    return this.findByIdAndUserId(id, userId);
  }

  async delete(
    id: string,
    userId: string,
  ): Promise<boolean> {
    const result = await this.prisma.resume.deleteMany({
      where: {
        id,
        userId,
      },
    });

    return result.count > 0;
  }
}
