import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Planet = sequelize.define('Planet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  uid: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  diameter: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  rotation_period: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  orbital_period: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  gravity: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  population: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  climate: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  terrain: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  surface_water: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  films: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  residents: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  tableName: 'planets',
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['uid']
    }
  ]
});

export default Planet;