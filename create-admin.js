import db from './models/index.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function createSystemAdmin() {
  try {
    // Check if system admin already exists
    const existingAdmin = await db.SystemAdmin.findOne({ 
      where: { email: 'admin@alu.edu' } 
    });

    if (existingAdmin) {
      console.log('System admin already exists with email: admin@alu.edu');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('AdminPass123', 12);

    // Create system admin
    const admin = await db.SystemAdmin.create({
      email: 'admin@alu.edu',
      name: 'System Administrator',
      password: hashedPassword,
      role: 'system_admin'
    });

    console.log('System admin created successfully:');
    console.log('Email: admin@alu.edu');
    console.log('Password: AdminPass123');
    console.log('ID:', admin.id);

  } catch (error) {
    console.error('Error creating system admin:', error.message);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
}

createSystemAdmin();
