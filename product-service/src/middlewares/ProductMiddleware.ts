

export const createProductSchema = {
    body: {
        type: 'object',
        required: ['product_name', 'price', 'description', 'quantity'],
        properties: {
            product_name: { type: 'string', minLength: 3 },
            price: { type: 'number', minimum: 0 },
            description: { type: 'string', minLength: 1 },
            quantity: { type: 'number', minimum: 0 },
        }
    }
};