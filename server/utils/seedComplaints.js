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
  },
  {
    title: 'Garbage Waste Accumulation on Terrace',
    description: 'The terrace area has become a dumping ground for garbage and construction waste. There are piles of trash, broken furniture, and debris scattered everywhere. This is creating a health hazard and attracting pests. The area needs to be cleaned immediately and proper waste disposal guidelines should be enforced.',
    category: 'cleanliness',
    priority: 'high',
    status: 'Open',
  },
  {
    title: 'Broken Elevator in Block B',
    description: 'The elevator in Block B has been out of order for the past 3 days. This is causing major inconvenience to elderly residents and families with small children who live on higher floors. The maintenance team needs to repair it urgently or arrange for a temporary solution.',
    category: 'maintenance',
    priority: 'urgent',
    status: 'In Progress',
  },
  {
    title: 'Street Light Not Working Near Gate',
    description: 'The street light near the main gate has not been working for over a week. This area becomes very dark at night, creating a security concern for residents returning home late. Please arrange for immediate repair or replacement of the light.',
    category: 'electricity',
    priority: 'high',
    status: 'Open',
  },
  {
    title: 'Parking Space Encroachment',
    description: 'My designated parking space (A-101) is being regularly occupied by unauthorized vehicles. Despite multiple complaints to the security, the issue persists. I request the management to take strict action and ensure that parking rules are enforced properly.',
    category: 'parking',
    priority: 'medium',
    status: 'Open',
  },
  {
    title: 'Excessive Noise from Construction Work',
    description: 'There is ongoing renovation work in flat C-305 that starts very early in the morning (around 7 AM) and continues till late evening. The drilling and hammering noise is unbearable and disturbing work-from-home schedules. Please enforce the society rules regarding construction timings.',
    category: 'noise',
    priority: 'medium',
    status: 'Resolved',
  },
  {
    title: 'Staircase Railing Loose and Unsafe',
    description: 'The railing on the staircase between 2nd and 3rd floor in Block A is loose and wobbly. This poses a serious safety risk, especially for children and elderly residents. Immediate repair is required to prevent any accidents.',
    category: 'maintenance',
    priority: 'urgent',
    status: 'In Progress',
  },
  {
    title: 'Garden Area Needs Maintenance',
    description: 'The society garden has not been maintained properly. The grass is overgrown, plants are dying due to lack of watering, and the walking path is covered with weeds. The garden is a common amenity that all residents enjoy, and it needs regular upkeep.',
    category: 'maintenance',
    priority: 'low',
    status: 'Open',
  },
];

async function seedComplaints() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔  Connected to MongoDB');

    // Find the resident user
    const resident = await User.findOne({ email: 'resident@society.com' });
    if (!resident) {
      console.error('✖  Resident user not found. Please run seedResident.js first.');
      process.exit(1);
    }

    // Check if complaints already exist
    const existingCount = await Complaint.countDocuments();
    if (existingCount > 0) {
      console.log(`✔  ${existingCount} complaints already exist in the database`);
      console.log('   Skipping seed to avoid duplicates');
      return;
    }

    // Create complaints
    const complaintsToInsert = sampleComplaints.map(complaint => ({
      ...complaint,
      residentId: resident._id,
      flatNumber: resident.flatNumber,
      createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000), // Random date within last 2 weeks
      updatedAt: new Date(),
    }));

    await Complaint.insertMany(complaintsToInsert);

    console.log(`✔  Successfully created ${sampleComplaints.length} sample complaints`);
    console.log('   Categories covered:');
    console.log('   - Water leakage issues');
    console.log('   - Cleanliness and hygiene');
    console.log('   - Building maintenance');
    console.log('   - Electrical problems');
    console.log('   - Parking disputes');
    console.log('   - Noise complaints');
    console.log('   - Safety concerns');

  } catch (err) {
    console.error('✖  Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✔  Disconnected from MongoDB');
  }
}

seedComplaints();
