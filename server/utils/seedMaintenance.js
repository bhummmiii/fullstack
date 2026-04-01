/**
 * seedMaintenance.js – Create maintenance payment records for all residents
 *
 * Usage:
 *   node server/utils/seedMaintenance.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const Maintenance = require('../models/Maintenance');
const User = require('../models/User');

async function seedMaintenance() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔  Connected to MongoDB');

    // Check if maintenance records already exist
    const existingCount = await Maintenance.countDocuments();
    if (existingCount > 0) {
      console.log(`✔  ${existingCount} maintenance records already exist`);
      console.log('   Skipping seed to avoid duplicates');
      return;
    }

    // Get all residents
    const residents = await User.find({ role: 'resident' }).sort({ flatNumber: 1 });
    if (residents.length === 0) {
      console.error('✖  No residents found. Please run seedResidents.js first.');
      process.exit(1);
    }

    // Get admin for generatedBy field
    const admin = await User.findOne({ role: 'admin' });

    // Generate maintenance records for last 3 months
    const months = [
      { name: 'January 2026', dueDate: new Date('2026-01-10'), isPast: true },
      { name: 'February 2026', dueDate: new Date('2026-02-10'), isPast: true },
      { name: 'March 2026', dueDate: new Date('2026-03-10'), isPast: false },
    ];

    const maintenanceRecords = [];
    const baseAmount = 3500; // Base maintenance amount

    for (const resident of residents) {
      for (let i = 0; i < months.length; i++) {
        const month = months[i];
        
        // Vary amount slightly based on flat size (A, B, C, D, E blocks)
        const block = resident.flatNumber.charAt(0);
        let amount = baseAmount;
        if (block === 'A' || block === 'B') amount = 3500;
        else if (block === 'C' || block === 'D') amount = 4000;
        else if (block === 'E') amount = 4500;

        // Determine status and payment details
        let status, paymentDate, paymentMethod, transactionId;
        
        if (i === 0) {
          // January - 80% paid, 20% overdue
          const isPaid = Math.random() < 0.8;
          status = isPaid ? 'Paid' : 'Overdue';
          if (isPaid) {
            paymentDate = new Date('2026-01-08');
            paymentMethod = ['UPI', 'Bank Transfer', 'Cash'][Math.floor(Math.random() * 3)];
            transactionId = paymentMethod === 'UPI' ? `UPI${Math.floor(Math.random() * 1000000000)}` : 
                           paymentMethod === 'Bank Transfer' ? `TXN${Math.floor(Math.random() * 1000000000)}` : null;
          }
        } else if (i === 1) {
          // February - 70% paid, 30% unpaid
          const isPaid = Math.random() < 0.7;
          status = isPaid ? 'Paid' : 'Unpaid';
          if (isPaid) {
            paymentDate = new Date('2026-02-09');
            paymentMethod = ['UPI', 'Bank Transfer', 'Cheque'][Math.floor(Math.random() * 3)];
            transactionId = paymentMethod === 'UPI' ? `UPI${Math.floor(Math.random() * 1000000000)}` : 
                           paymentMethod === 'Bank Transfer' ? `TXN${Math.floor(Math.random() * 1000000000)}` :
                           paymentMethod === 'Cheque' ? `CHQ${Math.floor(Math.random() * 100000)}` : null;
          }
        } else {
          // March - 40% paid, 60% unpaid (current month)
          const isPaid = Math.random() < 0.4;
          status = isPaid ? 'Paid' : 'Unpaid';
          if (isPaid) {
            paymentDate = new Date('2026-03-08');
            paymentMethod = ['UPI', 'Bank Transfer'][Math.floor(Math.random() * 2)];
            transactionId = paymentMethod === 'UPI' ? `UPI${Math.floor(Math.random() * 1000000000)}` : 
                           `TXN${Math.floor(Math.random() * 1000000000)}`;
          }
        }

        maintenanceRecords.push({
          residentId: resident._id,
          flatNumber: resident.flatNumber,
          amount,
          month: month.name,
          status,
          dueDate: month.dueDate,
          paymentDate: paymentDate || null,
          paymentMethod: paymentMethod || null,
          transactionId: transactionId || null,
          generatedBy: admin?._id,
          createdAt: new Date(month.dueDate.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days before due date
          updatedAt: new Date(),
        });
      }
    }

    await Maintenance.insertMany(maintenanceRecords);

    // Calculate statistics
    const totalRecords = maintenanceRecords.length;
    const paidCount = maintenanceRecords.filter(r => r.status === 'Paid').length;
    const unpaidCount = maintenanceRecords.filter(r => r.status === 'Unpaid').length;
    const overdueCount = maintenanceRecords.filter(r => r.status === 'Overdue').length;

    console.log(`✔  Successfully created ${totalRecords} maintenance records`);
    console.log(`\n   Statistics:`);
    console.log(`   - Total Records: ${totalRecords}`);
    console.log(`   - Paid: ${paidCount} (${((paidCount/totalRecords)*100).toFixed(1)}%)`);
    console.log(`   - Unpaid: ${unpaidCount} (${((unpaidCount/totalRecords)*100).toFixed(1)}%)`);
    console.log(`   - Overdue: ${overdueCount} (${((overdueCount/totalRecords)*100).toFixed(1)}%)`);
    console.log(`\n   Months covered:`);
    console.log(`   - January 2026`);
    console.log(`   - February 2026`);
    console.log(`   - March 2026`);
    console.log(`\n   Amount range: ₹3,500 - ₹4,500 per flat`);

  } catch (err) {
    console.error('✖  Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✔  Disconnected from MongoDB');
  }
}

seedMaintenance();
