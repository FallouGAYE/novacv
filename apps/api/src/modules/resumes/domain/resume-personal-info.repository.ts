export interface ResumePersonalInfo {
  id: string;
  resumeId: string;

  firstName: string | null;
  lastName: string | null;
  jobTitle: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  linkedin: string | null;
  github: string | null;
  website: string | null;
  summary: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertResumePersonalInfoData {
  firstName?: string | null;
  lastName?: string | null;
  jobTitle?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  linkedin?: string | null;
  github?: string | null;
  website?: string | null;
  summary?: string | null;
}

export interface ResumePersonalInfoRepository {
  findByResumeId(
    resumeId: string,
  ): Promise<ResumePersonalInfo | null>;

  upsert(
    resumeId: string,
    data: UpsertResumePersonalInfoData,
  ): Promise<ResumePersonalInfo>;
}
