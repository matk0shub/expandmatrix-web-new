/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const envFiles = ['.env.local', '.env'];

for (const envFile of envFiles) {
  const fullPath = path.resolve(process.cwd(), envFile);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath });
  }
}

const uri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!uri) {
  throw new Error('DATABASE_URI/MONGODB_URI is not set');
}

async function reset() {
  console.log('[reset-admin] connecting to MongoDB...');
  await mongoose.connect(uri);
  const db = mongoose.connection;
  const hasCollection = await db.db
    .listCollections({ name: 'users' }, { nameOnly: true })
    .hasNext();

  if (!hasCollection) {
    console.log('[reset-admin] users collection not found, nothing to reset');
    await mongoose.disconnect();
    return;
  }

  const result = await db.collection('users').deleteMany({});
  console.log(`[reset-admin] deleted ${result.deletedCount} user documents`);
  await mongoose.disconnect();
  console.log('[reset-admin] done.');
}

reset().catch((error) => {
  console.error('[reset-admin] failed:', error);
  process.exit(1);
});
