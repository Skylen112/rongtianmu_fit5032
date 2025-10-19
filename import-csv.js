// import-json.js (ESM version for JSON file)
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

console.log('Starting JSON import...');

// Load service account key (use createRequire if needed, but fs is fine for JSON)
const serviceAccountPath = path.resolve('./serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: 'mymentalhub-8a81d'  // Your project ID
});
const db = getFirestore(app);

// JSON path (adjust if needed, e.g., './src/assets/Contact.json')
const jsonFilePath = './src/assets/Contact.json';

if (!fs.existsSync(jsonFilePath)) {
  console.error(`File not found: ${jsonFilePath}`);
  console.log('Please check the path or create the JSON file.');
  process.exit(1);
}

console.log(`Reading JSON from: ${jsonFilePath}`);

// Read and parse JSON (assume it's an array of objects like [{id: '1', name: 'John', ...}])
const rawData = fs.readFileSync(jsonFilePath, 'utf8');
const contacts = JSON.parse(rawData);

if (!Array.isArray(contacts)) {
  console.error('JSON must be an array of objects.');
  process.exit(1);
}

console.log(`Found ${contacts.length} contacts to import.`);

// Default freeTime slots
const freeTime = [
  { start: '09:00', end: '10:00', status: 'available' },
  { start: '10:00', end: '11:00', status: 'available' },
  { start: '12:00', end: '13:00', status: 'available' },
  { start: '13:00', end: '14:00', status: 'available' },
  { start: '14:00', end: '15:00', status: 'available' },
  { start: '15:00', end: '16:00', status: 'available' },
  { start: '16:00', end: '17:00', status: 'available' },
];

// Import each contact
for (const row of contacts) {
  const { "Employee ID": id, "Name": name, "Email": email, "Phone": phone } = row;

  //default value
  const finalId = id || `default_${Date.now() + Math.random()}`;
  const finalName = name || 'Unknown Mentor';
  const finalEmail = email ? email.trim() : '';
  const finalPhone = phone ? phone.trim() : '';

  if (!finalId || !finalName) {
    console.warn(`Skipping invalid row: ${JSON.stringify(row)}`);
    continue;
  }

  try {
    // Insert into timetables collection (doc ID = id)
    await db.collection('timetables').doc(id).set({
      employeeId: finalId,
      name: finalName,
      email: finalEmail,
      phone: finalPhone,
      date: new Date().toISOString().split('T')[0],  // Current date
      freeTime,
      createdAt: FieldValue.serverTimestamp()
    });
    console.log(`Import successful: ${name} (${id})`);
  } catch (error) {
    console.error(`Failed to import ${name}:`, error.message);
  }
}

console.log('Testing read...');
const testQuery = await db.collection('timetables').get();
console.log(`Found ${testQuery.size} docs in timetables.`);
testQuery.forEach(doc => {
  console.log(`Doc ID: ${doc.id}, Name: ${doc.data().name}`);
});

console.log('Import completed!');
process.exit(0);
