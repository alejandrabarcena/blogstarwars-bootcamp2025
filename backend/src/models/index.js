// Import all models
import User from './User.js';
import Character from './Character.js';
import Planet from './Planet.js';
import Starship from './Starship.js';
import Vehicle from './Vehicle.js';
import Favorite from './Favorite.js';

// Define associations
const defineAssociations = () => {
  // User - Favorites associations are already defined in Favorite.js
  
  // You can add more associations here as needed
  // For example, if you want to track which user created/updated entities:
  
  // User.hasMany(Character, { foreignKey: 'createdBy', as: 'createdCharacters' });
  // Character.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
  
  console.log('📊 Model associations defined');
};

// Initialize associations
defineAssociations();

// Export all models
export {
  User,
  Character,
  Planet,
  Starship,
  Vehicle,
  Favorite
};

// Export default object with all models
export default {
  User,
  Character,
  Planet,
  Starship,
  Vehicle,
  Favorite
};