	export interface TokenPayload {
  sub: string;
  email: string;
}

export interface TokenSigner {
  signAccessToken(payload: TokenPayload): Promise<string>;
}
