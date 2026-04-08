require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function testLogin() {
  await mongoose.connect(process.env.MONGO_URI);
  
  console.log('=== CHECKING ADMIN ACCOUNT ===\n');
  
  const admin = await User.findOne({ role: 'admin' }).select('+password'); // Must explicitly select password
  
  if (!admin) {
    console.log('✖ No admin account found in database!');
    await mongoose.disconnect();
    return;
  }
  
  console.log('✔ Admin found in database:');
  console.log(`  Name: ${admin.name}`);
  console.log(`  Email: ${admin.email}`);
  console.log(`  Role: ${admin.role}`);
  console.log(`  Has Password: ${admin.password ? 'Yes' : 'NO - MISSING!'}`);
  
  if (!admin.password) {
    console.log('\n✖ CRITICAL: Admin account has no password!');
    console.log('✖ This is why login is failing');
    await mongoose.disconnect();
    return;
  }
  
  console.log(`  Password Hash: ${admin.password.substring(0, 20)}...`);
  
  console.log('\n=== TESTING PASSWORD ===\n');
  
  const testPassword = 'Nabonath@123';
  const isMatch = await bcrypt.compare(testPassword, admin.password);
  
  if (isMatch) {
    console.log(`✔ Password "${testPassword}" matches!`);
    console.log('✔ Login should work');
  } else {
    console.log(`✖ Password "${testPassword}" does NOT match!`);
    console.log('✖ There is a password mismatch issue');
  }
  
  await mongoose.disconnect();
}

testLogin();
