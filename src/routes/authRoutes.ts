import { FastifyInstance } from 'fastify';
import { signUp, logIn } from '../controllers/authController';

export default async function (fastify: FastifyInstance) {
    fastify.post('/signup', signUp);
    fastify.post('/login', logIn);
}
