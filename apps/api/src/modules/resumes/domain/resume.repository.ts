export interface Resume {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateResumeData {
  userId: string;
  title: string;
}

export interface UpdateResumeData {
  title?: string;
}

export interface ResumeRepository {
  create(data: CreateResumeData): Promise<Resume>;

  findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Resume | null>;

  findAllByUserId(
    userId: string,
  ): Promise<Resume[]>;

  update(
    id: string,
    userId: string,
    data: UpdateResumeData,
  ): Promise<Resume | null>;

  delete(
    id: string,
    userId: string,
  ): Promise<boolean>;
}
