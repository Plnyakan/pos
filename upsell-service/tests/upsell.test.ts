import request from 'supertest';
import startServer, { fastify } from '../src/index';
import Product from '../src/models/product';
import ProductUpsell from '../src/models/productUpsell';

jest.mock('../src/middlewares/authMiddleware', () => ({
    verifyToken: jest.fn((request, reply, done) => {
        request.user = { id: 1 }; 
        done();
    }),
}));

jest.mock('../src/models/product');
jest.mock('../src/models/productUpsell');

describe('Upsell Product Management', () => {
    beforeAll(async () => {
        if (!fastify.server.listening) {
            await startServer(); 
        }
        await fastify.ready(); 
    });

    afterAll(async () => {
        await fastify.close();
    });

    describe('Link Upsell Product', () => {
        it('should link an upsell product successfully', async () => {
            const mockProduct = { id: 1, name: 'Test Product' };
            const mockUpsellProduct = { id: 2, name: 'Upsell Product' };

            (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);
            (ProductUpsell.create as jest.Mock).mockResolvedValue(mockUpsellProduct);

            const response = await request(fastify.server)
                .post('/products/1/upsells/2')
                .set('Authorization', 'Bearer fake-token') 
                .send();
            
            console.log(response.body); 

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Upsell product linked successfully.');
        });

        it('should fail to link an upsell product if there is an error', async () => {
            (ProductUpsell.create as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Mocked error');
            });
            const response = await request(fastify.server)
                .post('/products/1/upsells/2')
                .set('Authorization', 'Bearer fake-token') 
                .send();
            
            console.log(response.body); 
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to link upsell product.');
        });
    });

});
