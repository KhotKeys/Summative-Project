import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import db from './models/index.js';

const { Facilitator } = db;

async function createAndApproveFacilitator() {
  try {
    // Check if Gabriel already exists
    const existingFacilitator = await Facilitator.findOne({ 
      where: { email: 'g.pawuoi@alueducation.com' } 
    });
    
    if (existingFacilitator) {
      console.log('Gabriel already exists:', existingFacilitator.email);
      console.log('Current Status:', existingFacilitator.status);
      
      // If pending, approve him
      if (existingFacilitator.status === 'pending') {
        await existingFacilitator.update({ status: 'active' });
        console.log('✅ Gabriel has been approved and activated!');
      } else {
        console.log('✅ Gabriel is already active!');
      }
      console.log('Gabriel can now login with: g.pawuoi@alueducation.com / GabrielPass123');
      return;
    }

    // Create Gabriel with approved status
    const hashedPassword = await bcrypt.hash('GabrielPass123', 10);
    
    const newFacilitator = await Facilitator.create({
      id: uuidv4(),
      email: 'g.pawuoi@alueducation.com',
      name: 'Gabriel Pawuoi',
      password: hashedPassword,
      qualification: 'Master\'s in Computer Science',
      location: 'Kigali, Rwanda',
      role: 'facilitator',
      status: 'active' // Create as active instead of pending
    });

    console.log('✅ Gabriel Facilitator created and approved successfully!');
    console.log('Email:', newFacilitator.email);
    console.log('Name:', newFacilitator.name);
    console.log('Status:', newFacilitator.status);
    console.log('Gabriel can now login immediately!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

createAndApproveFacilitator();
