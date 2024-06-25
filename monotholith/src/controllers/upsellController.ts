import { FastifyRequest, FastifyReply } from 'fastify';
import ProductUpsell from '../models/productUpsell';
import Product from '../models/product';


export const linkUpsellProduct = async (request: FastifyRequest, reply: FastifyReply) => {
    const { productId, upsellProductId } = request.params as { productId: string; upsellProductId: string };
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return reply.status(404).send({ error: 'Product not found.' });
        }

        const upsellProduct = await Product.findByPk(upsellProductId);
        if (!upsellProduct) {
            return reply.status(404).send({ error: 'Upsell product not found.' });
        }

        await ProductUpsell.create({ product_id: productId, upsell_product_id: upsellProductId });
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

        reply.send({ message: 'Upsell product removed successfully.' });
    } catch (error) {
        reply.status(500).send({ error: 'Failed to remove upsell product.' });
    }
};
