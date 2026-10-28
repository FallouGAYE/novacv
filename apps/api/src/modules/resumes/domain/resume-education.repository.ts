export interface ResumeEducation {
  id: string;
  resumeId: string;

  institution: string;
  degree: string;
  fieldOfStudy: string | null;

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

export interface CreateResumeEducationData {
  resumeId: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;

  city?: string | null;
  country?: string | null;

  startDate: Date;
  endDate?: Date | null;
  isCurrent?: boolean;

  description?: string | null;
  position?: number;
}

export interface UpdateResumeEducationData {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string | null;

  city?: string | null;
  country?: string | null;

  startDate?: Date;
  endDate?: Date | null;
  isCurrent?: boolean;

  description?: string | null;
  position?: number;
}

export interface ResumeEducationRepository {
  create(data: CreateResumeEducationData): Promise<ResumeEducation>;

  findAllByResumeId(resumeId: string): Promise<ResumeEducation[]>;

  findByIdAndResumeId(
    id: string,
    resumeId: string,
  ): Promise<ResumeEducation | null>;

  update(
    id: string,
    resumeId: string,
    data: UpdateResumeEducationData,
  ): Promise<ResumeEducation | null>;

  delete(id: string, resumeId: string): Promise<boolean>;
}
