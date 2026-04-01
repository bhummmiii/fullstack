/**
 * seedAdmin.js – Create or update the admin user
 *
 * Usage:
 *   node server/utils/seedAdmin.js
 *
 * What it does:
 *  1. Connects to MongoDB using MONGO_URI from .env
 *  2. Looks for an existing user with role "admin"
 *  3. If found  → updates the name to "Jayawant Gore"
 *  4. If NOT found → creates a new admin user with default credentials
 *
 * Default credentials (only used when no admin exists):
 *   Email   : admin@society.com
 *   Password: Admin@1234
 *   Flat    : ADMIN-001
 *
 * IMPORTANT: Run this script from the server/ directory:
 *   cd server
 *   node utils/seedAdmin.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const ADMIN_NAME = 'Jayawant Gore';

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔  Connected to MongoDB');

    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      // ── Update existing admin's name ────────────────────────────────────
      existingAdmin.name = ADMIN_NAME;
      // Use updateOne so the pre-save password-hash hook is NOT triggered
      await User.updateOne({ _id: existingAdmin._id }, { $set: { name: ADMIN_NAME } });
      console.log(`✔  Admin name updated → "${ADMIN_NAME}"`);
      console.log(`   Email      : ${existingAdmin.email}`);
      console.log(`   Flat No    : ${existingAdmin.flatNumber}`);
    } else {
      // ── Create a brand-new admin ────────────────────────────────────────
      const DEFAULT_PASSWORD = 'Admin@1234';
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

      // Bypass pre-save hook by inserting directly so we control the hash
      await User.collection.insertOne({
        name: ADMIN_NAME,
        email: 'admin@society.com',
        password: hashedPassword,
        phone: '',
        flatNumber: 'ADMIN-001',
        role: 'admin',
        profileImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✔  New admin created`);
      console.log(`   Name       : ${ADMIN_NAME}`);
      console.log(`   Email      : admin@society.com`);
      console.log(`   Password   : ${DEFAULT_PASSWORD}   ← change this after first login`);
      console.log(`   Flat No    : ADMIN-001`);
    }
  } catch (err) {
    console.error('✖  Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✔  Disconnected from MongoDB');
  }
}

seedAdmin();
