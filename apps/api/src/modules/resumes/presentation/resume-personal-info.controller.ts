import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { AuthenticatedRequest } from '../../auth/presentation/guards/jwt-auth.guard.js';

import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard.js';

import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';

import { ResumePersonalInfoService } from '../application/resume-personal-info.service.js';

import type {
  ResumePersonalInfo,
} from '../domain/resume-personal-info.repository.js';

import {
  upsertResumePersonalInfoSchema,
} from './dto/resume-personal-info.dto.js';

import type {
  UpsertResumePersonalInfoDto,
} from './dto/resume-personal-info.dto.js';

@Controller('resumes/:id/personal-info')
@UseGuards(JwtAuthGuard)
export class ResumePersonalInfoController {
  constructor(
    private readonly personalInfoService: ResumePersonalInfoService,
  ) {}

  /**
   * GET /resumes/:id/personal-info
   *
   * Retrieve personal information for an owned resume.
   */
  @Get()
  async findOne(
    @Param('id') resumeId: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<ResumePersonalInfo> {
    return this.personalInfoService.findByResumeId(
      resumeId,
      request.user!.id,
    );
  }

  /**
   * PUT /resumes/:id/personal-info
   *
   * Create or update personal information for an owned resume.
   */
  @Put()
  async upsert(
    @Param('id') resumeId: string,
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(upsertResumePersonalInfoSchema))
    dto: UpsertResumePersonalInfoDto,
  ): Promise<ResumePersonalInfo> {
    return this.personalInfoService.upsert(
      resumeId,
      request.user!.id,
      dto,
    );
  }
}
