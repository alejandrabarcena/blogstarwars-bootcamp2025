import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Character = sequelize.define('Character', {
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
  height: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  mass: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  hair_color: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  skin_color: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  eye_color: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  birth_year: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  homeworld: {
    type: DataTypes.STRING(255),
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
  species: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  vehicles: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  starships: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  tableName: 'characters',
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['uid']
    }
  ]
});

export default Character;