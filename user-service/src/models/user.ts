import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

class User extends Model {
    public id!: number;
    public email!: string;
    public password!: string;
    public isVerified!: boolean;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false 
    }
}, {
    sequelize,
    tableName: 'users',
    timestamps: false
});

export default User;
