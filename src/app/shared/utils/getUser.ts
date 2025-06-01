import type { Request } from 'express';
import type { JWTPayload } from '../../types/jwtPayload';

export async function getUser(req: Request): Promise<JWTPayload> {
  try {
    const user = (req as any).user as JWTPayload;

    return user;
  } catch (error) {
    console.error('Error retrieving user from request:', error);
    throw new Error('User not found');
  }
}
