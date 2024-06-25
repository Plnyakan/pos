import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';

interface User {
    id: number;
}

interface MyRequest extends FastifyRequest {
    user?: User; 
}

export const verifyToken = (request: MyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {

    request.user = { id: 1 }; 
    done();
};
