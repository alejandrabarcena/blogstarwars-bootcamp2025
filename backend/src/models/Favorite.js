import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import User from './User.js';

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  entityType: {
    type: DataTypes.ENUM('people', 'planets', 'starships', 'vehicles'),
    allowNull: false
  },
  entityUid: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  entityName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  entityData: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'favorites',
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['entityType']
    },
    {
      unique: true,
      fields: ['userId', 'entityType', 'entityUid']
    }
  ]
});

// Associations
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Favorite;