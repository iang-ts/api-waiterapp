import { Request, Response } from 'express';

import { Product } from '../../models/Product';
import { getUser } from '../../shared/utils/getUser';


export async function listProducts(req: Request, res: Response) {
  try {
    const user = await getUser(req);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const products = await Product.find({
      account: user.id,
    });

    res.json(products);

  } catch (error) {
    console.log(error);

    res.sendStatus(500);
  }
}
