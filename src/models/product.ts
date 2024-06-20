import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

class Product extends Model {
    public product_id!: number;
    public product_name!: string;
    public price!: number;
    public description!: string;
    public quantity!: number;
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

export default Product;
