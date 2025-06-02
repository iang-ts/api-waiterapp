import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Account } from '../../models/Account';
import { JWTPayload } from '../../types/jwtPayload';

export async function createAccount(req: Request, res: Response) {
  try {
    const { name, email, password, document, logo } = req.body;

    const existingEmail = await Account.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    const existingDocument = await Account.findOne({ document });
    if (existingDocument) {
      return res.status(400).json({ error: 'Documento já está em uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const account = await Account.create({
      name,
      email,
      password: hashedPassword,
      document,
      logo
    });

    const tokenPayload: JWTPayload = {
      id: account._id.toString(),
      name: account.name,
      email: account.email
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d'
      }
    );

    res.status(201).json({
      accessToken: token,
      message: 'Conta criada com sucesso'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
