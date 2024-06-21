// import request from 'supertest';
// import startServer, { fastify } from '../src/index';
// import Product from '../src/models/product';
// import ProductUpsell from '../src/models/productUpsell';


// jest.mock('../src/middlewares/authMiddleware', () => ({
//     verifyToken: jest.fn((request, reply, done) => {
//         request.user = { id: 1 }; 
//         done();
//     }),
// }));


// jest.mock('../src/models/product');
// jest.mock('../src/models/productUpsell');

// describe('Upsell Product Management', () => {
//     beforeAll(async () => {
//         if (!fastify.server.listening) {
//             await startServer(); 
//         }
//         await fastify.ready(); 
//     });

//     afterAll(async () => {
//         await fastify.close(); 
//     });

//     describe('Link Upsell Product', () => {
//         it('should link an upsell product successfully', async () => {
//             const response = await request(fastify.server)
//                 .post('/products/1/upsells/2')
//                 .set('Authorization', 'Bearer fake-token') 
//                 .send();
//             expect(response.status).toBe(201);
//             expect(response.body.message).toBe('Upsell product linked successfully.');
//         });

//         it('should fail to link an upsell product if there is an error', async () => {
//             jest.spyOn(ProductUpsell, 'create').mockImplementationOnce(() => {
//                 throw new Error('Mocked error');
//             });
//             const response = await request(fastify.server)
//                 .post('/products/1/upsells/2')
//                 .set('Authorization', 'Bearer fake-token') 
//                 .send();
//             expect(response.status).toBe(500);
//             expect(response.body.error).toBe('Failed to link upsell product.');
//         });
//     });

//     describe('Get Upsell Products', () => {
//         it('should retrieve upsell products successfully', async () => {
//             const response = await request(fastify.server)
//                 .get('/products/1/upsells')
//                 // .set('Authorization', 'Bearer fake-token') 
//                 .send();
//             expect(response.status).toBe(200);
//             expect(response.body).toBeInstanceOf(Array);
//         });

//         it('should return 404 if the product is not found', async () => {
//             jest.spyOn(Product, 'findByPk').mockResolvedValueOnce(null);
//             const response = await request(fastify.server)
//                 .get('/products/999/upsells')
//                 // .set('Authorization', 'Bearer fake-token') 
//                 .send();
//             expect(response.status).toBe(404);
//             expect(response.body.error).toBe('Product not found.');
//         });

//         it('should fail to retrieve upsell products if there is an error', async () => {
//             jest.spyOn(Product, 'findByPk').mockImplementationOnce(() => {
//                 throw new Error('Mocked error');
//             });
//             const response = await request(fastify.server)
//                 .get('/products/1/upsells')
//                 // .set('Authorization', 'Bearer fake-token') 
//                 .send();
//             expect(response.status).toBe(500);
//             expect(response.body.error).toBe('Failed to retrieve upsell products.');
//         });
//     });

//     describe('Remove Upsell Product', () => {
//         it('should remove an upsell product successfully', async () => {
//             const response = await request(fastify.server)
//                 .delete('/products/1/upsells/2')
//                 .set('Authorization', 'Bearer fake-token') 
//                 .send();
//             expect(response.status).toBe(200);
//             expect(response.body.message).toBe('Upsell product removed successfully.');
//         });

//         it('should return 404 if the upsell product is not found', async () => {
//             jest.spyOn(ProductUpsell, 'destroy').mockResolvedValueOnce(0);
//             const response = await request(fastify.server)
//                 .delete('/products/1/upsells/2')
//                 .set('Authorization', 'Bearer fake-token') 
//                 .send();
//             expect(response.status).toBe(404);
//             expect(response.body.error).toBe('Upsell product not found.');
//         });

//         it('should fail to remove an upsell product if there is an error', async () => {
//             jest.spyOn(ProductUpsell, 'destroy').mockImplementationOnce(() => {
//                 throw new Error('Mocked error');
//             });
//             const response = await request(fastify.server)
//                 .delete('/products/1/upsells/2')
//                 .set('Authorization', 'Bearer fake-token') 
//                 .send();
//             expect(response.status).toBe(500);
//             expect(response.body.error).toBe('Failed to remove upsell product.');
//         });
//     });
// });


import request from 'supertest';
import startServer, { fastify } from '../src/index';
import Product from '../src/models/product';
import ProductUpsell from '../src/models/productUpsell';

// Mock the auth middleware
jest.mock('../src/middlewares/authMiddleware', () => ({
    verifyToken: jest.fn((request, reply, done) => {
        request.user = { id: 1 }; // Mocked user object
        done();
    }),
}));

jest.mock('../src/models/product');
jest.mock('../src/models/productUpsell');

describe('Upsell Product Management', () => {
    beforeAll(async () => {
        if (!fastify.server.listening) {
            await startServer(); // Start the server if not already started
        }
        await fastify.ready(); // Ensure the server is ready
    });

    afterAll(async () => {
        await fastify.close(); // Close the server
    });

    describe('Link Upsell Product', () => {
        it('should link an upsell product successfully', async () => {
            const mockProduct = { id: 1, name: 'Test Product' };
            const mockUpsellProduct = { id: 2, name: 'Upsell Product' };

            (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);
            (ProductUpsell.create as jest.Mock).mockResolvedValue(mockUpsellProduct);

            const response = await request(fastify.server)
                .post('/products/1/upsells/2')
                .set('Authorization', 'Bearer fake-token') // Mock token
                .send();
            
            console.log(response.body); // Debugging: log the response body

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Upsell product linked successfully.');
        });

        it('should fail to link an upsell product if there is an error', async () => {
            (ProductUpsell.create as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Mocked error');
            });
            const response = await request(fastify.server)
                .post('/products/1/upsells/2')
                .set('Authorization', 'Bearer fake-token') // Mock token
                .send();
            
            console.log(response.body); // Debugging: log the response body

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to link upsell product.');
        });
    });

    // Other tests...
});
