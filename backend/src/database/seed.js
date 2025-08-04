import { User, Character, Planet, Starship, Vehicle } from '../models/index.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Sample data
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@starwars.com',
    password: 'Admin123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    username: 'luke_skywalker',
    email: 'luke@rebellion.com',
    password: 'Force123!',
    firstName: 'Luke',
    lastName: 'Skywalker',
    role: 'user'
  }
];

const sampleCharacters = [
  {
    uid: '1',
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    homeworld: 'Tatooine',
    description: 'A young farm boy who becomes a Jedi Knight and helps destroy the Death Star.'
  },
  {
    uid: '2',
    name: 'C-3PO',
    height: '167',
    mass: '75',
    hair_color: 'n/a',
    skin_color: 'gold',
    eye_color: 'yellow',
    birth_year: '112BBY',
    gender: 'n/a',
    homeworld: 'Tatooine',
    description: 'A protocol droid fluent in over six million forms of communication.'
  }
];

const samplePlanets = [
  {
    uid: '1',
    name: 'Tatooine',
    diameter: '10465',
    rotation_period: '23',
    orbital_period: '304',
    gravity: '1 standard',
    population: '200000',
    climate: 'arid',
    terrain: 'desert',
    surface_water: '1',
    description: 'A desert planet in the Outer Rim, home to Luke Skywalker.'
  },
  {
    uid: '2',
    name: 'Alderaan',
    diameter: '12500',
    rotation_period: '24',
    orbital_period: '364',
    gravity: '1 standard',
    population: '2000000000',
    climate: 'temperate',
    terrain: 'grasslands, mountains',
    surface_water: '40',
    description: 'A peaceful planet destroyed by the Death Star.'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.destroy({ where: {} });
    await Character.destroy({ where: {} });
    await Planet.destroy({ where: {} });
    await Starship.destroy({ where: {} });
    await Vehicle.destroy({ where: {} });

    // Seed users
    console.log('👥 Seeding users...');
    for (const userData of sampleUsers) {
      await User.create(userData);
    }

    // Seed characters
    console.log('🧑‍🚀 Seeding characters...');
    for (const characterData of sampleCharacters) {
      await Character.create(characterData);
    }

    // Seed planets
    console.log('🌍 Seeding planets...');
    for (const planetData of samplePlanets) {
      await Planet.create(planetData);
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Sample data created:');
    console.log(`   - ${sampleUsers.length} users`);
    console.log(`   - ${sampleCharacters.length} characters`);
    console.log(`   - ${samplePlanets.length} planets`);
    console.log('');
    console.log('🔑 Admin credentials:');
    console.log('   Email: admin@starwars.com');
    console.log('   Password: Admin123!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0));
}

export default seedDatabase;