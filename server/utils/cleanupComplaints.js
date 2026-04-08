require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await Complaint.deleteMany({});
  console.log(`✔ Deleted ${result.deletedCount} complaint records`);
  await mongoose.disconnect();
}

cleanup();
