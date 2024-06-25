import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import Product from './product';

class ProductUpsell extends Model {
    public product_id!: number;
    public upsell_product_id!: number;
}

ProductUpsell.init({
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Product,
            key: 'product_id'
        }
    },
    upsell_product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Product,
            key: 'product_id'
        }
    }
}, {
    sequelize,
    tableName: 'ProductUpsells',
    timestamps: false
});

export default ProductUpsell;
