import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export const AuthGuard = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Token de acesso requerido'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Token inválido ou expirado'
      });
    }

    (req as any).user = user;
    next();
  });
};
