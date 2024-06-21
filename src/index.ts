import Fastify from 'fastify';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import upsellRoutes from './routes/upsellRoutes';
import transactionRoutes from './routes/transactionRoutes';
import sequelize from './models'; 

const PORT = Number(process.env.PORT) || 3000;

export const fastify = Fastify({ logger: true, maxParamLength: 1000 });

async function startServer() {

    fastify.register(authRoutes);
    fastify.register(productRoutes);
    fastify.register(upsellRoutes);
    fastify.register(transactionRoutes);

    try {
        await sequelize.sync(); 
        await fastify.listen(PORT, '0.0.0.0');
        console.log(`Server listening at PORT:${PORT}`);
    } catch (err) {
        console.error('Error starting server:', err);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
    }

 
    const shutdown = async () => {
        console.log('Received shutdown signal, closing server...');
        try {
            await fastify.close();
            console.log('Server closed gracefully');
            process.exit(0); 
        } catch (err) {
            console.error('Error during server shutdown:', err);
            process.exit(1); 
        }
    };

    process.on('SIGINT', shutdown); 
    process.on('SIGTERM', shutdown); 
}

if (process.env.NODE_ENV !== 'test') {
    startServer();
}

export default startServer;
