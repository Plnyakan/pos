import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

interface MyRequest extends FastifyRequest {
    user?: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
}


export const verifyToken = async (request: MyRequest, reply: FastifyReply) => {
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
        return reply.status(401).send({ error: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        request.user = decoded; 
        return;
    } catch (error) {
        return reply.status(401).send({ error: 'Unauthorized.' });
    }
};
