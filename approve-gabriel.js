import db from './models/index.js';

const { Facilitator } = db;

async function approveGabriel() {
  try {
    console.log('Finding and approving Gabriel...');
    
    // Find Gabriel by email
    const gabriel = await Facilitator.findOne({ 
      where: { email: 'g.pawuoi@gmail.com' } 
    });
    
    if (!gabriel) {
      console.log('❌ Gabriel not found!');
      return;
    }

    console.log('Found Gabriel:');
    console.log('- ID:', gabriel.id);
    console.log('- Email:', gabriel.email);
    console.log('- Name:', gabriel.name);
    console.log('- Current Status:', gabriel.status);
    
    if (gabriel.status === 'pending') {
      await gabriel.update({ status: 'active' });
      console.log('✅ Gabriel approved and activated!');
    } else if (gabriel.status === 'active') {
      console.log('✅ Gabriel is already active!');
    } else {
      console.log('⚠️ Gabriel status is:', gabriel.status);
    }
    
    console.log('\n🎯 Gabriel Login Credentials:');
    console.log('Email: g.pawuoi@gmail.com');
    console.log('Password: GabrielPass123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
}

approveGabriel();
