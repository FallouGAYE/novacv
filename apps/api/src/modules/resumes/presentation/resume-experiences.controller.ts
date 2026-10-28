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

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';

import {
  JwtAuthGuard,
} from '../../auth/presentation/guards/jwt-auth.guard.js';

import type {
  AuthenticatedRequest,
} from '../../auth/presentation/guards/jwt-auth.guard.js';

import {
  ResumeExperiencesService,
} from '../application/resume-experiences.service.js';

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

/**
 * Swagger schema for professional experiences.
 */
const experienceProperties = {
  jobTitle: {
    type: 'string',
    maxLength: 150,
    example: 'Développeur Full Stack',
  },
  company: {
    type: 'string',
    maxLength: 150,
    example: 'NovaCV',
  },
  city: {
    type: 'string',
    maxLength: 120,
    nullable: true,
    example: 'Marseille',
  },
  country: {
    type: 'string',
    maxLength: 120,
    nullable: true,
    example: 'France',
  },
  startDate: {
    type: 'string',
    format: 'date',
    example: '2026-10-01',
  },
  endDate: {
    type: 'string',
    format: 'date',
    nullable: true,
    example: null,
  },
  isCurrent: {
    type: 'boolean',
    example: true,
  },
  description: {
    type: 'string',
    maxLength: 5000,
    nullable: true,
    example:
      'Développement de la plateforme NovaCV avec NestJS, Prisma et PostgreSQL.',
  },
  position: {
    type: 'integer',
    minimum: 0,
    maximum: 10000,
    example: 0,
  },
};

@ApiTags('Resume Experiences')
@ApiBearerAuth('JWT')
@Controller('resumes/:resumeId/experiences')
@UseGuards(JwtAuthGuard)
export class ResumeExperiencesController {
  constructor(
    private readonly experiencesService: ResumeExperiencesService,
  ) {}

  /**
   * Create a professional experience.
   *
   * POST /resumes/:resumeId/experiences
   */
  @Post()
  @ApiOperation({
    summary: 'Create a professional experience',
    description:
      'Add a professional experience to an authenticated user resume.',
  })
  @ApiParam({
    name: 'resumeId',
    type: String,
    format: 'uuid',
    description: 'Resume identifier',
  })
  @ApiBody({
    description: 'Professional experience information',
    schema: {
      type: 'object',
      required: ['jobTitle', 'company', 'startDate'],
      additionalProperties: false,
      properties: experienceProperties,
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Professional experience created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid experience data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Resume not found.',
  })
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
   * List professional experiences.
   *
   * GET /resumes/:resumeId/experiences
   */
  @Get()
  @ApiOperation({
    summary: 'List professional experiences',
    description:
      'Retrieve all professional experiences belonging to a resume.',
  })
  @ApiParam({
    name: 'resumeId',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Professional experiences retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Resume not found.',
  })
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
   * Retrieve one professional experience.
   *
   * GET /resumes/:resumeId/experiences/:id
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get a professional experience',
  })
  @ApiParam({
    name: 'resumeId',
    type: String,
    format: 'uuid',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Professional experience identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Professional experience retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Experience or resume not found.',
  })
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
   * Update a professional experience.
   *
   * PATCH /resumes/:resumeId/experiences/:id
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a professional experience',
    description:
      'Update one or more fields of an existing professional experience.',
  })
  @ApiParam({
    name: 'resumeId',
    type: String,
    format: 'uuid',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
  })
  @ApiBody({
    description: 'Fields to update',
    schema: {
      type: 'object',
      additionalProperties: false,
      properties: experienceProperties,
    },
    examples: {
      updateJobTitle: {
        summary: 'Update job title',
        value: {
          jobTitle: 'Ingénieur logiciel',
        },
      },
      updateCurrentPosition: {
        summary: 'Mark experience as current',
        value: {
          isCurrent: true,
          endDate: null,
        },
      },
      updateDescription: {
        summary: 'Update description',
        value: {
          description:
            'Développement et maintenance d’applications web.',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Professional experience updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid experience data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Experience or resume not found.',
  })
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
   * Delete a professional experience.
   *
   * DELETE /resumes/:resumeId/experiences/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a professional experience',
    description:
      'Permanently delete a professional experience from a resume.',
  })
  @ApiParam({
    name: 'resumeId',
    type: String,
    format: 'uuid',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 204,
    description: 'Professional experience deleted successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Experience or resume not found.',
  })
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