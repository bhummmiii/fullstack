/**
 * cleanupDuplicates.js
 * Removes old/test resident records that have duplicate flat numbers.
 * Keeps only the record with the correct email (from the Excel sheet).
 *
 * Usage: node utils/cleanupDuplicates.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

// Canonical emails from the Excel sheet
const CANONICAL = [
  { flatNumber: 'A-101', email: 'rohan.deshmukh@gmail.com'  },
  { flatNumber: 'A-102', email: 'aditi.kulkarni@gmail.com'  },
  { flatNumber: 'A-201', email: 'sachin.patil@gmail.com'    },
  { flatNumber: 'A-202', email: 'priya.joshi@gmail.com'     },
  { flatNumber: 'A-301', email: 'amit.chavan@gmail.com'     },
  { flatNumber: 'A-302', email: 'neha.pawar@gmail.com'      },
  { flatNumber: 'B-101', email: 'rahul.shinde@gmail.com'    },
  { flatNumber: 'B-102', email: 'sneha.gaikwad@gmail.com'   },
  { flatNumber: 'B-201', email: 'vikram.kale@gmail.com'     },
  { flatNumber: 'B-202', email: 'pooja.jadhav@gmail.com'    },
  { flatNumber: 'B-301', email: 'suresh.bhosale@gmail.com'  },
  { flatNumber: 'B-302', email: 'anjali.kadam@gmail.com'    },
  { flatNumber: 'C-101', email: 'mahesh.mane@gmail.com'     },
  { flatNumber: 'C-102', email: 'swati.shirke@gmail.com'    },
  { flatNumber: 'C-201', email: 'nilesh.more@gmail.com'     },
  { flatNumber: 'C-202', email: 'kavita.mahajan@gmail.com'  },
  { flatNumber: 'C-301', email: 'prakash.thakur@gmail.com'  },
  { flatNumber: 'C-302', email: 'sonali.wagh@gmail.com'     },
  { flatNumber: 'D-101', email: 'ramesh.sawant@gmail.com'   },
  { flatNumber: 'D-102', email: 'rupali.rane@gmail.com'     },
  { flatNumber: 'D-201', email: 'vikas.gokhale@gmail.com'   },
  { flatNumber: 'D-202', email: 'smita.godbole@gmail.com'   },
  { flatNumber: 'D-301', email: 'sameer.apte@gmail.com'     },
  { flatNumber: 'D-302', email: 'pallavi.bapat@gmail.com'   },
  { flatNumber: 'E-101', email: 'kiran.phadke@gmail.com'    },
];

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔  Connected to MongoDB\n');

    let deleted = 0;

    for (const { flatNumber, email } of CANONICAL) {
      // Find all residents with this flat number
      const records = await User.find({ flatNumber, role: 'resident' }).lean();
      if (records.length <= 1) continue; // no duplicates

      for (const rec of records) {
        if (rec.email !== email) {
          await User.deleteOne({ _id: rec._id });
          console.log(`  🗑  Removed old record: ${rec.email} (${flatNumber})`);
          deleted++;
        }
      }
    }

    if (deleted === 0) {
      console.log('  ✔  No duplicates found — database is clean.');
    } else {
      console.log(`\n  ✔  Removed ${deleted} duplicate record(s).`);
    }
  } catch (err) {
    console.error('✖  Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✔  Done');
  }
}

cleanup();
