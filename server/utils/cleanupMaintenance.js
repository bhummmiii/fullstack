require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Maintenance = require('../models/Maintenance');

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await Maintenance.deleteMany({});
  console.log(`✔ Deleted ${result.deletedCount} maintenance records`);
  await mongoose.disconnect();
}

cleanup();
