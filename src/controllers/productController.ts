import { FastifyRequest, FastifyReply } from 'fastify';
import Product from '../models/product';

export const createProduct = async (request: FastifyRequest, reply: FastifyReply) => {
    const { product_name, price, description, quantity } = request.body as { product_name: string; price: number; description: string; quantity: number };
    try {
        const product = await Product.create({ product_name, price, description, quantity });
        reply.status(201).send(product);
    } catch (error) {
        reply.status(500).send({ error: 'Failed to create product.' });
    }
};

export const getProducts = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const products = await Product.findAll();

        if(products.length > 0) {
            reply.send(products);
        } else {
            reply.send({msg : "No product exists please add products." });
        }
        
    } catch (error) {
        reply.status(500).send({ error: 'Failed to retrieve products.' });
    }
};

export const updateProduct = async (request: FastifyRequest, reply: FastifyReply) => {
    const { productId } = request.params as { productId: string };
    const { product_name, price, description, quantity } = request.body as { product_name: string; price: number; description: string; quantity: number };
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return reply.status(404).send({ error: 'Product not found.' });
        }

        product.product_name = product_name;
        product.price = price;
        product.description = description;
        product.quantity = quantity;
        await product.save();

        reply.send(product);
    } catch (error) {
        reply.status(500).send({ error: 'Failed to update product.' });
    }
};

export const deleteProduct = async (request: FastifyRequest, reply: FastifyReply) => {
    const { productId } = request.params as { productId: string };
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return reply.status(404).send({ error: 'Product not found.' });
        }

        await product.destroy();
        reply.send({ message: 'Product deleted successfully.' });
    } catch (error) {
        reply.status(500).send({ error: 'Failed to delete product.' });
    }
};
