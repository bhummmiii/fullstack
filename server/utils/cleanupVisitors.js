require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Visitor = require('../models/Visitor');

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await Visitor.deleteMany({});
  console.log(`✔ Deleted ${result.deletedCount} visitor records`);
  await mongoose.disconnect();
}

cleanup();
