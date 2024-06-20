import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

class Product extends Model {
    public product_id!: number;
    public product_name!: string;
    public price!: number;
    public description!: string;
    public quantity!: number;
    public upsells!: number;

    public static associate() {
        Product.belongsToMany(Product, {
            as: 'upsells',
            through: 'ProductUpsells',
            foreignKey: 'product_id',
            otherKey: 'upsell_product_id'
        });
    }
}

Product.init({
    product_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'products',
    timestamps: false
});

Product.associate();

export default Product;
