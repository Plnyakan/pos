import request from 'supertest';
import startServer, { fastify } from '../src/index';
import Product from '../src/models/product';
import Transaction from '../src/models/transaction';

jest.mock('../src/middlewares/authMiddleware', () => ({
    verifyToken: jest.fn((request, reply, done) => {
        request.user = { id: 1 }; 
        done();
    }),
}));

jest.mock('../src/models/product');
jest.mock('../src/models/transaction');

describe('Sales and Transactions', () => {
    beforeAll(async () => {
        if (!fastify.server.listening) {
            await startServer(); 
        }
        await fastify.ready(); 
    });

    afterAll(async () => {
        await fastify.close(); 
    });

    describe('Create Transaction', () => {
        it('should create a new transaction successfully', async () => {
            const products = [
                { product_id: 1, quantity: 2, upsell_product_ids: [2] },
                { product_id: 3, quantity: 1 }
            ];

            const mainProduct = { id: 1, price: 50 };
            const upsellProduct = { id: 2, price: 10 };
            const anotherProduct = { id: 3, price: 30 };

            (Product.findByPk as jest.Mock)
                .mockResolvedValueOnce(mainProduct)
                .mockResolvedValueOnce(upsellProduct)
                .mockResolvedValueOnce(anotherProduct);

            const transactionData = {
                id: 1,
                total_amount: 150,
                details: [
                    { product_id: 1, quantity: 2, amount: 100 },
                    { product_id: 2, quantity: 2, amount: 20 },
                    { product_id: 3, quantity: 1, amount: 30 }
                ]
            };

            (Transaction.create as jest.Mock).mockResolvedValue(transactionData);

            const response = await request(fastify.server)
                .post('/transactions')
                .send({ products });

            console.log('Create Transaction Response:', response.body); 

            expect(response.status).toBe(201);
            expect(response.body.total_amount).toBe(transactionData.total_amount);
        });

        it('should fail to create a transaction if a product is not found', async () => {
            const products = [
                { product_id: 1, quantity: 2, upsell_product_ids: [2] }
            ];

            (Product.findByPk as jest.Mock).mockResolvedValueOnce(null);

            const response = await request(fastify.server)
                .post('/transactions')
                .send({ products });

            console.log('Create Transaction Product Not Found Response:', response.body); 

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Product with id 1 not found.');
        });

        it('should fail to create a transaction if an upsell product is not found', async () => {
            const products = [
                { product_id: 1, quantity: 2, upsell_product_ids: [2] }
            ];

            const mainProduct = { id: 1, price: 50 };

            (Product.findByPk as jest.Mock)
                .mockResolvedValueOnce(mainProduct)
                .mockResolvedValueOnce(null);

            const response = await request(fastify.server)
                .post('/transactions')
                .send({ products });

            console.log('Create Transaction Upsell Product Not Found Response:', response.body); 

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Upsell product with id 2 not found.');
        });

        it('should fail to create a transaction if there is an error', async () => {
            const products = [
                { product_id: 1, quantity: 2, upsell_product_ids: [2] }
            ];

            const mainProduct = { id: 1, price: 50 };
            const upsellProduct = { id: 2, price: 10 };

            (Product.findByPk as jest.Mock)
                .mockResolvedValueOnce(mainProduct)
                .mockResolvedValueOnce(upsellProduct);

            (Transaction.create as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Mocked error');
            });

            const response = await request(fastify.server)
                .post('/transactions')
                .send({ products });

            console.log('Create Transaction Error Response:', response.body); 

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to create transaction.');
        });
    });
});
