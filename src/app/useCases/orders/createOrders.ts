import { Request, Response } from 'express';

import { io } from '../../..';
import { Order } from '../../models/Order';
import { Product } from '../../models/Product';
import { getUser } from '../../shared/utils/getUser';

export async function createOrder(req: Request, res: Response) {
  try {
    const user = await getUser(req);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { products, orderNumber, paymentMethod, customerInfo } = req.body;

    let totalAmountInCents = 0;
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ error: `Produto ${item.product} não encontrado` });
      }
      totalAmountInCents += product.price * item.quantity;
    }

    const order = await Order.create({
      products,
      account: user.id,
      orderNumber,
      totalAmount: totalAmountInCents,
      paymentMethod,
      customerInfo
    });

    const orderDetails = await order.populate('products.product');

    io.emit('orders@new', orderDetails);
    res.status(201).json(order);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
