import { FastifyRequest, FastifyReply } from "fastify";
import Transaction from "../models/transaction";
import Product from "../models/product";
import ProductUpsell from "../models/productUpsell";
import TransactionDetail from "../models/transactionDetail";

// Function should also reduce the quantity of product being sold in a transation
// This also include the quantity of upsell products

export const createTransaction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { products } = request.body as {
    products: Array<{
      product_id: number;
      quantity: number;
      upsell_product_ids?: number[];
    }>;
  };

  try {
    const transactionDetails = [];
    let totalAmount = 0;

    console.log("products", products);

    for (const item of products) {
      const { product_id, quantity, upsell_product_ids = [] } = item;

      const product = await Product.findByPk(product_id);
      if (!product) {
        return reply
          .status(404)
          .send({ error: `Product with id ${product_id} not found.` });
      }

      if (product.quantity < quantity) {
        return reply
          .status(400)
          .send({
            error: `Insufficient stock for product with id ${product_id}.`,
          });
      }

      product.quantity -= quantity;
      await product.save();

      const productAmount = product.price * quantity;
      totalAmount += productAmount;

      transactionDetails.push({ product_id, quantity, amount: productAmount });

      for (const upsellProductId of upsell_product_ids) {
        const upsellProduct = await Product.findByPk(upsellProductId);
        if (!upsellProduct) {
          return reply
            .status(404)
            .send({
              error: `Upsell product with id ${upsellProductId} not found.`,
            });
        }

        if (upsellProduct.quantity < quantity) {
          return reply
            .status(400)
            .send({
              error: `Insufficient stock for upsell product with id ${upsellProductId}.`,
            });
        }

        upsellProduct.quantity -= quantity;
        await upsellProduct.save();

        const upsellProductAmount = upsellProduct.price * quantity;
        totalAmount += upsellProductAmount;

        transactionDetails.push({
          product_id: upsellProductId,
          quantity,
          amount: upsellProductAmount,
        });
      }
    }

    const transaction = await Transaction.create({ total_amount: totalAmount });

    for (const detail of transactionDetails) {
      await TransactionDetail.create({
        transaction_id: transaction.transaction_id,
        ...detail,
      });
    }

    reply.status(201).send(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    reply.status(500).send({ error: "Failed to create transaction." });
  }
};

// Function should return more details about the transations and products
export const getTransaction = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { transactionId } = request.params as { transactionId: string };

  try {
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction) {
      return reply.status(404).send({ error: "Transaction not found." });
    }

    reply.send(transaction);
  } catch (error) {
    reply.status(500).send({ error: "Failed to retrieve transaction." });
  }
};
