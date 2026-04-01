/**
 * seedResidents.js – Populate all 25 residents from Excel data
 *
 * Usage:
 *   node server/utils/seedResidents.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const residentsData = [
  { name: 'Rohan Deshmukh', flatNumber: 'A-101', phone: '9823012345', email: 'rohan.deshmukh@example.com' },
  { name: 'Aditi Kulkarni', flatNumber: 'A-102', phone: '9823012346', email: 'aditi.kulkarni@example.com' },
  { name: 'Sachin Patil', flatNumber: 'A-201', phone: '9823012347', email: 'sachin.patil@example.com' },
  { name: 'Priya Joshi', flatNumber: 'A-202', phone: '9823012348', email: 'priya.joshi@example.com' },
  { name: 'Amit Chavan', flatNumber: 'A-301', phone: '9823012349', email: 'amit.chavan@example.com' },
  { name: 'Neha Pawar', flatNumber: 'A-302', phone: '9823012350', email: 'neha.pawar@example.com' },
  { name: 'Rahul Shinde', flatNumber: 'B-101', phone: '9823012351', email: 'rahul.shinde@example.com' },
  { name: 'Sneha Gaikwad', flatNumber: 'B-102', phone: '9823012352', email: 'sneha.gaikwad@example.com' },
  { name: 'Vikram Kale', flatNumber: 'B-201', phone: '9823012353', email: 'vikram.kale@example.com' },
  { name: 'Pooja Jadhav', flatNumber: 'B-202', phone: '9823012354', email: 'pooja.jadhav@example.com' },
  { name: 'Suresh Bhosale', flatNumber: 'B-301', phone: '9823012355', email: 'suresh.bhosale@example.com' },
  { name: 'Anjali Kadam', flatNumber: 'B-302', phone: '9823012356', email: 'anjali.kadam@example.com' },
  { name: 'Mahesh Mane', flatNumber: 'C-101', phone: '9823012357', email: 'mahesh.mane@example.com' },
  { name: 'Swati Shirke', flatNumber: 'C-102', phone: '9823012358', email: 'swati.shirke@example.com' },
  { name: 'Nilesh More', flatNumber: 'C-201', phone: '9823012359', email: 'nilesh.more@example.com' },
  { name: 'Kavita Mahajan', flatNumber: 'C-202', phone: '9823012360', email: 'kavita.mahajan@example.com' },
  { name: 'Prakash Thakur', flatNumber: 'C-301', phone: '9823012361', email: 'prakash.thakur@example.com' },
  { name: 'Sonali Wagh', flatNumber: 'C-302', phone: '9823012362', email: 'sonali.wagh@example.com' },
  { name: 'Ramesh Sawant', flatNumber: 'D-101', phone: '9823012363', email: 'ramesh.sawant@example.com' },
  { name: 'Rupali Rane', flatNumber: 'D-102', phone: '9823012364', email: 'rupali.rane@example.com' },
  { name: 'Vikas Gokhale', flatNumber: 'D-201', phone: '9823012365', email: 'vikas.gokhale@example.com' },
  { name: 'Smita Godbole', flatNumber: 'D-202', phone: '9823012366', email: 'smita.godbole@example.com' },
  { name: 'Sameer Apte', flatNumber: 'D-301', phone: '9823012367', email: 'sameer.apte@example.com' },
  { name: 'Pallavi Bapat', flatNumber: 'D-302', phone: '9823012368', email: 'pallavi.bapat@example.com' },
  { name: 'Kiran Phadke', flatNumber: 'E-101', phone: '9823012369', email: 'kiran.phadke@example.com' },
];

async function seedResidents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔  Connected to MongoDB');

    // Check how many residents already exist (excluding admin and test resident)
    const existingResidents = await User.find({ 
      role: 'resident',
      email: { $nin: ['resident@society.com'] } // Exclude test resident
    });

    if (existingResidents.length >= 25) {
      console.log(`✔  ${existingResidents.length} residents already exist in the database`);
      console.log('   Skipping seed to avoid duplicates');
      return;
    }

    // Default password for all residents
    const DEFAULT_PASSWORD = 'Resident@123';
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

    // Prepare residents for insertion
    const residentsToInsert = [];
    let skippedCount = 0;

    for (const resident of residentsData) {
      // Check if resident already exists
      const exists = await User.findOne({ email: resident.email });
      if (exists) {
        skippedCount++;
        continue;
      }

      residentsToInsert.push({
        name: resident.name,
        email: resident.email,
        password: hashedPassword,
        phone: resident.phone,
        flatNumber: resident.flatNumber,
        role: 'resident',
        profileImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    if (residentsToInsert.length === 0) {
      console.log('✔  All residents already exist in the database');
      return;
    }

    // Insert residents
    await User.collection.insertMany(residentsToInsert);

    console.log(`✔  Successfully created ${residentsToInsert.length} residents`);
    if (skippedCount > 0) {
      console.log(`   Skipped ${skippedCount} existing residents`);
    }
    console.log(`\n   Default Password for all residents: ${DEFAULT_PASSWORD}`);
    console.log('\n   Residents by Block:');
    console.log('   - Block A: 6 residents (A-101 to A-302)');
    console.log('   - Block B: 6 residents (B-101 to B-302)');
    console.log('   - Block C: 6 residents (C-101 to C-302)');
    console.log('   - Block D: 6 residents (D-101 to D-302)');
    console.log('   - Block E: 1 resident (E-101)');
    console.log(`\n   Total: ${residentsToInsert.length} residents added`);

  } catch (err) {
    console.error('✖  Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✔  Disconnected from MongoDB');
  }
}

seedResidents();
