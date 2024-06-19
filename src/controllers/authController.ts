// @ts-ignore
import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export const signUp = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({ email, password: hashedPassword });
        reply.status(201).send("User:"+ user.email+ " has been created successfully");
    } catch (error) {
        reply.status(500).send({ error: 'Email already exists.' });
    }
};

export const logIn = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return reply.status(401).send({ error: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return reply.status(401).send({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    reply.send({ token });
};
