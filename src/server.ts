import Fastify from 'fastify';
import authRoutes from './routes/authRoutes';

import sequelize from './models';

const fastify = Fastify({ logger: true });

// Register routes
fastify.register(authRoutes);

sequelize.sync().then(() => {
    fastify.listen(3000, (err, address) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
        fastify.log.info(`Server listening at ${address}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
