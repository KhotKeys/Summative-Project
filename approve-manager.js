import db from './models/index.js';

const { Manager } = db;

async function approveManager() {
  try {
    console.log('Finding and approving manager...');
    
    // Find the manager by email
    const manager = await Manager.findOne({ 
      where: { email: 'kkhotmachuil@gmail.com' } 
    });
    
    if (!manager) {
      console.log('❌ Manager not found!');
      return;
    }

    console.log('Found manager:');
    console.log('- ID:', manager.id);
    console.log('- Email:', manager.email);
    console.log('- Name:', manager.name);
    console.log('- Current Status:', manager.status);
    
    if (manager.status === 'pending') {
      await manager.update({ status: 'active' });
      console.log('✅ Manager approved and activated!');
    } else if (manager.status === 'active') {
      console.log('✅ Manager is already active!');
    } else {
      console.log('⚠️ Manager status is:', manager.status);
    }
    
    console.log('\n🎯 Manager Login Credentials:');
    console.log('Email: kkhotmachuil@gmail.com');
    console.log('Password: AdminPass343');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
}

approveManager();
