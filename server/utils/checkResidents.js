require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const fs = require('fs');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const residents = await User.find({ role: 'resident' }).lean().sort({ flatNumber: 1 });
  const admin     = await User.find({ role: 'admin' }).lean();

  let out = `=== ADMIN (${admin.length}) ===\n`;
  admin.forEach(u => { out += `  ${u.name} | ${u.flatNumber} | ${u.email}\n`; });

  out += `\n=== RESIDENTS (${residents.length}) ===\n`;
  residents.forEach(u => { out += `  ${u.name} | ${u.flatNumber} | ${u.email} | active=${u.isActive}\n`; });

  fs.writeFileSync('db_check_output.txt', out);
  console.log(out);
  await mongoose.disconnect();
}).catch(e => { console.error(e.message); process.exit(1); });
