const XLSX = require('xlsx');
const path = require('path');

// Read the Excel file
const workbook = XLSX.readFile(path.join(__dirname, '..', '..', 'Residents data.xlsx'));
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('Total residents:', data.length);
console.log('\n=== RESIDENT DATA ===\n');

data.forEach((row, index) => {
  console.log(`${index + 1}. ${JSON.stringify(row, null, 2)}`);
});
