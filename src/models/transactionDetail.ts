import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import Product from './product';

class TransactionDetail extends Model {
    public transaction_detail_id!: number;
    public transaction_id!: number;
    public product_id!: number;
    public quantity!: number;
    public amount!: number;
}

TransactionDetail.init({
    transaction_detail_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'transactions',
            key: 'transaction_id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'product_id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'transaction_details',
    timestamps: false
});

TransactionDetail.belongsTo(Product, { foreignKey: 'product_id' });

export default TransactionDetail;
