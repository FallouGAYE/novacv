import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../infrastructure/database/database.module.js';
import { AuthModule } from '../auth/auth.module.js';

import {
  RESUME_REPOSITORY,
  ResumesService,
} from './application/resumes.service.js';

import {
  RESUME_PERSONAL_INFO_REPOSITORY,
  ResumePersonalInfoService,
} from './application/resume-personal-info.service.js';

import {
  RESUME_EXPERIENCE_REPOSITORY,
  ResumeExperiencesService,
} from './application/resume-experiences.service.js';

import {
  RESUME_EDUCATION_REPOSITORY,
  ResumeEducationsService,
} from './application/resume-educations.service.js';

import {
  RESUME_SKILL_REPOSITORY,
  ResumeSkillsService,
} from './application/resume-skills.service.js';

import { PrismaResumeRepository } from './infrastructure/prisma-resume.repository.js';

import { PrismaResumePersonalInfoRepository } from './infrastructure/prisma-resume-personal-info.repository.js';

import { PrismaResumeExperienceRepository } from './infrastructure/prisma-resume-experience.repository.js';

import { PrismaResumeEducationRepository } from './infrastructure/prisma-resume-education.repository.js';

import { PrismaResumeSkillRepository } from './infrastructure/prisma-resume-skill.repository.js';

import { ResumesController } from './presentation/resumes.controller.js';

import { ResumePersonalInfoController } from './presentation/resume-personal-info.controller.js';

import { ResumeExperiencesController } from './presentation/resume-experiences.controller.js';

import { ResumeEducationsController } from './presentation/resume-educations.controller.js';

import { ResumeSkillsController } from './presentation/resume-skills.controller.js';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
  ],

  controllers: [
    ResumesController,
    ResumePersonalInfoController,
    ResumeExperiencesController,
    ResumeEducationsController,
    ResumeSkillsController,
  ],

  providers: [
    ResumesService,
    ResumePersonalInfoService,
    ResumeExperiencesService,
    ResumeEducationsService,
    ResumeSkillsService,

    {
      provide: RESUME_REPOSITORY,
      useClass: PrismaResumeRepository,
    },

    {
      provide: RESUME_PERSONAL_INFO_REPOSITORY,
      useClass: PrismaResumePersonalInfoRepository,
    },

    {
      provide: RESUME_EXPERIENCE_REPOSITORY,
      useClass: PrismaResumeExperienceRepository,
    },

    {
      provide: RESUME_EDUCATION_REPOSITORY,
      useClass: PrismaResumeEducationRepository,
    },

    {
      provide: RESUME_SKILL_REPOSITORY,
      useClass: PrismaResumeSkillRepository,
    },
  ],

  exports: [
    ResumesService,
    ResumePersonalInfoService,
    ResumeExperiencesService,
    ResumeEducationsService,
    ResumeSkillsService,
  ],
})
export class ResumesModule {}
