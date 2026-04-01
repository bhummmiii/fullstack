/**
 * importResidents.js – Standalone script to import residents from an Excel file
 *
 * Usage:
 *   node server/utils/importResidents.js [path-to-excel-file]
 *
 * Default path (if no argument given):
 *   C:/Users/Asus/Downloads/residents.xlsx
 *
 * Expected Excel columns (header row, case-insensitive):
 *   Name      → name
 *   Email     → email
 *   Flat No   → flatNumber   (also accepts "FlatNo", "Flat Number", "flat_no")
 *   Phone     → phone        (also accepts "Mobile", "Contact")
 *
 * Behaviour:
 *  - Skips rows where BOTH email AND flatNumber already exist in the database.
 *  - Assigns a default password that the resident should change on first login.
 *  - Sets role = "resident" and isActive = true for every imported user.
 *
 * IMPORTANT: Run from the server/ directory:
 *   cd server
 *   node utils/importResidents.js
 *   node utils/importResidents.js "C:/Users/Asus/Downloads/myfile.xlsx"
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const path = require('path');
const XLSX = require('xlsx');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ─── Config ───────────────────────────────────────────────────────────────────

/** Default Excel file path */
const DEFAULT_FILE = 'C:/Users/Asus/Downloads/residents.xlsx';

/**
 * Generate a default password for a resident.
 * Format: flatNumber + "@123"  e.g. "A-101@123"
 * The resident should change this after first login.
 */
function generatePassword(flatNumber) {
  return `${flatNumber}@123`;
}

// ─── Column name normaliser ───────────────────────────────────────────────────

/**
 * Maps a raw Excel header string to one of our known field keys.
 * Accepts common variations so the script is robust to minor formatting
 * differences in the spreadsheet.
 */
function normaliseHeader(raw) {
  const h = String(raw).toLowerCase().replace(/[\s_\-]/g, '');
  if (h === 'name') return 'name';
  if (['email', 'emailaddress', 'emailid'].includes(h)) return 'email';
  if (['flatno', 'flatnumber', 'flat', 'flatno.'].includes(h)) return 'flatNumber';
  if (['phone', 'mobile', 'contact', 'phoneno', 'mobileno', 'contactnumber', 'mobilenumber', 'phonenumber'].includes(h)) return 'phone';
  return null; // unknown column – ignored
}

// ─── Row validator ────────────────────────────────────────────────────────────

function validateRow(row, index) {
  const errors = [];
  if (!row.name || String(row.name).trim().length < 2) {
    errors.push(`Row ${index + 2}: "Name" is missing or too short`);
  }
  if (!row.email || !/^\S+@\S+\.\S+$/.test(String(row.email).trim())) {
    errors.push(`Row ${index + 2}: "Email" is missing or invalid`);
  }
  if (!row.flatNumber || String(row.flatNumber).trim() === '') {
    errors.push(`Row ${index + 2}: "Flat No" is missing`);
  }
  return errors;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function importResidents() {
  const filePath = process.argv[2] || DEFAULT_FILE;

  // 1. Read Excel file
  let workbook;
  try {
    workbook = XLSX.readFile(filePath);
    console.log(`✔  Opened Excel file: ${filePath}`);
  } catch {
    console.error(`✖  Cannot open file: ${filePath}`);
    console.error('   Check that the file exists and the path is correct.');
    process.exit(1);
  }

  // 2. Parse first sheet
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  if (rawRows.length === 0) {
    console.error('✖  The Excel sheet is empty.');
    process.exit(1);
  }

  // 3. Normalise column names
  const normalisedRows = rawRows.map((raw) => {
    const row = {};
    for (const [key, value] of Object.entries(raw)) {
      const field = normaliseHeader(key);
      if (field) row[field] = String(value).trim();
    }
    return row;
  });

  // 4. Validate rows; print warnings but continue with valid rows
  const validRows = [];
  normalisedRows.forEach((row, i) => {
    const errors = validateRow(row, i);
    if (errors.length > 0) {
      errors.forEach((e) => console.warn(`⚠  Skipping – ${e}`));
    } else {
      validRows.push(row);
    }
  });

  console.log(`   Total rows in sheet : ${rawRows.length}`);
  console.log(`   Valid rows          : ${validRows.length}`);

  if (validRows.length === 0) {
    console.error('✖  No valid rows to import.');
    process.exit(1);
  }

  // 5. Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✔  Connected to MongoDB');

  // 6. Build duplicate-check sets (email + flatNumber already in DB)
  const existingEmails = new Set(
    (await User.find({}, 'email').lean()).map((u) => u.email.toLowerCase()),
  );
  const existingFlats = new Set(
    (await User.find({}, 'flatNumber').lean()).map((u) => u.flatNumber.toLowerCase()),
  );

  // 7. Separate new from duplicate rows
  const toInsert = [];
  const skipped = [];

  for (const row of validRows) {
    const emailLower = row.email.toLowerCase();
    const flatLower = row.flatNumber.toLowerCase();

    if (existingEmails.has(emailLower)) {
      skipped.push({ reason: 'duplicate email', ...row });
      continue;
    }
    if (existingFlats.has(flatLower)) {
      skipped.push({ reason: 'duplicate flatNumber', ...row });
      continue;
    }

    // Password = flatNumber + "@123", hashed individually
    const rawPassword = generatePassword(row.flatNumber);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    toInsert.push({
      name: row.name,
      email: emailLower,
      password: hashedPassword,
      phone: row.phone || '',
      flatNumber: row.flatNumber,
      role: 'resident',
      profileImage: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Track to catch intra-file duplicates
    existingEmails.add(emailLower);
    existingFlats.add(flatLower);
  }

  // 8. Insert
  if (toInsert.length === 0) {
    console.log('ℹ  All valid rows already exist in the database. Nothing imported.');
  } else {
    await User.collection.insertMany(toInsert);
    console.log(`✔  Inserted ${toInsert.length} resident(s) successfully`);
    console.log('   Default password   : <flatNumber>@123  e.g. "A-101@123" ← residents should change this');
  }

  if (skipped.length > 0) {
    console.log(`⚠  Skipped ${skipped.length} duplicate row(s):`);
    skipped.forEach((s) => console.log(`   - ${s.email} / ${s.flatNumber} (${s.reason})`));
  }

  await mongoose.disconnect();
  console.log('✔  Done');
}

importResidents().catch((err) => {
  console.error('✖  Unexpected error:', err.message);
  process.exit(1);
});
