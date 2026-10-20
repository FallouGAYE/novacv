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

import { PrismaResumeRepository } from './infrastructure/prisma-resume.repository.js';

import { PrismaResumePersonalInfoRepository } from './infrastructure/prisma-resume-personal-info.repository.js';

import { PrismaResumeExperienceRepository } from './infrastructure/prisma-resume-experience.repository.js';

import { ResumesController } from './presentation/resumes.controller.js';

import { ResumePersonalInfoController } from './presentation/resume-personal-info.controller.js';

import { ResumeExperiencesController } from './presentation/resume-experiences.controller.js';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
  ],

  controllers: [
    ResumesController,
    ResumePersonalInfoController,
    ResumeExperiencesController,
  ],

  providers: [
    ResumesService,
    ResumePersonalInfoService,
    ResumeExperiencesService,

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
  ],

  exports: [
    ResumesService,
    ResumePersonalInfoService,
    ResumeExperiencesService,
  ],
})
export class ResumesModule {}
