/**
 * testLogin.js – Debug resident password authentication
 * Usage: node utils/testLogin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✔  Connected\n');

  // Test a few residents
  const testCases = [
    { email: 'rohan.deshmukh@gmail.com',  password: 'Rohan@A101'  },
    { email: 'sachin.patil@gmail.com',    password: 'Sachin@A201' },
    { email: 'kiran.phadke@gmail.com',    password: 'Kiran@E101'  },
  ];

  for (const { email, password } of testCases) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`✖  NOT FOUND: ${email}`);
      continue;
    }

    const match = await bcrypt.compare(password, user.password);
    const hashStart = user.password ? user.password.substring(0, 10) : 'NULL';
    console.log(`${match ? '✔' : '✖'}  ${email}`);
    console.log(`   password match: ${match}`);
    console.log(`   hash prefix: ${hashStart}...`);
    console.log(`   isActive: ${user.isActive}`);
    console.log(`   role: ${user.role}\n`);
  }

  await mongoose.disconnect();
}

test().catch(e => { console.error(e.message); process.exit(1); });
