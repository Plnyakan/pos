import { FastifyInstance } from 'fastify';
import { createTransaction, getTransaction } from '../controllers/transactionController';
import { verifyToken } from '../middlewares/authMiddleware';

export default async function (fastify: FastifyInstance) {
    fastify.post('/transactions', { preHandler: [verifyToken] }, createTransaction);
    fastify.get('/transactions/:transactionId', getTransaction);
}
