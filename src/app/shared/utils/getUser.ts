import { Request } from 'express';
import { Account } from '../../models/Account';
import { JWTPayload } from '../../types/jwtPayload';

export async function getUser(req: Request): Promise<JWTPayload> {
  try {
    const user = (req as any).user as JWTPayload;

    const account = await Account.findById(user.id);
    if (!account) {
      throw new Error('Account not found');
    }
    return {
      email: account.email,
      id: account._id.toString(),
      name: account.name,
    };
  } catch (error) {
    console.error('Error retrieving user from request:', error);
    throw new Error('User not found');
  }
}
