import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import db from './models/index.js';

const { Manager } = db;

async function createManager() {
  try {
    // Check if manager already exists
    const existingManager = await Manager.findOne({ 
      where: { email: 'kkhotmachuil@gmail.com' } 
    });
    
    if (existingManager) {
      console.log('Manager already exists:', existingManager.email);
      console.log('Status:', existingManager.status);
      return;
    }

    // Create new manager
    const hashedPassword = await bcrypt.hash('AdminPass343', 10);
    
    const newManager = await Manager.create({
      id: uuidv4(),
      email: 'kkhotmachuil@gmail.com',
      name: 'System Manager',
      password: hashedPassword,
      role: 'manager',
      status: 'active' // Set as active so we can login immediately
    });

    console.log('Manager created successfully:');
    console.log('Email:', newManager.email);
    console.log('Status:', newManager.status);
    console.log('You can now login with email: kkhotmachuil@gmail.com and password: AdminPass343');
  } catch (error) {
    console.error('Error creating manager:', error);
  } finally {
    process.exit(0);
  }
}

createManager();
