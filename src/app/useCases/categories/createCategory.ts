import { Request, Response } from 'express';

import { Category } from '../../models/Category';
import { getUser } from '../../shared/utils/getUser';

export async function createCategory(req: Request, res: Response) {
  try {
    const user = await getUser(req) ;

    if (!user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { icon, name } = req.body;
    const category = await Category.create({ icon, name, account: user.id });

    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
