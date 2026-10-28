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
import type { AuthenticatedRequest } from '../../auth/presentation/guards/jwt-auth.guard.js';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard.js';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import { ResumeEducationsService } from '../application/resume-educations.service.js';
import {
  createResumeEducationSchema,
  updateResumeEducationSchema,
  type CreateResumeEducationDto,
  type UpdateResumeEducationDto,
} from './dto/resume-education.dto.js';

const educationProperties = {
  institution: {
    type: 'string',
    example: 'Aix-Marseille Université',
  },
  degree: {
    type: 'string',
    example: 'Master Informatique',
  },
  fieldOfStudy: {
    type: 'string',
    example: 'Informatique et Mathématiques Discrètes',
    nullable: true,
  },
  city: {
    type: 'string',
    example: 'Marseille',
    nullable: true,
  },
  country: {
    type: 'string',
    example: 'France',
    nullable: true,
  },
  startDate: {
    type: 'string',
    format: 'date',
    example: '2024-09-01',
  },
  endDate: {
    type: 'string',
    format: 'date',
    example: '2026-06-30',
    nullable: true,
  },
  isCurrent: {
    type: 'boolean',
    example: false,
  },
  description: {
    type: 'string',
    example: 'Formation en informatique.',
    nullable: true,
  },
  position: {
    type: 'integer',
    example: 0,
  },
} as const;

@ApiTags('Resume Educations')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('resumes/:resumeId/educations')
export class ResumeEducationsController {
  constructor(
    private readonly educationsService: ResumeEducationsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Ajouter une formation à un CV' })
  @ApiParam({ name: 'resumeId', type: 'string', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['institution', 'degree', 'startDate'],
      properties: educationProperties,
    },
  })
  @ApiResponse({ status: 201, description: 'Formation créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 404, description: 'CV introuvable' })
  create(
    @Param('resumeId', ParseUUIDPipe) resumeId: string,
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(createResumeEducationSchema))
    data: CreateResumeEducationDto,
  ) {
    return this.educationsService.create(
      resumeId,
      request.user!.id,
      data,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Lister les formations d’un CV' })
  @ApiParam({ name: 'resumeId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Liste des formations' })
  findAll(
    @Param('resumeId', ParseUUIDPipe) resumeId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.educationsService.findAll(
      resumeId,
      request.user!.id,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter une formation' })
  @ApiParam({ name: 'resumeId', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Formation trouvée' })
  @ApiResponse({ status: 404, description: 'Formation introuvable' })
  findOne(
    @Param('resumeId', ParseUUIDPipe) resumeId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.educationsService.findOne(
      resumeId,
      id,
      request.user!.id,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier une formation' })
  @ApiParam({ name: 'resumeId', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: educationProperties,
    },
  })
  @ApiResponse({ status: 200, description: 'Formation modifiée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Formation introuvable' })
  update(
    @Param('resumeId', ParseUUIDPipe) resumeId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
    @Body(new ZodValidationPipe(updateResumeEducationSchema))
    data: UpdateResumeEducationDto,
  ) {
    return this.educationsService.update(
      resumeId,
      id,
      request.user!.id,
      data,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une formation' })
  @ApiParam({ name: 'resumeId', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Formation supprimée' })
  @ApiResponse({ status: 404, description: 'Formation introuvable' })
  async remove(
    @Param('resumeId', ParseUUIDPipe) resumeId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.educationsService.remove(
      resumeId,
      id,
      request.user!.id,
    );
  }
}
