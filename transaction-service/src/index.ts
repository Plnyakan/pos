import Fastify from 'fastify';
import transactionRoutes from './routes/transactionRoutes';
import sequelize from './models'; 
import './consul'; 
import { receiveFromQueue } from './utils/messageQueue';
import { handleNewTransaction } from './utils/messageHandlers';

const PORT = Number(process.env.PORT) || 3004;

export const fastify = Fastify({ logger: true, maxParamLength: 1000 });

// start server
async function startServer() {

    // Registering routes
    fastify.register(transactionRoutes);

    try {
        await sequelize.sync(); 
        await fastify.listen(PORT, '0.0.0.0');
        console.log(`Server listening at PORT:${PORT}`);

        // Set up the message consumer
        receiveFromQueue('user-queue', handleNewTransaction);
    } catch (err) {
        console.error('Error starting server:', err);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
    }

    
    // shutting down the server
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
