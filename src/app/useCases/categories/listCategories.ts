import { Request, Response } from 'express';

import { Category } from '../../models/Category';
import { getUser } from '../../shared/utils/getUser';

export async function listCategories(req: Request, res: Response) {
  try {
    const user = await getUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const categories = await Category.find({
      account: user?.id,
    });

    res.json(categories);

  } catch (error) {
    console.log(error);

    res.sendStatus(500);
  }
}
