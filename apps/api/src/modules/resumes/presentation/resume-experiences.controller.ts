import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';

import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard.js';

import type {
  AuthenticatedRequest,
} from '../../auth/presentation/guards/jwt-auth.guard.js';

import { ResumeExperiencesService } from '../application/resume-experiences.service.js';

import type {
  ResumeExperience,
} from '../domain/resume-experience.repository.js';

import {
  createResumeExperienceSchema,
  updateResumeExperienceSchema,
} from './dto/resume-experience.dto.js';

import type {
  CreateResumeExperienceDto,
  UpdateResumeExperienceDto,
} from './dto/resume-experience.dto.js';

@Controller('resumes/:resumeId/experiences')
@UseGuards(JwtAuthGuard)
export class ResumeExperiencesController {
  constructor(
    private readonly experiencesService: ResumeExperiencesService,
  ) {}

  /**
   * POST /resumes/:resumeId/experiences
   */
  @Post()
  async create(
    @Param('resumeId', ParseUUIDPipe) resumeId: string,
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(createResumeExperienceSchema))
    dto: CreateResumeExperienceDto,
  ): Promise<ResumeExperience> {
    return this.experiencesService.create(
      resumeId,
      request.user!.id,
      dto,
    );
  }

  /**
   * GET /resumes/:resumeId/experiences
   */
  @Get()
  async findAll(
    @Param('resumeId', ParseUUIDPipe) resumeId: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<ResumeExperience[]> {
    return this.experiencesService.findAll(
      resumeId,
      request.user!.id,
    );
  }

  /**
   * GET /resumes/:resumeId/experiences/:id
   */
  @Get(':id')
  async findOne(
    @Param('resumeId', ParseUUIDPipe) resumeId: string,
    @Param('id', ParseUUIDPipe) experienceId: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<ResumeExperience> {
    return this.experiencesService.findOne(
      resumeId,
      request.user!.id,
      experienceId,
    );
  }

  /**
   * PATCH /resumes/:resumeId/experiences/:id
   */
  @Patch(':id')
  async update(
    @Param('resumeId', ParseUUIDPipe) resumeId: string,
    @Param('id', ParseUUIDPipe) experienceId: string,
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(updateResumeExperienceSchema))
    dto: UpdateResumeExperienceDto,
  ): Promise<ResumeExperience> {
    return this.experiencesService.update(
      resumeId,
      request.user!.id,
      experienceId,
      dto,
    );
  }

  /**
   * DELETE /resumes/:resumeId/experiences/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('resumeId', ParseUUIDPipe) resumeId: string,
    @Param('id', ParseUUIDPipe) experienceId: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.experiencesService.remove(
      resumeId,
      request.user!.id,
      experienceId,
    );
  }
}
