require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

async function seedAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('MONGO_URI is missing from .env');
        process.exit(1);
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    const email = 'admin@dare.com';
    const password = 'Afolayan123@@';

    let adminUser = await User.findOne({ email });

    if (!adminUser) {
        adminUser = new User({
            firstName: 'Super',
            lastName: 'Admin',
            email: email,
            password: password,
            role: 'admin',
            isVerified: true
        });
        await adminUser.save();
        console.log('Admin user successfully created!');
    } else {
        adminUser.role = 'admin'; // ensure role
        adminUser.password = password; // reset pass
        adminUser.isVerified = true;
        await adminUser.save();
        console.log('Admin user successfully updated!');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

seedAdmin();
