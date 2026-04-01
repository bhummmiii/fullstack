/**
 * testAllLogins.js – Verify ALL 25 resident passwords authenticate correctly
 * Usage: node utils/testAllLogins.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');
const fs       = require('fs');

const RESIDENTS = [
  { email: 'rohan.deshmukh@gmail.com',  password: 'Rohan@A101',   flatNumber: 'A-101' },
  { email: 'aditi.kulkarni@gmail.com',  password: 'Aditi@A102',   flatNumber: 'A-102' },
  { email: 'sachin.patil@gmail.com',    password: 'Sachin@A201',  flatNumber: 'A-201' },
  { email: 'priya.joshi@gmail.com',     password: 'Priya@A202',   flatNumber: 'A-202' },
  { email: 'amit.chavan@gmail.com',     password: 'Amit@A301',    flatNumber: 'A-301' },
  { email: 'neha.pawar@gmail.com',      password: 'Neha@A302',    flatNumber: 'A-302' },
  { email: 'rahul.shinde@gmail.com',    password: 'Rahul@B101',   flatNumber: 'B-101' },
  { email: 'sneha.gaikwad@gmail.com',   password: 'Sneha@B102',   flatNumber: 'B-102' },
  { email: 'vikram.kale@gmail.com',     password: 'Vikram@B201',  flatNumber: 'B-201' },
  { email: 'pooja.jadhav@gmail.com',    password: 'Pooja@B202',   flatNumber: 'B-202' },
  { email: 'suresh.bhosale@gmail.com',  password: 'Suresh@B301',  flatNumber: 'B-301' },
  { email: 'anjali.kadam@gmail.com',    password: 'Anjali@B302',  flatNumber: 'B-302' },
  { email: 'mahesh.mane@gmail.com',     password: 'Mahesh@C101',  flatNumber: 'C-101' },
  { email: 'swati.shirke@gmail.com',    password: 'Swati@C102',   flatNumber: 'C-102' },
  { email: 'nilesh.more@gmail.com',     password: 'Nilesh@C201',  flatNumber: 'C-201' },
  { email: 'kavita.mahajan@gmail.com',  password: 'Kavita@C202',  flatNumber: 'C-202' },
  { email: 'prakash.thakur@gmail.com',  password: 'Prakash@C301', flatNumber: 'C-301' },
  { email: 'sonali.wagh@gmail.com',     password: 'Sonali@C302',  flatNumber: 'C-302' },
  { email: 'ramesh.sawant@gmail.com',   password: 'Ramesh@D101',  flatNumber: 'D-101' },
  { email: 'rupali.rane@gmail.com',     password: 'Rupali@D102',  flatNumber: 'D-102' },
  { email: 'vikas.gokhale@gmail.com',   password: 'Vikas@D201',   flatNumber: 'D-201' },
  { email: 'smita.godbole@gmail.com',   password: 'Smita@D202',   flatNumber: 'D-202' },
  { email: 'sameer.apte@gmail.com',     password: 'Sameer@D301',  flatNumber: 'D-301' },
  { email: 'pallavi.bapat@gmail.com',   password: 'Pallavi@D302', flatNumber: 'D-302' },
  { email: 'kiran.phadke@gmail.com',    password: 'Kiran@E101',   flatNumber: 'E-101' },
];

async function test() {
  await mongoose.connect(process.env.MONGO_URI);

  let passed = 0, failed = 0;
  const failures = [];

  for (const r of RESIDENTS) {
    const user = await User.findOne({ email: r.email }).select('+password');
    if (!user) {
      console.log(`✖  NOT FOUND: ${r.email}`);
      failed++;
      failures.push(r.email);
      continue;
    }
    const match = await bcrypt.compare(r.password, user.password);
    if (match) {
      console.log(`✔  ${r.flatNumber} ${r.email}`);
      passed++;
    } else {
      console.log(`✖  ${r.flatNumber} ${r.email}  ← PASSWORD MISMATCH`);
      failed++;
      failures.push(r.email);
    }
  }

  console.log(`\n─── Results ──────────────────────`);
  console.log(`  Passed: ${passed} / ${RESIDENTS.length}`);
  console.log(`  Failed: ${failed}`);
  if (failures.length) {
    console.log(`  Failures: ${failures.join(', ')}`);
  }

  await mongoose.disconnect();
}

test().catch(e => { console.error(e.message); process.exit(1); });
