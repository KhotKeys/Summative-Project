import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import db from './models/index.js';

const { Manager } = db;

async function createManager() {
  try {
    console.log('Starting manager creation...');
    
    // Wait for database connection
    await db.sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Check if manager already exists
    const existingManager = await Manager.findOne({ 
      where: { email: 'kkhotmachuil@gmail.com' } 
    });
    
    if (existingManager) {
      console.log('Manager already exists:', existingManager.email);
      console.log('Name:', existingManager.name);
      console.log('Status:', existingManager.status);
      
      // If pending, approve them
      if (existingManager.status === 'pending') {
        await existingManager.update({ status: 'active' });
        console.log('✅ Manager has been approved and activated!');
      } else {
        console.log('✅ Manager is already active!');
      }
      return;
    }

    console.log('Creating new manager...');
    
    // Create new manager with active status
    const hashedPassword = await bcrypt.hash('AdminPass343', 10);
    
    const newManager = await Manager.create({
      id: uuidv4(),
      email: 'kkhotmachuil@gmail.com',
      name: 'Manager Admin',
      password: hashedPassword,
      role: 'manager',
      status: 'active' // Create as active instead of pending
    });

    console.log('✅ Manager created successfully!');
    console.log('Email:', newManager.email);
    console.log('Name:', newManager.name);
    console.log('Status:', newManager.status);
    console.log('Manager can login with: kkhotmachuil@gmail.com / AdminPass343');
  } catch (error) {
    console.error('Error creating manager:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
}

createManager();
