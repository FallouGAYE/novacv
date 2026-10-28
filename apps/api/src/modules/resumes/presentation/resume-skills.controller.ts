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

import { ResumeSkillsService } from '../application/resume-skills.service.js';

import {
  createResumeSkillSchema,
  updateResumeSkillSchema,
} from './dto/resume-skill.dto.js';

import type {
  CreateResumeSkillDto,
  UpdateResumeSkillDto,
} from './dto/resume-skill.dto.js';

const skillProperties = {
  name: {
    type: 'string',
    minLength: 1,
    maxLength: 150,
    example: 'TypeScript',
  },
  category: {
    type: 'string',
    nullable: true,
    maxLength: 100,
    example: 'Langages de programmation',
  },
  level: {
    type: 'string',
    nullable: true,
    maxLength: 100,
    example: 'Avancé',
  },
  position: {
    type: 'integer',
    minimum: 0,
    example: 0,
  },
};

@ApiTags('Resume Skills')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('resumes/:resumeId/skills')
export class ResumeSkillsController {
  constructor(
    private readonly skillsService: ResumeSkillsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Add a skill to a resume',
  })
  @ApiParam({
    name: 'resumeId',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name'],
      additionalProperties: false,
      properties: skillProperties,
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Skill created',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid skill data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Resume not found',
  })
  create(
    @Param('resumeId', ParseUUIDPipe) resumeId: string,
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(createResumeSkillSchema))
    data: CreateResumeSkillDto,
  ) {
    return this.skillsService.create(
      resumeId,
      request.user!.id,
      data,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'List all skills of a resume',
  })
  @ApiParam({
    name: 'resumeId',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Skills retrieved',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Resume not found',
  })
  findAll(
    @Param('resumeId', ParseUUIDPipe) resumeId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.skillsService.findAll(
      resumeId,
      request.user!.id,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a skill by ID',
  })
  @ApiParam({
    name: 'resumeId',
    type: 'string',
    format: 'uuid',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Skill retrieved',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill or resume not found',
  })
  findOne(
    @Param('resumeId', ParseUUIDPipe) resumeId: string,
    @Param('id', ParseUUIDPipe) skillId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.skillsService.findOne(
      resumeId,
      skillId,
      request.user!.id,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a skill',
  })
  @ApiParam({
    name: 'resumeId',
    type: 'string',
    format: 'uuid',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({
    schema: {
      type: 'object',
      additionalProperties: false,
      properties: skillProperties,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Skill updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid skill data',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill or resume not found',
  })
  update(
    @Param('resumeId', ParseUUIDPipe) resumeId: string,
    @Param('id', ParseUUIDPipe) skillId: string,
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(updateResumeSkillSchema))
    data: UpdateResumeSkillDto,
  ) {
    return this.skillsService.update(
      resumeId,
      skillId,
      request.user!.id,
      data,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a skill',
  })
  @ApiParam({
    name: 'resumeId',
    type: 'string',
    format: 'uuid',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 204,
    description: 'Skill deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill or resume not found',
  })
  remove(
    @Param('resumeId', ParseUUIDPipe) resumeId: string,
    @Param('id', ParseUUIDPipe) skillId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.skillsService.remove(
      resumeId,
      skillId,
      request.user!.id,
    );
  }
}
