export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCredentials {
  id: string;
  email: string;
  passwordHash: string | null;
}

export interface CreateUserData {
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  findCredentialsByEmail(
    email: string,
  ): Promise<UserCredentials | null>;

  create(data: CreateUserData): Promise<User>;
}
