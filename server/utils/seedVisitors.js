/**
 * seedVisitors.js – Create sample visitor records
 *
 * Usage:
 *   node server/utils/seedVisitors.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const Visitor = require('../models/Visitor');
const User = require('../models/User');

const visitorNames = [
  'Rajesh Kumar', 'Sunita Sharma', 'Anil Verma', 'Meera Iyer', 'Deepak Singh',
  'Kavita Nair', 'Sunil Reddy', 'Priyanka Gupta', 'Manoj Jain', 'Rekha Pillai',
  'Ashok Mehta', 'Geeta Rao', 'Vijay Desai', 'Shalini Kapoor', 'Ravi Menon',
  'Anita Bose', 'Karthik Shetty', 'Divya Agarwal', 'Sandeep Malhotra', 'Nisha Pandey'
];

const purposes = [
  'Family Visit',
  'Delivery - Amazon',
  'Plumber Service',
  'Electrician Service',
  'Guest for Dinner',
  'Courier Delivery',
  'Carpenter Work',
  'AC Repair',
  'Painting Work',
  'Friend Visit',
  'Relative Visit',
  'Business Meeting',
  'Tuition Teacher',
  'House Help',
  'Grocery Delivery',
  'Furniture Delivery',
  'Doctor Visit',
  'Pest Control Service',
  'Internet Technician',
  'Birthday Party Guest'
];

async function seedVisitors() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔  Connected to MongoDB');

    // Check if visitor records already exist
    const existingCount = await Visitor.countDocuments();
    if (existingCount > 0) {
      console.log(`✔  ${existingCount} visitor records already exist`);
      console.log('   Skipping seed to avoid duplicates');
      return;
    }

    // Get all residents
    const residents = await User.find({ role: 'resident' }).sort({ flatNumber: 1 });
    if (residents.length === 0) {
      console.error('✖  No residents found. Please run seedResidents.js first.');
      process.exit(1);
    }

    // Get admin for approvedBy field
    const admin = await User.findOne({ role: 'admin' });

    const visitorRecords = [];
    const now = new Date();

    // Create 30 visitor records with varied statuses and dates
    for (let i = 0; i < 30; i++) {
      const resident = residents[Math.floor(Math.random() * residents.length)];
      const visitorName = visitorNames[Math.floor(Math.random() * visitorNames.length)];
      const purpose = purposes[Math.floor(Math.random() * purposes.length)];
      
      // Generate dates: 10 past, 10 today, 10 future
      let expectedDate, status, checkInTime, checkOutTime, approvedBy;
      
      if (i < 10) {
        // Past visitors (checked-out)
        const daysAgo = Math.floor(Math.random() * 7) + 1;
        expectedDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        expectedDate.setHours(10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
        status = 'checked-out';
        checkInTime = new Date(expectedDate.getTime() + Math.floor(Math.random() * 30) * 60 * 1000);
        checkOutTime = new Date(checkInTime.getTime() + (2 + Math.floor(Math.random() * 4)) * 60 * 60 * 1000);
        approvedBy = admin?._id;
      } else if (i < 20) {
        // Today's visitors (mix of statuses)
        expectedDate = new Date(now);
        expectedDate.setHours(10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
        
        const rand = Math.random();
        if (rand < 0.3) {
          status = 'Pending';
        } else if (rand < 0.6) {
          status = 'Approved';
          approvedBy = admin?._id;
        } else {
          status = 'checked-in';
          approvedBy = admin?._id;
          checkInTime = new Date(expectedDate.getTime() + Math.floor(Math.random() * 30) * 60 * 1000);
        }
      } else {
        // Future visitors (pending or approved)
        const daysAhead = Math.floor(Math.random() * 7) + 1;
        expectedDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
        expectedDate.setHours(10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
        
        status = Math.random() < 0.5 ? 'Pending' : 'Approved';
        if (status === 'Approved') {
          approvedBy = admin?._id;
        }
      }

      // Generate phone number
      const phone = `98230${12345 + i}`;
      
      // Vehicle number (50% chance)
      const vehicleNumber = Math.random() < 0.5 ? `MH12${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${1000 + Math.floor(Math.random() * 9000)}` : null;
      
      // Guest count
      const guestCount = purpose.includes('Party') || purpose.includes('Family') ? 
                        2 + Math.floor(Math.random() * 4) : 1;

      visitorRecords.push({
        visitorName,
        phone,
        purpose,
        residentId: resident._id,
        flatNumber: resident.flatNumber,
        expectedDate,
        checkInTime: checkInTime || null,
        checkOutTime: checkOutTime || null,
        status,
        vehicleNumber,
        guestCount,
        approvedBy: approvedBy || null,
        createdAt: new Date(expectedDate.getTime() - 24 * 60 * 60 * 1000), // Created 1 day before expected
        updatedAt: new Date(),
      });
    }

    await Visitor.insertMany(visitorRecords);

    // Calculate statistics
    const totalRecords = visitorRecords.length;
    const statusCounts = {
      'Pending': visitorRecords.filter(r => r.status === 'Pending').length,
      'Approved': visitorRecords.filter(r => r.status === 'Approved').length,
      'checked-in': visitorRecords.filter(r => r.status === 'checked-in').length,
      'checked-out': visitorRecords.filter(r => r.status === 'checked-out').length,
    };

    console.log(`✔  Successfully created ${totalRecords} visitor records`);
    console.log(`\n   Status Distribution:`);
    console.log(`   - Pending: ${statusCounts['Pending']}`);
    console.log(`   - Approved: ${statusCounts['Approved']}`);
    console.log(`   - Checked In: ${statusCounts['checked-in']}`);
    console.log(`   - Checked Out: ${statusCounts['checked-out']}`);
    console.log(`\n   Time Distribution:`);
    console.log(`   - Past Visitors: 10`);
    console.log(`   - Today's Visitors: 10`);
    console.log(`   - Future Visitors: 10`);

  } catch (err) {
    console.error('✖  Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✔  Disconnected from MongoDB');
  }
}

seedVisitors();
