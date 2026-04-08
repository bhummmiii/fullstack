require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function verify() {
  await mongoose.connect(process.env.MONGO_URI);
  const r = await User.findOne({ email: 'rohan.deshmukh@example.com' });
  console.log(r ? `✔ Found: ${r.name} (${r.email}) - ${r.flatNumber}` : '✖ Not found');
  await mongoose.disconnect();
}

verify();
