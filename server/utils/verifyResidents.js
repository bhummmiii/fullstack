require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function verifyResidents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const residents = await User.find({ role: 'resident' }).sort({ flatNumber: 1 });
    console.log(`Total residents: ${residents.length}`);
    
    console.log('\nResidents by block:');
    const blocks = {};
    residents.forEach(r => {
      const block = r.flatNumber.charAt(0);
      blocks[block] = (blocks[block] || 0) + 1;
    });
    Object.keys(blocks).sort().forEach(block => 
      console.log(`  Block ${block}: ${blocks[block]} residents`)
    );
    
    console.log('\nSample residents:');
    residents.slice(0, 5).forEach(r => 
      console.log(`  ${r.flatNumber} - ${r.name} (${r.email})`)
    );
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

verifyResidents();
