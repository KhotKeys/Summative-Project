import db from './models/index.js';

const { Student } = db;

async function approveJoseph() {
  try {
    console.log('Finding and approving Joseph...');
    
    // Find Joseph by email
    const joseph = await Student.findOne({ 
      where: { email: 'josephkuir@gmail.com' } 
    });
    
    if (!joseph) {
      console.log('❌ Joseph not found!');
      return;
    }

    console.log('Found Joseph:');
    console.log('- ID:', joseph.id);
    console.log('- Email:', joseph.email);
    console.log('- Name:', joseph.name);
    console.log('- StudentID:', joseph.studentID);
    console.log('- Current Status:', joseph.status);
    
    if (joseph.status === 'pending') {
      await joseph.update({ status: 'active' });
      console.log('✅ Joseph approved and activated!');
    } else if (joseph.status === 'active') {
      console.log('✅ Joseph is already active!');
    } else {
      console.log('⚠️ Joseph status is:', joseph.status);
    }
    
    console.log('\n🎯 Joseph Login Credentials:');
    console.log('Email: josephkuir@gmail.com');
    console.log('Password: AdminPass343');
    console.log('StudentID:', joseph.studentID);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
}

approveJoseph();
