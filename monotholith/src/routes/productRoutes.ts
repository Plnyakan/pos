import { FastifyInstance } from 'fastify';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../controllers/productController';
import { verifyToken } from '../middlewares/authMiddleware';
import { createProductSchema } from '../middlewares/ProductMiddleware';

export default async function (fastify: FastifyInstance) {

    const productRouteOptions = {
        preHandler: [verifyToken],
        schema: createProductSchema
    };

    fastify.post('/products', productRouteOptions, createProduct);
    fastify.get('/products', getProducts);
    fastify.put('/products/:productId', { preHandler: [verifyToken] }, updateProduct);
    fastify.delete('/products/:productId', { preHandler: [verifyToken] }, deleteProduct);
}
