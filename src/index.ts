import Fastify from 'fastify';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';

import sequelize from './models';

const fastify = Fastify({ logger: true, maxParamLength: 1000 });

// Register routes
fastify.register(authRoutes);
fastify.register(productRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    fastify.listen(PORT, '0.0.0.0',(err, address) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
        fastify.log.info(`Server listening at ${address}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
