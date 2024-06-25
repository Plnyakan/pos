import { FastifyRequest, FastifyReply } from 'fastify';
import ProductUpsell from '../models/productUpsell';
import Product from '../models/product';
import { sendToQueue } from '../utils/messageQueue';



export const linkUpsellProduct = async (request: FastifyRequest, reply: FastifyReply) => {
    const { productId, upsellProductId } = request.params as { productId: string; upsellProductId: string };

    if (!productId || !upsellProductId) {
        console.error('Invalid request parameters:', request.params);
        return reply.status(400).send({ error: 'Invalid request parameters.' });
    }

    try {
        // Find the main product
        const product = await Product.findByPk(productId);
        if (!product) {
            console.error(`Product not found: ${productId}`);
            return reply.status(404).send({ error: 'Product not found.' });
        }

        // Find the upsell product
        const upsellProduct = await Product.findByPk(upsellProductId);
        if (!upsellProduct) {
            console.error(`Upsell product not found: ${upsellProductId}`);
            return reply.status(404).send({ error: 'Upsell product not found.' });
        }

        await ProductUpsell.create({ product_id: productId, upsell_product_id: upsellProductId });

        // Send a message to the queue
        await sendToQueue('upsell-queue', { type: 'UPSELL_PRODUCT_LINKED', data: { productId, upsellProductId } });
 

        reply.status(201).send({ message: 'Upsell product linked successfully.' });
    } catch (error) {
        reply.status(500).send({ error: 'Failed to link upsell product.' });
    }
};


export const getUpsellProducts = async (request: FastifyRequest, reply: FastifyReply) => {
    const { productId } = request.params as { productId: string };

    try {
        const product = await Product.findByPk(productId, {
            include: { model: Product, as: 'upsells', through: { attributes: [] } }
        });

        if (!product) {
            return reply.status(404).send({ error: 'Product not found.' });
        }

        reply.send(product.upsells);
    } catch (error) {
        reply.status(500).send({ error: 'Failed to retrieve upsell products.' });
    }
};

export const removeUpsellProduct = async (request: FastifyRequest, reply: FastifyReply) => {
    const { productId, upsellProductId } = request.params as { productId: string; upsellProductId: string };

    try {
        const result = await ProductUpsell.destroy({
            where: { product_id: parseInt(productId), upsell_product_id: parseInt(upsellProductId) }
        });

        if (result === 0) {
            return reply.status(404).send({ error: 'Upsell product not found.' });
        }
        
        await sendToQueue('upsell-queue', { type: 'UPSELL_PRODUCT_REMOVED', data: { productId, upsellProductId } });

        reply.send({ message: 'Upsell product removed successfully.' });
    } catch (error) {
        reply.status(500).send({ error: 'Failed to remove upsell product.' });
    }
};
