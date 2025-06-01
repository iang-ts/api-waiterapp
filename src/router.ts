import path from 'node:path';

import { Router } from 'express';
import multer from 'multer';

import { deleteProduct } from '../src/app/useCases/products/deleteProduct';
import { AuthGuard } from './app/auth/AuthGuard';
import { createAccount } from './app/useCases/Account/createAccount';
import { loginAccount } from './app/useCases/Account/loginAccount';
import { createCategory } from './app/useCases/categories/createCategory';
import { deleteCategory } from './app/useCases/categories/deleteCategory';
import { listCategories } from './app/useCases/categories/listCategories';
import { listProductsByCategory } from './app/useCases/categories/listProductsByCategory';
import { cancelOrder } from './app/useCases/orders/cancelOrder';
import { changeOrderStatus } from './app/useCases/orders/changeOrderStatus';
import { createOrder } from './app/useCases/orders/createOrders';
import { listOrders } from './app/useCases/orders/listOrders';
import { createProduct } from './app/useCases/products/createProduct';
import { listProducts } from './app/useCases/products/listProducts';


export const router = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, path.resolve(__dirname, '..', 'uploads'));
    },
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

router.post('/accounts/signup', createAccount);
router.post('/accounts/signin', loginAccount);

router.get('/categories', AuthGuard, listCategories);

router.post('/categories', AuthGuard, createCategory);

router.delete('/categories/:categoryId', AuthGuard, deleteCategory);

router.get('/products', AuthGuard, listProducts);

router.post('/products', AuthGuard, upload.single('image'), createProduct);

router.delete('/products/:productId',AuthGuard, deleteProduct);

router.get('/categories/:categoryId/products' , AuthGuard, listProductsByCategory);


router.get('/orders', listOrders);

router.post('/orders', AuthGuard, createOrder);

router.patch('/orders/:orderId', changeOrderStatus);

router.delete('/orders/:orderId', cancelOrder);
