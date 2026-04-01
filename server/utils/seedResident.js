/**
 * seedResident.js – Create a test resident user
 *
 * Usage:
 *   node server/utils/seedResident.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedResident() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔  Connected to MongoDB');

    const existingResident = await User.findOne({ email: 'resident@society.com' });

    if (existingResident) {
      console.log('✔  Resident already exists');
      console.log(`   Email      : ${existingResident.email}`);
      console.log(`   Flat No    : ${existingResident.flatNumber}`);
    } else {
      const DEFAULT_PASSWORD = 'demo123';
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

      await User.collection.insertOne({
        name: 'Test Resident',
        email: 'resident@society.com',
        password: hashedPassword,
        phone: '+91 9876543210',
        flatNumber: 'A-101',
        role: 'resident',
        profileImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✔  New resident created`);
      console.log(`   Name       : Test Resident`);
      console.log(`   Email      : resident@society.com`);
      console.log(`   Password   : ${DEFAULT_PASSWORD}`);
      console.log(`   Flat No    : A-101`);
    }
  } catch (err) {
    console.error('✖  Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✔  Disconnected from MongoDB');
  }
}

seedResident();
