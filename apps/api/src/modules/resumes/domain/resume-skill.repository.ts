export interface ResumeSkill {
  id: string;
  resumeId: string;

  name: string;
  category: string | null;
  level: string | null;

  position: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateResumeSkillData {
  resumeId: string;
  name: string;
  category?: string | null;
  level?: string | null;
  position?: number;
}

export interface UpdateResumeSkillData {
  name?: string;
  category?: string | null;
  level?: string | null;
  position?: number;
}

export interface ResumeSkillRepository {
  create(data: CreateResumeSkillData): Promise<ResumeSkill>;

  findAllByResumeId(resumeId: string): Promise<ResumeSkill[]>;

  findByIdAndResumeId(
    skillId: string,
    resumeId: string,
  ): Promise<ResumeSkill | null>;

  update(
    skillId: string,
    resumeId: string,
    data: UpdateResumeSkillData,
  ): Promise<ResumeSkill | null>;

  delete(skillId: string, resumeId: string): Promise<boolean>;
}
