import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Starship = sequelize.define('Starship', {
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
  model: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  starship_class: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  manufacturer: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  cost_in_credits: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  length: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  crew: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  passengers: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  max_atmosphering_speed: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  hyperdrive_rating: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  MGLT: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  cargo_capacity: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  consumables: {
    type: DataTypes.STRING(100),
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
  pilots: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  tableName: 'starships',
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['uid']
    }
  ]
});

export default Starship;