export interface JWTPayload {
  id: string;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
}
