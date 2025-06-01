import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Account } from '../../models/Account';
import { JWTPayload } from '../../types/jwtPayload';

export async function loginAccount(req: Request, res: Response) {
  try {
    const { document, password } = req.body;

    const accountExists = await Account.findOne({ document });
    if (!accountExists) {
      return res.status(400).json({ error: 'Invalid credentials!' });
    }

    const isPasswordValid = await bcrypt.compare(password, accountExists.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials!' });
    }

    const account = accountExists.toObject();

    const tokenPayload: JWTPayload = {
      id: account._id.toString(),
      name: account.name,
      email: account.email
    };
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET as string, {
        expiresIn: '7d',
      });

    res.status(201).json({
      accessToken: token,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
