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
  { name: 'Rohan Deshmukh', flatNumber: 'A-101', phone: '9823012345', email: 'rohan.deshmukh@gmail.com', password: 'Rohan@A101' },
  { name: 'Aditi Kulkarni', flatNumber: 'A-102', phone: '9823012346', email: 'aditi.kulkarni@gmail.com', password: 'Aditi@A102' },
  { name: 'Sachin Patil', flatNumber: 'A-201', phone: '9823012347', email: 'sachin.patil@gmail.com', password: 'Sachin@A201' },
  { name: 'Priya Joshi', flatNumber: 'A-202', phone: '9823012348', email: 'priya.joshi@gmail.com', password: 'Priya@A202' },
  { name: 'Amit Chavan', flatNumber: 'A-301', phone: '9823012349', email: 'amit.chavan@gmail.com', password: 'Amit@A301' },
  { name: 'Neha Pawar', flatNumber: 'A-302', phone: '9823012350', email: 'neha.pawar@gmail.com', password: 'Neha@A302' },
  { name: 'Rahul Shinde', flatNumber: 'B-101', phone: '9823012351', email: 'rahul.shinde@gmail.com', password: 'Rahul@B101' },
  { name: 'Sneha Gaikwad', flatNumber: 'B-102', phone: '9823012352', email: 'sneha.gaikwad@gmail.com', password: 'Sneha@B102' },
  { name: 'Vikram Kale', flatNumber: 'B-201', phone: '9823012353', email: 'vikram.kale@gmail.com', password: 'Vikram@B201' },
  { name: 'Pooja Jadhav', flatNumber: 'B-202', phone: '9823012354', email: 'pooja.jadhav@gmail.com', password: 'Pooja@B202' },
  { name: 'Suresh Bhosale', flatNumber: 'B-301', phone: '9823012355', email: 'suresh.bhosale@gmail.com', password: 'Suresh@B301' },
  { name: 'Anjali Kadam', flatNumber: 'B-302', phone: '9823012356', email: 'anjali.kadam@gmail.com', password: 'Anjali@B302' },
  { name: 'Mahesh Mane', flatNumber: 'C-101', phone: '9823012357', email: 'mahesh.mane@gmail.com', password: 'Mahesh@C101' },
  { name: 'Swati Shirke', flatNumber: 'C-102', phone: '9823012358', email: 'swati.shirke@gmail.com', password: 'Swati@C102' },
  { name: 'Nilesh More', flatNumber: 'C-201', phone: '9823012359', email: 'nilesh.more@gmail.com', password: 'Nilesh@C201' },
  { name: 'Kavita Mahajan', flatNumber: 'C-202', phone: '9823012360', email: 'kavita.mahajan@gmail.com', password: 'Kavita@C202' },
  { name: 'Prakash Thakur', flatNumber: 'C-301', phone: '9823012361', email: 'prakash.thakur@gmail.com', password: 'Prakash@C301' },
  { name: 'Sonali Wagh', flatNumber: 'C-302', phone: '9823012362', email: 'sonali.wagh@gmail.com', password: 'Sonali@C302' },
  { name: 'Ramesh Sawant', flatNumber: 'D-101', phone: '9823012363', email: 'ramesh.sawant@gmail.com', password: 'Ramesh@D101' },
  { name: 'Rupali Rane', flatNumber: 'D-102', phone: '9823012364', email: 'rupali.rane@gmail.com', password: 'Rupali@D102' },
  { name: 'Vikas Gokhale', flatNumber: 'D-201', phone: '9823012365', email: 'vikas.gokhale@gmail.com', password: 'Vikas@D201' },
  { name: 'Smita Godbole', flatNumber: 'D-202', phone: '9823012366', email: 'smita.godbole@gmail.com', password: 'Smita@D202' },
  { name: 'Sameer Apte', flatNumber: 'D-301', phone: '9823012367', email: 'sameer.apte@gmail.com', password: 'Sameer@D301' },
  { name: 'Pallavi Bapat', flatNumber: 'D-302', phone: '9823012368', email: 'pallavi.bapat@gmail.com', password: 'Pallavi@D302' },
  { name: 'Kiran Phadke', flatNumber: 'E-101', phone: '9823012369', email: 'kiran.phadke@gmail.com', password: 'Kiran@E101' },
];

async function seedResidents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔  Connected to MongoDB');

    // Check how many residents already exist
    const existingResidents = await User.find({ role: 'resident' });

    if (existingResidents.length >= 25) {
      console.log(`✔  ${existingResidents.length} residents already exist in the database`);
      console.log('   Skipping seed to avoid duplicates');
      return;
    }

    // Prepare residents for insertion with individual passwords
    const residentsToInsert = [];
    let skippedCount = 0;

    for (const resident of residentsData) {
      // Check if resident already exists
      const exists = await User.findOne({ email: resident.email });
      if (exists) {
        skippedCount++;
        continue;
      }

      // Hash individual password for each resident
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(resident.password, salt);

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
    console.log('\n   Residents by Block:');
    console.log('   - Block A: 6 residents (A-101 to A-302)');
    console.log('   - Block B: 6 residents (B-101 to B-302)');
    console.log('   - Block C: 6 residents (C-101 to C-302)');
    console.log('   - Block D: 6 residents (D-101 to D-302)');
    console.log('   - Block E: 1 resident (E-101)');
    console.log(`\n   Total: ${residentsToInsert.length} residents added`);
    console.log('\n   Each resident has their own password: FirstName@FlatNumber');
    console.log('   Example: Rohan Deshmukh → Rohan@A101');

  } catch (err) {
    console.error('✖  Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✔  Disconnected from MongoDB');
  }
}

seedResidents();
