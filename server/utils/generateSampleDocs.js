/**
 * generateSampleDocs.js
 * Creates minimal but valid PDF files for the 5 sample documents
 * shown in the Documents section of the Housing Society Hub.
 *
 * PDFs are created as simple 1-page text documents without any
 * external library (pure Buffer / string manipulation).
 *
 * Usage: node utils/generateSampleDocs.js
 */

const fs   = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'documents');

// Ensure the directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

/**
 * Builds a minimal but valid single-page PDF containing `text`.
 * No external dependency required.
 */
function buildPdf(title, lines) {
  const body = [title, '', ...lines].join('\n');

  // PDF objects
  const stream = `BT\n/F1 14 Tf\n50 750 Td\n(${title.replace(/[()\\]/g, '\\$&')}) Tj\n/F1 11 Tf\n0 -30 Td\n${lines.map(l => `(${l.replace(/[()\\]/g, '\\$&')}) Tj\n0 -18 Td`).join('\n')}\nET`;

  const objects = [];

  objects[0] = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`;
  objects[1] = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj`;
  objects[2] = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842]\n   /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj`;
  objects[3] = `4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`;
  objects[4] = `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`;

  const header = `%PDF-1.4\n`;
  let offset = header.length;

  const offsets = [];
  const body_parts = objects.map((obj, i) => {
    offsets.push(offset);
    const part = obj + '\n';
    offset += part.length;
    return part;
  });

  const xrefOffset = offset;
  const xref = [
    `xref\n0 ${objects.length + 1}\n`,
    `0000000000 65535 f \n`,
    ...offsets.map(o => `${String(o).padStart(10, '0')} 00000 n \n`),
  ].join('');

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return header + body_parts.join('') + xref + trailer;
}

const DOCS = [
  {
    filename: 'society-bylaws-2024.pdf',
    title:    'Om Sai Apartment — Society Bylaws 2024',
    lines: [
      'Document: Society Bylaws and Rules & Regulations',
      'Version:  2024 (Revised)',
      'Prepared by: Managing Committee',
      '',
      'Section 1 – Membership',
      'All flat owners and tenants are members of the society.',
      '',
      'Section 2 – Maintenance Charges',
      'Monthly maintenance of Rs. 5,000 is applicable per flat.',
      '',
      'Section 3 – Common Area Usage',
      'Common areas must be kept clean and noise-free after 10 PM.',
      '',
      'Section 4 – Complaint Resolution',
      'All complaints must be registered via the society portal.',
    ],
  },
  {
    filename: 'agm-minutes-2024.pdf',
    title:    'Annual General Meeting Minutes — Jan 2024',
    lines: [
      'Date:     5 January 2024',
      'Venue:    Society Clubhouse, Ground Floor',
      'Chairman: Jayawant Gore (Secretary)',
      '',
      'Agenda Items Discussed:',
      '1. Review of maintenance collection for 2023 (92% collected)',
      '2. Approval of annual budget 2024',
      '3. Election of new committee members',
      '4. Proposal to install CCTV in parking area',
      '5. Approval of playground renovation project',
      '',
      'Resolutions Passed:',
      '- Budget of Rs. 12,00,000 approved for FY 2024',
      '- CCTV installation approved (3 cameras, parking area)',
    ],
  },
  {
    filename: 'financial-report-q4-2023.pdf',
    title:    'Financial Report — Q4 2023 (Oct–Dec)',
    lines: [
      'Period:   October 2023 – December 2023',
      'Prepared: Jayawant Gore (Treasurer)',
      '',
      'Income',
      '  Maintenance Collections  :  Rs. 1,20,000',
      '  Late Fee / Penalties      :  Rs.    4,500',
      '  Hall Booking Revenue      :  Rs.    8,000',
      '  Total Income              :  Rs. 1,32,500',
      '',
      'Expenditure',
      '  Housekeeping & Sanitation :  Rs.  35,000',
      '  Electricity (Common Area) :  Rs.  22,000',
      '  Security Guards           :  Rs.  30,000',
      '  Maintenance & Repairs     :  Rs.  18,000',
      '  Total Expenditure         :  Rs. 1,05,000',
      '',
      'Net Surplus (Q4 2023)       :  Rs.  27,500',
    ],
  },
  {
    filename: 'parking-rules-circular.pdf',
    title:    'Circular — New Parking Allocation Rules',
    lines: [
      'Date:  5 January 2024',
      'From:  Managing Committee, Om Sai Apartment',
      'To:    All Residents',
      '',
      'Subject: Revised Parking Rules (effective 15 Jan 2024)',
      '',
      '1. Each flat is entitled to ONE designated parking slot.',
      '2. Visitor parking is available on the western side (max 2 hrs).',
      '3. Two-wheelers must park in the designated two-wheeler zone.',
      '4. Unauthorised parking may attract a penalty of Rs. 500.',
      '5. All vehicles must display the society parking sticker.',
      '',
      'For queries contact the office: society@omsaiapt.com',
    ],
  },
  {
    filename: 'committee-meeting-dec-2023.pdf',
    title:    'Monthly Committee Meeting Minutes — Dec 2023',
    lines: [
      'Date:     28 December 2023',
      'Venue:    Secretary Office, Om Sai Apartment',
      'Present:  Jayawant Gore, 4 committee members',
      '',
      'Points Discussed:',
      '1. Water pump maintenance scheduled for 5 Jan 2024',
      '2. Lift servicing pending – contractor to visit by 10 Jan',
      '3. Pending maintenance dues: 3 flats (follow-up letters sent)',
      '4. Garden renovation quote received – decision deferred to AGM',
      '5. New year celebration budget of Rs. 8,000 approved',
      '',
      'Next Meeting: 28 January 2024',
    ],
  },
];

let created = 0;
for (const doc of DOCS) {
  const filePath = path.join(DOCS_DIR, doc.filename);
  if (!fs.existsSync(filePath)) {
    const pdfContent = buildPdf(doc.title, doc.lines);
    fs.writeFileSync(filePath, pdfContent, 'latin1');
    console.log(`  ✔  Created  : ${doc.filename}`);
    created++;
  } else {
    console.log(`  –  Exists   : ${doc.filename}  (skipped)`);
  }
}

console.log(`\n✔  Done. ${created} new PDF file(s) created in server/documents/`);
