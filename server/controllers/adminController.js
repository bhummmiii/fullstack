/**
 * adminController.js – Admin-only operations
 *
 * POST /api/admin/import-residents
 *   Accepts a multipart Excel file upload (.xlsx / .xls), parses it with xlsx,
 *   validates each row, deduplicates against existing DB records,
 *   generates per-resident passwords (flatNumber@123), and inserts new residents.
 *   Deletes the temporary uploaded file after processing.
 */

const fs = require('fs');
const XLSX = require('xlsx');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Generate a default password for a resident.
 * Format: flatNumber + "@123"  e.g. "A-101@123"
 */
function generatePassword(flatNumber) {
  return `${flatNumber}@123`;
}

/** Maps raw Excel header → model field name (case/space-insensitive). */
function normaliseHeader(raw) {
  const h = String(raw).toLowerCase().replace(/[\s_\-]/g, '');
  if (h === 'name') return 'name';
  if (['email', 'emailaddress', 'emailid'].includes(h)) return 'email';
  if (['flatno', 'flatnumber', 'flat', 'flatno.'].includes(h)) return 'flatNumber';
  if (['phone', 'mobile', 'contact', 'phoneno', 'mobileno', 'contactnumber', 'mobilenumber', 'phonenumber'].includes(h)) return 'phone';
  return null;
}

/** Returns an array of validation error strings for a single row. */
function validateRow(row, rowIndex) {
  const errors = [];
  if (!row.name || String(row.name).trim().length < 2) {
    errors.push(`Row ${rowIndex + 2}: "Name" is missing or too short`);
  }
  if (!row.email || !/^\S+@\S+\.\S+$/.test(String(row.email).trim())) {
    errors.push(`Row ${rowIndex + 2}: "Email" is missing or invalid`);
  }
  if (!row.flatNumber || String(row.flatNumber).trim() === '') {
    errors.push(`Row ${rowIndex + 2}: "Flat No" is missing`);
  }
  return errors;
}

// ─── @desc   Import residents from an uploaded Excel file (admin only)
// ─── @route  POST /api/admin/import-residents
// ─── @access Admin
const importResidents = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please attach an Excel file (.xlsx or .xls).',
      });
    }

    // ── 1. Parse Excel from the saved disk file ───────────────────────────
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (!rawRows || rawRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'The uploaded Excel sheet is empty.',
      });
    }

    // ── 2. Normalise column names ───────────────────────────────────────────
    const normalisedRows = rawRows.map((raw) => {
      const row = {};
      for (const [key, value] of Object.entries(raw)) {
        const field = normaliseHeader(key);
        if (field) row[field] = String(value).trim();
      }
      return row;
    });

    // ── 3. Validate rows ────────────────────────────────────────────────────
    const validationErrors = [];
    const validRows = [];

    normalisedRows.forEach((row, i) => {
      const errs = validateRow(row, i);
      if (errs.length > 0) {
        validationErrors.push(...errs);
      } else {
        validRows.push(row);
      }
    });

    if (validRows.length === 0) {
      return res.status(422).json({
        success: false,
        message: 'No valid rows found in the Excel file.',
        errors: validationErrors,
      });
    }

    // ── 4. Load existing emails + flatNumbers for deduplication ────────────
    const existingEmails = new Set(
      (await User.find({}, 'email').lean()).map((u) => u.email.toLowerCase()),
    );
    const existingFlats = new Set(
      (await User.find({}, 'flatNumber').lean()).map((u) => u.flatNumber.toLowerCase()),
    );

    // ── 5. Build insert list, track duplicates ──────────────────────────────
    const toInsert = [];
    const duplicates = [];

    for (const row of validRows) {
      const emailLower = row.email.toLowerCase();
      const flatLower = row.flatNumber.toLowerCase();

      if (existingEmails.has(emailLower)) {
        duplicates.push({ email: row.email, flatNumber: row.flatNumber, reason: 'duplicate email' });
        continue;
      }
      if (existingFlats.has(flatLower)) {
        duplicates.push({ email: row.email, flatNumber: row.flatNumber, reason: 'duplicate flatNumber' });
        continue;
      }

      // Password = flatNumber + "@123", e.g. "A-101@123"
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

      // Prevent intra-file duplicates
      existingEmails.add(emailLower);
      existingFlats.add(flatLower);
    }

    // ── 6. Insert ───────────────────────────────────────────────────────────
    if (toInsert.length > 0) {
      await User.collection.insertMany(toInsert);
    }

    // ── 7. Delete the temporary uploaded file ──────────────────────────────
    try {
      fs.unlinkSync(req.file.path);
    } catch (_) {
      // Non-fatal: temp file cleanup failure should not affect the response
    }

    return res.status(200).json({
      success: true,
      residentsImported: toInsert.length,
      duplicatesSkipped: duplicates.length,
      validationWarnings: validationErrors.length > 0 ? validationErrors : undefined,
      duplicates: duplicates.length > 0 ? duplicates : undefined,
    });
  } catch (err) {
    // Best-effort cleanup on error too
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }
    next(err);
  }
};

module.exports = { importResidents };
