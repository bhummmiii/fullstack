require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function verify() {
  await mongoose.connect(process.env.MONGO_URI);
  
  console.log('=== ADMIN ACCOUNT ===');
  const admin = await User.findOne({ role: 'admin' });
  if (admin) {
    console.log(`✔ Name: ${admin.name}`);
    console.log(`✔ Email: ${admin.email}`);
  } else {
    console.log('✖ No admin found');
  }
  
  console.log('\n=== SAMPLE RESIDENTS ===');
  const residents = await User.find({ role: 'resident' }).limit(5).select('name email flatNumber');
  residents.forEach(r => {
    console.log(`✔ ${r.name} - ${r.email} - ${r.flatNumber}`);
  });
  
  const totalResidents = await User.countDocuments({ role: 'resident' });
  console.log(`\n✔ Total residents: ${totalResidents}`);
  
  await mongoose.disconnect();
}

verify();
