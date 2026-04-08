require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function testLoginFlow() {
  await mongoose.connect(process.env.MONGO_URI);
  
  console.log('=== SIMULATING LOGIN API FLOW ===\n');
  
  // Test Admin Login
  console.log('1. Testing Admin Login:');
  console.log('   Email: nabonathchoudhary@gmail.com');
  console.log('   Password: Nabonath@123\n');
  
  const adminEmail = 'nabonathchoudhary@gmail.com';
  const adminPassword = 'Nabonath@123';
  
  const admin = await User.findOne({ email: adminEmail.toLowerCase() }).select('+password');
  
  if (!admin) {
    console.log('   ✖ Admin not found in database');
  } else {
    console.log('   ✔ Admin found');
    const isMatch = await admin.matchPassword(adminPassword);
    if (isMatch) {
      console.log('   ✔ Password matches');
      console.log('   ✔ Admin login should work!\n');
    } else {
      console.log('   ✖ Password does NOT match');
      console.log('   ✖ Admin login will fail\n');
    }
  }
  
  // Test Resident Login
  console.log('2. Testing Resident Login:');
  console.log('   Email: rohan.deshmukh@gmail.com');
  console.log('   Password: Rohan@A101\n');
  
  const residentEmail = 'rohan.deshmukh@gmail.com';
  const residentPassword = 'Rohan@A101';
  
  const resident = await User.findOne({ email: residentEmail.toLowerCase() }).select('+password');
  
  if (!resident) {
    console.log('   ✖ Resident not found in database');
  } else {
    console.log('   ✔ Resident found');
    const isMatch = await resident.matchPassword(residentPassword);
    if (isMatch) {
      console.log('   ✔ Password matches');
      console.log('   ✔ Resident login should work!\n');
    } else {
      console.log('   ✖ Password does NOT match');
      console.log('   ✖ Resident login will fail\n');
    }
  }
  
  await mongoose.disconnect();
}

testLoginFlow();
