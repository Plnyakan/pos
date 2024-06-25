import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';

interface MyRequest extends FastifyRequest {
    user?: any; 
}

export const verifyToken = (request: MyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {

    request.user = { id: 1 }; 
    done();
};
