/**
 * cleanupResidents.js – Remove old test residents and ensure clean database
 *
 * Usage:
 *   node server/utils/cleanupResidents.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const User = require('../models/User');

async function cleanupResidents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔  Connected to MongoDB');

    // Remove ALL residents
    const result = await User.deleteMany({ role: 'resident' });

    console.log(`✔  Removed ${result.deletedCount} resident(s)`);
    
    console.log('\n⚠  Database cleaned. Run seedResidents.js to populate with Excel data.');

  } catch (err) {
    console.error('✖  Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✔  Disconnected from MongoDB');
  }
}

cleanupResidents();
