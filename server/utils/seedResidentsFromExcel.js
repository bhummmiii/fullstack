/**
 * seedResidentsFromExcel.js
 * Creates / updates all 25 resident accounts from the Excel sheet data.
 *
 * Strategy:
 *   - If a user with the EXACT email exists → update their details and reset password.
 *   - If a user occupies the flat BUT with a different email → update that record to
 *     match the Excel data (name, email, phone, password).
 *   - If neither condition matches → create a new user.
 *
 * Usage (from the server/ directory):
 *   node utils/seedResidentsFromExcel.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');

// ─── Resident data from the Excel sheet ──────────────────────────────────────
const RESIDENTS = [
  { name: 'Rohan Deshmukh',  flatNumber: 'A-101', phone: '9823012345', email: 'rohan.deshmukh@gmail.com',  password: 'Rohan@A101'   },
  { name: 'Aditi Kulkarni',  flatNumber: 'A-102', phone: '9823012346', email: 'aditi.kulkarni@gmail.com',  password: 'Aditi@A102'   },
  { name: 'Sachin Patil',    flatNumber: 'A-201', phone: '9823012347', email: 'sachin.patil@gmail.com',    password: 'Sachin@A201'  },
  { name: 'Priya Joshi',     flatNumber: 'A-202', phone: '9823012348', email: 'priya.joshi@gmail.com',     password: 'Priya@A202'   },
  { name: 'Amit Chavan',     flatNumber: 'A-301', phone: '9823012349', email: 'amit.chavan@gmail.com',     password: 'Amit@A301'    },
  { name: 'Neha Pawar',      flatNumber: 'A-302', phone: '9823012350', email: 'neha.pawar@gmail.com',      password: 'Neha@A302'    },
  { name: 'Rahul Shinde',    flatNumber: 'B-101', phone: '9823012351', email: 'rahul.shinde@gmail.com',    password: 'Rahul@B101'   },
  { name: 'Sneha Gaikwad',   flatNumber: 'B-102', phone: '9823012352', email: 'sneha.gaikwad@gmail.com',   password: 'Sneha@B102'   },
  { name: 'Vikram Kale',     flatNumber: 'B-201', phone: '9823012353', email: 'vikram.kale@gmail.com',     password: 'Vikram@B201'  },
  { name: 'Pooja Jadhav',    flatNumber: 'B-202', phone: '9823012354', email: 'pooja.jadhav@gmail.com',    password: 'Pooja@B202'   },
  { name: 'Suresh Bhosale',  flatNumber: 'B-301', phone: '9823012355', email: 'suresh.bhosale@gmail.com',  password: 'Suresh@B301'  },
  { name: 'Anjali Kadam',    flatNumber: 'B-302', phone: '9823012356', email: 'anjali.kadam@gmail.com',    password: 'Anjali@B302'  },
  { name: 'Mahesh Mane',     flatNumber: 'C-101', phone: '9823012357', email: 'mahesh.mane@gmail.com',     password: 'Mahesh@C101'  },
  { name: 'Swati Shirke',    flatNumber: 'C-102', phone: '9823012358', email: 'swati.shirke@gmail.com',    password: 'Swati@C102'   },
  { name: 'Nilesh More',     flatNumber: 'C-201', phone: '9823012359', email: 'nilesh.more@gmail.com',     password: 'Nilesh@C201'  },
  { name: 'Kavita Mahajan',  flatNumber: 'C-202', phone: '9823012360', email: 'kavita.mahajan@gmail.com',  password: 'Kavita@C202'  },
  { name: 'Prakash Thakur',  flatNumber: 'C-301', phone: '9823012361', email: 'prakash.thakur@gmail.com',  password: 'Prakash@C301' },
  { name: 'Sonali Wagh',     flatNumber: 'C-302', phone: '9823012362', email: 'sonali.wagh@gmail.com',     password: 'Sonali@C302'  },
  { name: 'Ramesh Sawant',   flatNumber: 'D-101', phone: '9823012363', email: 'ramesh.sawant@gmail.com',   password: 'Ramesh@D101'  },
  { name: 'Rupali Rane',     flatNumber: 'D-102', phone: '9823012364', email: 'rupali.rane@gmail.com',     password: 'Rupali@D102'  },
  { name: 'Vikas Gokhale',   flatNumber: 'D-201', phone: '9823012365', email: 'vikas.gokhale@gmail.com',   password: 'Vikas@D201'   },
  { name: 'Smita Godbole',   flatNumber: 'D-202', phone: '9823012366', email: 'smita.godbole@gmail.com',   password: 'Smita@D202'   },
  { name: 'Sameer Apte',     flatNumber: 'D-301', phone: '9823012367', email: 'sameer.apte@gmail.com',     password: 'Sameer@D301'  },
  { name: 'Pallavi Bapat',   flatNumber: 'D-302', phone: '9823012368', email: 'pallavi.bapat@gmail.com',   password: 'Pallavi@D302' },
  { name: 'Kiran Phadke',    flatNumber: 'E-101', phone: '9823012369', email: 'kiran.phadke@gmail.com',    password: 'Kiran@E101'   },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔  Connected to MongoDB\n');

    let created = 0;
    let updated = 0;

    for (const r of RESIDENTS) {
      const emailLower = r.email.toLowerCase();

      // Hash the password once per resident
      const salt   = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash(r.password, salt);

      // Check if there's any resident-role user for this flat
      const existingByFlat = await User.findOne({ flatNumber: r.flatNumber, role: 'resident' });

      if (existingByFlat) {
        // Update the existing record in-place (even if email differs)
        await User.updateOne(
          { _id: existingByFlat._id },
          {
            $set: {
              name:       r.name,
              email:      emailLower,
              password:   hashed,
              phone:      r.phone,
              flatNumber: r.flatNumber,
              isActive:   true,
              updatedAt:  new Date(),
            },
          }
        );
        console.log(`  ↺  Updated  : ${r.name} (${r.flatNumber}) — ${emailLower}`);
        updated++;
        continue;
      }

      // Also check by email in case flat differs
      const existingByEmail = await User.findOne({ email: emailLower });
      if (existingByEmail) {
        await User.updateOne(
          { _id: existingByEmail._id },
          {
            $set: {
              name:       r.name,
              email:      emailLower,
              password:   hashed,
              phone:      r.phone,
              flatNumber: r.flatNumber,
              isActive:   true,
              updatedAt:  new Date(),
            },
          }
        );
        console.log(`  ↺  Updated  : ${r.name} (${r.flatNumber}) — ${emailLower}`);
        updated++;
        continue;
      }

      // Create brand new resident
      await User.collection.insertOne({
        name:         r.name,
        email:        emailLower,
        password:     hashed,
        phone:        r.phone,
        flatNumber:   r.flatNumber,
        role:         'resident',
        profileImage: null,
        isActive:     true,
        createdAt:    new Date(),
        updatedAt:    new Date(),
      });

      console.log(`  ✔  Created  : ${r.name} (${r.flatNumber}) — ${emailLower}`);
      created++;
    }

    console.log('\n─────────────────────────────────────────');
    console.log(`  Created  : ${created}`);
    console.log(`  Updated  : ${updated}`);
    console.log(`  Total    : ${RESIDENTS.length}`);
    console.log('─────────────────────────────────────────');
    console.log('\n✔  Done! All 25 residents have correct credentials from the Excel sheet.\n');

  } catch (err) {
    console.error('✖  Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✔  Disconnected from MongoDB');
  }
}

seed();
