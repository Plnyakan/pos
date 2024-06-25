import { FastifyInstance } from 'fastify';
import { linkUpsellProduct, getUpsellProducts, removeUpsellProduct } from '../controllers/upsellController';
import { verifyToken } from '../middlewares/authMiddleware';

export default async function (fastify: FastifyInstance) {
    fastify.post('/products/:productId/upsells/:upsellProductId', { preHandler: [verifyToken] }, linkUpsellProduct);
    fastify.get('/products/:productId/upsells', getUpsellProducts);
    fastify.delete('/products/:productId/upsells/:upsellProductId', { preHandler: [verifyToken] }, removeUpsellProduct);
}
