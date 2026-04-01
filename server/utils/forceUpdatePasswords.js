/**
 * forceUpdatePasswords.js
 * Force-updates ALL resident passwords to match the Excel sheet exactly.
 * This is a one-time fix for any residents whose passwords got out of sync.
 *
 * Usage: node utils/forceUpdatePasswords.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');

const RESIDENTS = [
  { email: 'rohan.deshmukh@gmail.com',  name: 'Rohan Deshmukh',  flatNumber: 'A-101', phone: '9823012345', password: 'Rohan@A101'   },
  { email: 'aditi.kulkarni@gmail.com',  name: 'Aditi Kulkarni',  flatNumber: 'A-102', phone: '9823012346', password: 'Aditi@A102'   },
  { email: 'sachin.patil@gmail.com',    name: 'Sachin Patil',    flatNumber: 'A-201', phone: '9823012347', password: 'Sachin@A201'  },
  { email: 'priya.joshi@gmail.com',     name: 'Priya Joshi',     flatNumber: 'A-202', phone: '9823012348', password: 'Priya@A202'   },
  { email: 'amit.chavan@gmail.com',     name: 'Amit Chavan',     flatNumber: 'A-301', phone: '9823012349', password: 'Amit@A301'    },
  { email: 'neha.pawar@gmail.com',      name: 'Neha Pawar',      flatNumber: 'A-302', phone: '9823012350', password: 'Neha@A302'    },
  { email: 'rahul.shinde@gmail.com',    name: 'Rahul Shinde',    flatNumber: 'B-101', phone: '9823012351', password: 'Rahul@B101'   },
  { email: 'sneha.gaikwad@gmail.com',   name: 'Sneha Gaikwad',   flatNumber: 'B-102', phone: '9823012352', password: 'Sneha@B102'   },
  { email: 'vikram.kale@gmail.com',     name: 'Vikram Kale',     flatNumber: 'B-201', phone: '9823012353', password: 'Vikram@B201'  },
  { email: 'pooja.jadhav@gmail.com',    name: 'Pooja Jadhav',    flatNumber: 'B-202', phone: '9823012354', password: 'Pooja@B202'   },
  { email: 'suresh.bhosale@gmail.com',  name: 'Suresh Bhosale',  flatNumber: 'B-301', phone: '9823012355', password: 'Suresh@B301'  },
  { email: 'anjali.kadam@gmail.com',    name: 'Anjali Kadam',    flatNumber: 'B-302', phone: '9823012356', password: 'Anjali@B302'  },
  { email: 'mahesh.mane@gmail.com',     name: 'Mahesh Mane',     flatNumber: 'C-101', phone: '9823012357', password: 'Mahesh@C101'  },
  { email: 'swati.shirke@gmail.com',    name: 'Swati Shirke',    flatNumber: 'C-102', phone: '9823012358', password: 'Swati@C102'   },
  { email: 'nilesh.more@gmail.com',     name: 'Nilesh More',     flatNumber: 'C-201', phone: '9823012359', password: 'Nilesh@C201'  },
  { email: 'kavita.mahajan@gmail.com',  name: 'Kavita Mahajan',  flatNumber: 'C-202', phone: '9823012360', password: 'Kavita@C202'  },
  { email: 'prakash.thakur@gmail.com',  name: 'Prakash Thakur',  flatNumber: 'C-301', phone: '9823012361', password: 'Prakash@C301' },
  { email: 'sonali.wagh@gmail.com',     name: 'Sonali Wagh',     flatNumber: 'C-302', phone: '9823012362', password: 'Sonali@C302'  },
  { email: 'ramesh.sawant@gmail.com',   name: 'Ramesh Sawant',   flatNumber: 'D-101', phone: '9823012363', password: 'Ramesh@D101'  },
  { email: 'rupali.rane@gmail.com',     name: 'Rupali Rane',     flatNumber: 'D-102', phone: '9823012364', password: 'Rupali@D102'  },
  { email: 'vikas.gokhale@gmail.com',   name: 'Vikas Gokhale',   flatNumber: 'D-201', phone: '9823012365', password: 'Vikas@D201'   },
  { email: 'smita.godbole@gmail.com',   name: 'Smita Godbole',   flatNumber: 'D-202', phone: '9823012366', password: 'Smita@D202'   },
  { email: 'sameer.apte@gmail.com',     name: 'Sameer Apte',     flatNumber: 'D-301', phone: '9823012367', password: 'Sameer@D301'  },
  { email: 'pallavi.bapat@gmail.com',   name: 'Pallavi Bapat',   flatNumber: 'D-302', phone: '9823012368', password: 'Pallavi@D302' },
  { email: 'kiran.phadke@gmail.com',    name: 'Kiran Phadke',    flatNumber: 'E-101', phone: '9823012369', password: 'Kiran@E101'   },
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔  Connected to MongoDB\n');

    let updated = 0;
    let created = 0;

    for (const r of RESIDENTS) {
      // Hash password fresh
      const salt   = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash(r.password, salt);

      // Verify hash immediately (sanity check)
      const valid = await bcrypt.compare(r.password, hashed);
      if (!valid) {
        console.error(`  ✖  Hash verification failed for ${r.email} — skipping!`);
        continue;
      }

      // Try to find by email first, then by flat
      let existing = await User.findOne({ email: r.email });
      if (!existing) {
        existing = await User.findOne({ flatNumber: r.flatNumber, role: 'resident' });
      }

      if (existing) {
        // Use collection.updateOne to bypass mongoose middleware (no double-hashing risk)
        await User.collection.updateOne(
          { _id: existing._id },
          {
            $set: {
              name:       r.name,
              email:      r.email,
              password:   hashed,
              phone:      r.phone,
              flatNumber: r.flatNumber,
              role:       'resident',
              isActive:   true,
              updatedAt:  new Date(),
            },
          }
        );
        console.log(`  ↺  Updated  : ${r.name} (${r.flatNumber})`);
        updated++;
      } else {
        // Create new
        await User.collection.insertOne({
          name:         r.name,
          email:        r.email,
          password:     hashed,
          phone:        r.phone,
          flatNumber:   r.flatNumber,
          role:         'resident',
          profileImage: null,
          isActive:     true,
          createdAt:    new Date(),
          updatedAt:    new Date(),
        });
        console.log(`  ✔  Created  : ${r.name} (${r.flatNumber})`);
        created++;
      }
    }

    console.log('\n─────────────────────────────────────────');
    console.log(`  Updated  : ${updated}`);
    console.log(`  Created  : ${created}`);
    console.log(`  Total    : ${RESIDENTS.length}`);
    console.log('─────────────────────────────────────────');
    console.log('\n✔  All residents now have correct passwords from the Excel sheet.\n');

  } catch (err) {
    console.error('✖  Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✔  Disconnected');
  }
}

run();
