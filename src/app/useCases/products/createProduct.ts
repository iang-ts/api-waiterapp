import { Request, Response } from 'express';

import { Product } from '../../models/Product';
import { getUser } from '../../shared/utils/getUser';

export async function createProduct(req: Request, res: Response) {
  try {
    const user = await getUser(req);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const imagePath = req.file?.filename;
    const { name, description, price, category, ingredients } = req.body;

    const priceInCents = Math.round(Number(price) * 100);

    const product = await Product.create({
      name,
      description,
      imagePath,
      price: priceInCents,
      category,
      account: user.id,
      ingredients: ingredients ? JSON.parse(ingredients) : [],
    });

    res.status(201).json(product);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
