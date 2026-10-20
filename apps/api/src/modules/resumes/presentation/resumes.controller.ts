import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { AuthenticatedRequest } from '../../auth/presentation/guards/jwt-auth.guard.js';

import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard.js';

import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';

import { ResumesService } from '../application/resumes.service.js';

import type { Resume } from '../domain/resume.repository.js';

import {
  createResumeSchema,
  updateResumeSchema,
} from './dto/resume.dto.js';

import type {
  CreateResumeDto,
  UpdateResumeDto,
} from './dto/resume.dto.js';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(
    private readonly resumesService: ResumesService,
  ) {}

  /**
   * POST /resumes
   *
   * Create a resume for the authenticated user.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(createResumeSchema))
    dto: CreateResumeDto,
  ): Promise<Resume> {
    return this.resumesService.create({
      userId: request.user!.id,
      title: dto.title,
    });
  }

  /**
   * GET /resumes
   *
   * List all resumes belonging to the authenticated user.
   */
  @Get()
  async findAll(
    @Req() request: AuthenticatedRequest,
  ): Promise<Resume[]> {
    return this.resumesService.findAll(
      request.user!.id,
    );
  }

  /**
   * GET /resumes/:id
   *
   * Retrieve one resume belonging to the authenticated user.
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<Resume> {
    return this.resumesService.findOne(
      id,
      request.user!.id,
    );
  }

  /**
   * PATCH /resumes/:id
   *
   * Update a resume belonging to the authenticated user.
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(updateResumeSchema))
    dto: UpdateResumeDto,
  ): Promise<Resume> {
    return this.resumesService.update(
      id,
      request.user!.id,
      dto,
    );
  }

  /**
   * DELETE /resumes/:id
   *
   * Delete a resume belonging to the authenticated user.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.resumesService.remove(
      id,
      request.user!.id,
    );
  }
}
