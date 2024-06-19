import { FastifyInstance } from 'fastify';
import { signUp, logIn , verifyEmail} from '../controllers/authController';

export default async function (fastify: FastifyInstance) {
    fastify.post('/signup', signUp);
    fastify.post('/login', logIn);
    fastify.get('/verify/:token', verifyEmail)
}
