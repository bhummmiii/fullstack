/**
 * seedComplaints.js – Create sample complaints for testing
 *
 * Usage:
 *   node server/utils/seedComplaints.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

const sampleComplaints = [
  {
    title: 'Water Leakage on Top Floor',
    description: 'There is severe water leakage from the ceiling in my bedroom. The issue started after the heavy rains last week. Water is dripping continuously and has damaged the paint and furniture. This needs immediate attention as it is causing significant damage to my property.',
    category: 'water',
    priority: 'urgent',
    status: 'Open',
    residentEmail: 'rohan.deshmukh@gmail.com', // A-101
  },
  {
    title: 'Garbage Waste Accumulation on Terrace',
    description: 'The terrace area has become a dumping ground for garbage and construction waste. There are piles of trash, broken furniture, and debris scattered everywhere. This is creating a health hazard and attracting pests. The area needs to be cleaned immediately and proper waste disposal guidelines should be enforced.',
    category: 'cleanliness',
    priority: 'high',
    status: 'Open',
    residentEmail: 'priya.joshi@gmail.com', // A-202
  },
  {
    title: 'Broken Elevator in Block B',
    description: 'The elevator in Block B has been out of order for the past 3 days. This is causing major inconvenience to elderly residents and families with small children who live on higher floors. The maintenance team needs to repair it urgently or arrange for a temporary solution.',
    category: 'maintenance',
    priority: 'urgent',
    status: 'In Progress',
    residentEmail: 'rahul.shinde@gmail.com', // B-101
  },
  {
    title: 'Street Light Not Working Near Gate',
    description: 'The street light near the main gate has not been working for over a week. This area becomes very dark at night, creating a security concern for residents returning home late. Please arrange for immediate repair or replacement of the light.',
    category: 'electricity',
    priority: 'high',
    status: 'Open',
    residentEmail: 'vikram.kale@gmail.com', // B-201
  },
  {
    title: 'Parking Space Encroachment',
    description: 'My designated parking space (A-101) is being regularly occupied by unauthorized vehicles. Despite multiple complaints to the security, the issue persists. I request the management to take strict action and ensure that parking rules are enforced properly.',
    category: 'parking',
    priority: 'medium',
    status: 'Open',
    residentEmail: 'suresh.bhosale@gmail.com', // B-301
  },
  {
    title: 'Excessive Noise from Construction Work',
    description: 'There is ongoing renovation work in flat C-305 that starts very early in the morning (around 7 AM) and continues till late evening. The drilling and hammering noise is unbearable and disturbing work-from-home schedules. Please enforce the society rules regarding construction timings.',
    category: 'noise',
    priority: 'medium',
    status: 'Resolved',
    residentEmail: 'mahesh.mane@gmail.com', // C-101
  },
  {
    title: 'Staircase Railing Loose and Unsafe',
    description: 'The railing on the staircase between 2nd and 3rd floor in Block A is loose and wobbly. This poses a serious safety risk, especially for children and elderly residents. Immediate repair is required to prevent any accidents.',
    category: 'maintenance',
    priority: 'urgent',
    status: 'In Progress',
    residentEmail: 'nilesh.more@gmail.com', // C-201
  },
  {
    title: 'Garden Area Needs Maintenance',
    description: 'The society garden has not been maintained properly. The grass is overgrown, plants are dying due to lack of watering, and the walking path is covered with weeds. The garden is a common amenity that all residents enjoy, and it needs regular upkeep.',
    category: 'maintenance',
    priority: 'low',
    status: 'Open',
    residentEmail: 'ramesh.sawant@gmail.com', // D-101
  },
];

async function seedComplaints() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔  Connected to MongoDB');

    // Check if complaints already exist
    const existingCount = await Complaint.countDocuments();
    if (existingCount > 0) {
      console.log(`✔  ${existingCount} complaints already exist in the database`);
      console.log('   Skipping seed to avoid duplicates');
      return;
    }

    // Create complaints with different residents
    const complaintsToInsert = [];
    
    for (const complaint of sampleComplaints) {
      // Find the resident by email
      const resident = await User.findOne({ email: complaint.residentEmail });
      
      if (!resident) {
        console.log(`⚠  Resident not found for email: ${complaint.residentEmail}, skipping complaint`);
        continue;
      }

      complaintsToInsert.push({
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        priority: complaint.priority,
        status: complaint.status,
        residentId: resident._id,
        flatNumber: resident.flatNumber,
        createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000), // Random date within last 2 weeks
        updatedAt: new Date(),
      });
    }

    if (complaintsToInsert.length === 0) {
      console.error('✖  No valid complaints to insert. Please ensure residents exist in the database.');
      process.exit(1);
    }

    await Complaint.insertMany(complaintsToInsert);

    console.log(`✔  Successfully created ${complaintsToInsert.length} sample complaints`);
    console.log('   Complaints from different residents:');
    console.log('   - Rohan Deshmukh (A-101) - Water leakage');
    console.log('   - Priya Joshi (A-202) - Garbage waste');
    console.log('   - Rahul Shinde (B-101) - Broken elevator');
    console.log('   - Vikram Kale (B-201) - Street light');
    console.log('   - Suresh Bhosale (B-301) - Parking issue');
    console.log('   - Mahesh Mane (C-101) - Noise complaint');
    console.log('   - Nilesh More (C-201) - Staircase safety');
    console.log('   - Ramesh Sawant (D-101) - Garden maintenance');

  } catch (err) {
    console.error('✖  Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✔  Disconnected from MongoDB');
  }
}

seedComplaints();
