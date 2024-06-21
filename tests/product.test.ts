import request from 'supertest';
import startServer, { fastify } from '../src/index';
import Product from '../src/models/product';

// Mock the auth middleware
jest.mock('../src/middlewares/authMiddleware', () => ({
    verifyToken: jest.fn((request, reply, done) => {
        request.user = { id: 1 }; // Mocked user object
        done();
    }),
}));

jest.mock('../src/models/product');

describe('Product Management', () => {
    beforeAll(async () => {
        if (!fastify.server.listening) {
            await startServer(); // Start the server if not already started
        }
        await fastify.ready(); // Ensure the server is ready
    });

    afterAll(async () => {
        await fastify.close(); // Close the server
    });

    describe('Create Product', () => {
        it('should create a product successfully', async () => {
            const productData = {
                product_name: 'Test Product',
                price: 100,
                description: 'Test Description',
                quantity: 10
            };

            // Mock the Product.create method to return the product data
            (Product.create as jest.Mock).mockResolvedValue(productData);

            const response = await request(fastify.server)
                .post('/products')
                .send(productData);

            console.log('Create Product Response:', response.body); // Debugging: log the response body

            expect(response.status).toBe(201);
            expect(response.body.product_name).toBe(productData.product_name);
        });

        it('should fail to create a product if there is an error', async () => {
            (Product.create as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Mocked error');
            });

            const productData = {
                product_name: 'Test Product',
                price: 100,
                description: 'Test Description',
                quantity: 10
            };

            const response = await request(fastify.server)
                .post('/products')
                .send(productData);

            console.log('Create Product Error Response:', response.body); // Debugging: log the response body

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to create product.');
        });
    });

    describe('Get Products', () => {
        it('should retrieve products successfully', async () => {
            const products = [
                { id: 1, product_name: 'Test Product 1', price: 100, description: 'Description 1', quantity: 10 },
                { id: 2, product_name: 'Test Product 2', price: 200, description: 'Description 2', quantity: 20 }
            ];

            // Mock the Product.findAll method to return the products array
            (Product.findAll as jest.Mock).mockResolvedValue(products);

            const response = await request(fastify.server)
                .get('/products')
                .send();

            console.log('Get Products Response:', response.body); // Debugging: log the response body

            expect(response.status).toBe(200);
            if (response.body.length > 0) {
                expect(response.body).toBeInstanceOf(Array);
                expect(response.body.length).toBe(products.length);
            } else {
                expect(response.body.msg).toBe("No product exists please add products.");
            }
        });

        it('should fail to retrieve products if there is an error', async () => {
            (Product.findAll as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Mocked error');
            });

            const response = await request(fastify.server)
                .get('/products')
                .send();

            console.log('Get Products Error Response:', response.body); // Debugging: log the response body

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to retrieve products.');
        });
    });

    describe('Update Product', () => {
        it('should update a product successfully', async () => {
            const productData = {
                product_name: 'Updated Product',
                price: 150,
                description: 'Updated Description',
                quantity: 15
            };

            const mockProduct = { 
                id: 1, 
                product_name: 'Old Product', 
                price: 100, 
                description: 'Old Description', 
                quantity: 10,
                save: jest.fn().mockResolvedValue(productData) // Mock save method to resolve with updated product
            };

            // Mock the Product.findByPk method to return a product
            (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

            const response = await request(fastify.server)
                .put('/products/1')
                .send(productData);

            console.log('Update Product Response:', response.body); // Debugging: log the response body

            expect(response.status).toBe(200);
            expect(response.body.product_name).toBe(productData.product_name);
        });

        it('should return 404 if the product is not found', async () => {
            // Mock the Product.findByPk method to return null (product not found)
            (Product.findByPk as jest.Mock).mockResolvedValue(null);

            const productData = {
                product_name: 'Updated Product',
                price: 150,
                description: 'Updated Description',
                quantity: 15
            };

            const response = await request(fastify.server)
                .put('/products/999')
                .send(productData);

            console.log('Update Product Not Found Response:', response.body); // Debugging: log the response body

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Product not found.');
        });

        it('should fail to update a product if there is an error', async () => {
            const productData = {
                product_name: 'Updated Product',
                price: 150,
                description: 'Updated Description',
                quantity: 15
            };

            const mockProduct = { 
                id: 1, 
                product_name: 'Old Product', 
                price: 100, 
                description: 'Old Description', 
                quantity: 10,
                save: jest.fn(() => {
                    throw new Error('Mocked error');
                }) // Mock save method to throw an error
            };

            // Mock the Product.findByPk method to return a product
            (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

            const response = await request(fastify.server)
                .put('/products/1')
                .send(productData);

            console.log('Update Product Error Response:', response.body); // Debugging: log the response body

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to update product.');
        });
    });

    describe('Delete Product', () => {
        it('should delete a product successfully', async () => {
            const mockProduct = { 
                id: 1, 
                name: 'Test Product', 
                destroy: jest.fn().mockResolvedValue(undefined) 
            };

            // Mock the Product.findByPk method to return a product
            (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

            const response = await request(fastify.server)
                .delete('/products/1')
                .set('Authorization', 'Bearer fake-token')
                .send();

            console.log('Delete Product Response:', response.body); // Debugging: log the response body

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Product deleted successfully.');
        });

        it('should return 404 if the product is not found', async () => {
            // Mock the Product.findByPk method to return null (product not found)
            (Product.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(fastify.server)
                .delete('/products/1')
                .set('Authorization', 'Bearer fake-token')
                .send();

            console.log('Delete Product Not Found Response:', response.body); // Debugging: log the response body

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Product not found.');
        });

        it('should fail to delete a product if there is an error', async () => {
            const mockProduct = { 
                id: 1, 
                name: 'Test Product', 
                destroy: jest.fn(() => {
                    throw new Error('Mocked error');
                }) // Mock destroy method to throw an error
            };

            // Mock the Product.findByPk method to return a product
            (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

            const response = await request(fastify.server)
                .delete('/products/1')
                .set('Authorization', 'Bearer fake-token')
                .send();

            console.log('Delete Product Error Response:', response.body); // Debugging: log the response body

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Failed to delete product.');
        });
    });

});
