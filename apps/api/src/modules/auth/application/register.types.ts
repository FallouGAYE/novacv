export interface RegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterResult {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}
