/**
 * updateAdmin.js – Update admin account details
 *
 * Usage:
 *   node server/utils/updateAdmin.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function updateAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔  Connected to MongoDB');

    // New admin details
    const newAdminData = {
      name: 'Nabonath Choudhary',
      email: 'nabonathchoudhary@gmail.com',
      password: 'Nabonath@123',
      phone: '9876543210',
      flatNumber: 'Admin',
    };

    // Delete old admin accounts
    const deleteResult = await User.deleteMany({ role: 'admin' });
    console.log(`✔  Removed ${deleteResult.deletedCount} old admin account(s)`);

    // Create new admin account using .create() which triggers pre-save hook
    const newAdmin = await User.create({
      name: newAdminData.name,
      email: newAdminData.email,
      password: newAdminData.password, // Will be hashed by pre-save hook
      role: 'admin',
      phone: newAdminData.phone,
      flatNumber: newAdminData.flatNumber,
      profileImage: null,
      isActive: true,
    });

    console.log('✔  Successfully created new admin account');
    console.log('\n   Admin Details:');
    console.log(`   Name: ${newAdminData.name}`);
    console.log(`   Email: ${newAdminData.email}`);
    console.log(`   Password: ${newAdminData.password}`);
    
    // Verify password was hashed
    const verifyAdmin = await User.findById(newAdmin._id).select('+password');
    console.log(`\n   Password hashed: ${verifyAdmin.password ? 'Yes ✔' : 'No ✖'}`);

  } catch (err) {
    console.error('✖  Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✔  Disconnected from MongoDB');
  }
}

updateAdmin();
