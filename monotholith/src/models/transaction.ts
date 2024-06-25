import { DataTypes, Model, Association } from 'sequelize';
import sequelize from './index';
import TransactionDetail from './transactionDetail';

class Transaction extends Model {
    [x: string]: any;
    public transaction_id!: number;
    public total_amount!: number;

    public static associations: {
        details: Association<Transaction, TransactionDetail>;
    };
}

Transaction.init({
    transaction_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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

Transaction.hasMany(TransactionDetail, {
    sourceKey: 'transaction_id',
    foreignKey: 'transaction_id',
    as: 'details'
});

TransactionDetail.belongsTo(Transaction, {
    foreignKey: 'transaction_id',
    as: 'transaction'
});

export default Transaction;
