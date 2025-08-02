import db from './models/index.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function createCustomSystemAdmin() {
  try {
    // Check if system admin already exists
    const existingAdmin = await db.SystemAdmin.findOne({ 
      where: { email: 'kkhotmachuil.com' } 
    });

    if (existingAdmin) {
      console.log('System admin already exists with email: kkhotmachuil.com');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('AdminPass343', 12);

    // Create system admin
    const admin = await db.SystemAdmin.create({
      email: 'kkhotmachuil.com',
      name: 'System Administrator',
      password: hashedPassword,
      role: 'system_admin'
    });

    console.log('Custom system admin created successfully:');
    console.log('Email: kkhotmachuil.com');
    console.log('Password: AdminPass343');
    console.log('ID:', admin.id);

  } catch (error) {
    console.error('Error creating system admin:', error.message);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
}

createCustomSystemAdmin();
