export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  id: string;
  email: string;
  accessToken: string;
  tokenType: 'Bearer';
}
