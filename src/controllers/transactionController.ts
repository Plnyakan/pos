import { FastifyRequest, FastifyReply } from 'fastify';
import Transaction from '../models/transaction';
import Product from '../models/product';
import ProductUpsell from '../models/productUpsell';

export const createTransaction = async (request: FastifyRequest, reply: FastifyReply) => {
    const { products } = request.body as { products: Array<{ product_id: number; quantity: number; upsell_product_ids?: number[] }> };

    try {
        const transactionDetails = [];
        let totalAmount = 0;

        for (const item of products) {
            const { product_id, quantity, upsell_product_ids = [] } = item;

            const product = await Product.findByPk(product_id);
            if (!product) {
                return reply.status(404).send({ error: `Product with id ${product_id} not found.` });
            }

            const productAmount = product.price * quantity;
            totalAmount += productAmount;

            transactionDetails.push({ product_id, quantity, amount: productAmount });

            for (const upsellProductId of upsell_product_ids) {
                const upsellProduct = await Product.findByPk(upsellProductId);
                if (!upsellProduct) {
                    return reply.status(404).send({ error: `Upsell product with id ${upsellProductId} not found.` });
                }

                const upsellProductAmount = upsellProduct.price * quantity;
                totalAmount += upsellProductAmount;

                transactionDetails.push({ product_id: upsellProductId, quantity, amount: upsellProductAmount });
            }
        }


        const transaction = await Transaction.create({ total_amount: totalAmount, details: transactionDetails });

        reply.status(201).send(transaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        reply.status(500).send({ error: 'Failed to create transaction.' });
    }
};

export const getTransaction = async (request: FastifyRequest, reply: FastifyReply) => {
    const { transactionId } = request.params as { transactionId: string };

    try {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            return reply.status(404).send({ error: 'Transaction not found.' });
        }

        reply.send(transaction);
    } catch (error) {
        reply.status(500).send({ error: 'Failed to retrieve transaction.' });
    }
};