import { Request, Response } from 'express';

import { Category } from '../../models/Category';
import { getUser } from '../../shared/utils/getUser';

export async function deleteCategory(req: Request, res: Response) {
  try{
    const user = await getUser(req);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ error: 'ID da categoria não fornecido' });
    }

    const category = await Category.findOne({
      _id: categoryId,
      account: user.id
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    await Category.findByIdAndDelete(categoryId);

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
