import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'starwars_blog',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

// Test database connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Sync models in development
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('📊 Database models synchronized');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export default sequelize;