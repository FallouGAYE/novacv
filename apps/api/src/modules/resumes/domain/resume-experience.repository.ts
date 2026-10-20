export interface ResumeExperience {
  id: string;
  resumeId: string;

  jobTitle: string;
  company: string;

  city: string | null;
  country: string | null;

  startDate: Date;
  endDate: Date | null;

  isCurrent: boolean;

  description: string | null;

  position: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateResumeExperienceData {
  resumeId: string;

  jobTitle: string;
  company: string;

  city?: string | null;
  country?: string | null;

  startDate: Date;
  endDate?: Date | null;

  isCurrent?: boolean;

  description?: string | null;

  position?: number;
}

export interface UpdateResumeExperienceData {
  jobTitle?: string;
  company?: string;

  city?: string | null;
  country?: string | null;

  startDate?: Date;
  endDate?: Date | null;

  isCurrent?: boolean;

  description?: string | null;

  position?: number;
}

export interface ResumeExperienceRepository {
  create(
    data: CreateResumeExperienceData,
  ): Promise<ResumeExperience>;

  findAllByResumeId(
    resumeId: string,
  ): Promise<ResumeExperience[]>;

  findByIdAndResumeId(
    id: string,
    resumeId: string,
  ): Promise<ResumeExperience | null>;

  update(
    id: string,
    resumeId: string,
    data: UpdateResumeExperienceData,
  ): Promise<ResumeExperience | null>;

  delete(
    id: string,
    resumeId: string,
  ): Promise<boolean>;
}
