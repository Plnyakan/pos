import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

class Transaction extends Model {
    public transaction_id!: number;
    public product_id!: number;
    public quantity!: number;
    public total_amount!: number;
}

Transaction.init({
    transaction_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'transactions',
    timestamps: false
});

export default Transaction;
