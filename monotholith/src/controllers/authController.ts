// @ts-ignore
import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import User from '../models/user';
import { sendVerificationEmail } from '../services/emailService'; 


// user account creating and login
export const signUp = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };

    if (!validator.isEmail(email)) {
        return reply.status(400).send({ error: 'Invalid email format.' });
    }

    if (password.length < 8) {
        return reply.status(400).send({ error: 'Password must be at least 8 characters long.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    try {
        const user = await User.create({ email, password: hashedPassword, isVerified: false });

        console.log('verification token',verificationToken)

        await sendVerificationEmail(email, verificationToken);

        reply.status(201).send(`User ${user.email} has been created successfully. Please verify your email.`);
    } catch (error:any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return reply.status(400).send({ error: 'Email already exists.' });
        }
        reply.status(500).send({ error: 'Something went wrong.' });
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

// verifying email address 
export const verifyEmail = async (request: FastifyRequest, reply: FastifyReply) => {
    const { token } = request.params as { token: string };

    try {
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
        console.log('token', decodedToken);

        const user = await User.findOne({ where: { email: decodedToken.email } });
        console.log('user', user);
        if (!user) {

            return reply.status(404).send({ error: 'User not found.' });
        }

        user.isVerified = true;
        await user.save();

        reply.send({ message: 'Email verified successfully.' });
    } catch (error) {
        reply.status(401).send({ error: 'Invalid or expired token.' });
    }
};
