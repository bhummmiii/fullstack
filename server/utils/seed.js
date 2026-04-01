/**
 * seed.js  –  Populate the database with demo data for Om Sai Apartment
 *
 * Usage:  node utils/seed.js
 * Requires: MONGO_URI to be set in ../.env
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const User        = require('../models/User');
const Complaint   = require('../models/Complaint');
const Notice      = require('../models/Notice');
const Maintenance = require('../models/Maintenance');
const Visitor     = require('../models/Visitor');

// ─── Demo users ──────────────────────────────────────────────────────────────
const USERS = [
  { name: 'Jayawant Gore',  email: 'admin@society.com',    password: 'demo123', phone: '+91 98765 43210', flatNumber: 'A-101', role: 'admin'    },
  { name: 'Priya Sharma',   email: 'resident@society.com', password: 'demo123', phone: '+91 87654 32109', flatNumber: 'B-204', role: 'resident' },
  { name: 'Amit Patel',     email: 'amit@society.com',     password: 'demo123', phone: '+91 76543 21098', flatNumber: 'C-302', role: 'resident' },
  { name: 'Sunita Reddy',   email: 'sunita@society.com',   password: 'demo123', phone: '+91 65432 10987', flatNumber: 'A-105', role: 'resident' },
  { name: 'Vikram Singh',   email: 'vikram@society.com',   password: 'demo123', phone: '+91 54321 09876', flatNumber: 'B-101', role: 'resident' },
  { name: 'Meena Joshi',    email: 'meena@society.com',    password: 'demo123', phone: '+91 43210 98765', flatNumber: 'A-203', role: 'resident' },
  { name: 'Rahul Gupta',    email: 'rahul@society.com',    password: 'demo123', phone: '+91 32109 87654', flatNumber: 'D-401', role: 'resident' },
  { name: 'Anjali Mehta',   email: 'anjali@society.com',   password: 'demo123', phone: '+91 21098 76543', flatNumber: 'E-102', role: 'resident' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ── Clear existing data ──────────────────────────────────────────────────
    console.log('🗑  Clearing existing data…');
    await Promise.all([
      User.deleteMany({}),
      Complaint.deleteMany({}),
      Notice.deleteMany({}),
      Maintenance.deleteMany({}),
      Visitor.deleteMany({}),
    ]);

    // ── Create users ─────────────────────────────────────────────────────────
    console.log('👤 Creating users…');
    const createdUsers = await User.create(USERS);
    const admin = createdUsers.find(u => u.role === 'admin');
    const residents = createdUsers.filter(u => u.role === 'resident');
    console.log(`   Created ${createdUsers.length} users`);

    // ── Create notices ────────────────────────────────────────────────────────
    console.log('📢 Creating notices…');
    const notices = await Notice.create([
      {
        title: 'Society General Meeting – January 2026',
        description: 'All residents are kindly requested to attend the society general meeting scheduled for 25th January 2026 at 7:00 PM in the community hall. Agenda: Water supply improvements, parking allocation, and budget review.',
        type: 'meeting', priority: 'important', isPinned: true, postedBy: admin._id,
      },
      {
        title: 'Maintenance Payment Due by 31st January',
        description: 'This is a reminder that the monthly maintenance charge of ₹5,000 is due by 31st January 2026. Please pay via UPI/Bank Transfer to avoid a late fee of ₹200. Contact the admin for any payment issues.',
        type: 'payment', priority: 'important', isPinned: false, postedBy: admin._id,
      },
      {
        title: 'Water Supply Disruption – Sunday 26th January',
        description: 'Due to planned municipal maintenance work, there will be a water supply disruption on Sunday, 26th January from 6:00 AM to 2:00 PM. Please store adequate water beforehand. We apologise for the inconvenience.',
        type: 'alert', priority: 'important', isPinned: false, postedBy: admin._id,
      },
      {
        title: 'New Security Guard Deployment',
        description: 'We are pleased to announce that two new security guards have been deployed for night duty (10 PM – 6 AM) starting 20th January. All residents are requested to cooperate and register their regular visitors.',
        type: 'general', priority: 'normal', isPinned: false, postedBy: admin._id,
      },
      {
        title: 'Diwali Celebration in the Society',
        description: 'The society committee is organising a Diwali celebration on the society premises. All residents and their families are invited. Details: Date – 1st November, Time – 7 PM onwards, Venue – Society garden.',
        type: 'event', priority: 'normal', isPinned: false, postedBy: admin._id,
      },
    ]);
    console.log(`   Created ${notices.length} notices`);

    // ── Create complaints ─────────────────────────────────────────────────────
    console.log('⚠️  Creating complaints…');
    const complaints = await Complaint.create([
      {
        title: 'Water leakage in common area',
        description: 'There is significant water leakage near the main entrance causing slippery conditions and water wastage. The pipe near the lobby has been dripping for 3 days.',
        category: 'water', priority: 'high', status: 'In Progress',
        residentId: residents[0]._id, flatNumber: residents[0].flatNumber, assignedTo: 'Ravi (Plumber)',
      },
      {
        title: 'Elevator not working on Floor 3',
        description: 'The elevator button on the 3rd floor is not responding. Elderly residents and residents with children are facing significant difficulties. The issue has been present for 2 days.',
        category: 'maintenance', priority: 'urgent', status: 'Open',
        residentId: residents[1]._id, flatNumber: residents[1].flatNumber,
      },
      {
        title: 'Street light not working near Block A parking',
        description: 'The street light near Block A parking area has been non-functional for the past week. This creates security concerns especially during night time.',
        category: 'electricity', priority: 'medium', status: 'In Progress',
        residentId: residents[2]._id, flatNumber: residents[2].flatNumber, assignedTo: 'Kumar (Electrician)',
      },
      {
        title: 'Parking dispute with Flat C-301',
        description: 'The resident of Flat C-301 is regularly parking in my designated spot (Slot B-7). Despite verbal requests, the issue persists. Request formal intervention.',
        category: 'parking', priority: 'low', status: 'Open',
        residentId: residents[3]._id, flatNumber: residents[3].flatNumber,
      },
      {
        title: 'Garden maintenance required',
        description: 'The society garden needs trimming and the plants need regular watering. The garden area looks neglected.',
        category: 'maintenance', priority: 'low', status: 'Resolved',
        residentId: residents[4]._id, flatNumber: residents[4].flatNumber,
        resolvedDate: new Date(Date.now() - 4 * 24 * 3600 * 1000),
      },
      {
        title: 'Noise complaint against Flat D-402',
        description: 'Loud music and parties from Flat D-402 frequently disturb the entire floor, especially on weekends after midnight.',
        category: 'noise', priority: 'medium', status: 'Open',
        residentId: residents[5]._id, flatNumber: residents[5].flatNumber,
      },
    ]);
    console.log(`   Created ${complaints.length} complaints`);

    // ── Create maintenance records ────────────────────────────────────────────
    console.log('💰 Creating maintenance records…');
    const months = ['October 2025', 'November 2025', 'December 2025', 'January 2026'];
    const maintenanceRecords = [];
    for (const resident of residents) {
      for (let mi = 0; mi < months.length; mi++) {
        const month = months[mi];
        const isPaid = mi < 3; // all except January paid
        maintenanceRecords.push({
          residentId: resident._id,
          flatNumber: resident.flatNumber,
          amount: 5000,
          month,
          dueDate: new Date(2026, mi - 3, 10), // rough due dates
          status: isPaid ? 'Paid' : 'Unpaid',
          paymentDate: isPaid ? new Date(Date.now() - (3 - mi) * 30 * 24 * 3600 * 1000) : null,
          paymentMethod: isPaid ? 'UPI' : null,
          generatedBy: admin._id,
        });
      }
    }
    await Maintenance.create(maintenanceRecords);
    console.log(`   Created ${maintenanceRecords.length} maintenance records`);

    // ── Create visitor records ────────────────────────────────────────────────
    console.log('🚪 Creating visitor records…');
    await Visitor.create([
      {
        visitorName: 'Ravi Kumar (Plumber)', phone: '+91 99887 76655',
        purpose: 'Plumbing repair – water leakage', expectedDate: new Date(Date.now() + 1 * 3600 * 1000),
        status: 'Approved', residentId: residents[0]._id, flatNumber: residents[0].flatNumber, guestCount: 1,
      },
      {
        visitorName: 'Ramesh Delivery', phone: '+91 88776 65544',
        purpose: 'Package delivery from Amazon', expectedDate: new Date(Date.now() - 2 * 3600 * 1000),
        status: 'checked-out', residentId: residents[1]._id, flatNumber: residents[1].flatNumber, guestCount: 1,
        checkInTime: new Date(Date.now() - 2 * 3600 * 1000), checkOutTime: new Date(Date.now() - 1.5 * 3600 * 1000),
      },
      {
        visitorName: 'Sharma Family', phone: '+91 77665 54433',
        purpose: 'Family visit for birthday celebration', expectedDate: new Date(Date.now() + 24 * 3600 * 1000),
        status: 'Pending', residentId: residents[2]._id, flatNumber: residents[2].flatNumber, guestCount: 4,
      },
      {
        visitorName: 'Dr. Patel', phone: '+91 66554 43322',
        purpose: 'Home doctor visit', expectedDate: new Date(Date.now() + 3 * 3600 * 1000),
        status: 'Approved', residentId: residents[3]._id, flatNumber: residents[3].flatNumber, guestCount: 1,
      },
    ]);
    console.log('   Created 4 visitor records');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('─────────────────────────────────────────');
    console.log('  Login credentials:');
    console.log('  Admin:    admin@society.com    / demo123');
    console.log('  Resident: resident@society.com / demo123');
    console.log('─────────────────────────────────────────\n');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
