#!/usr/bin/env node
import { MongoClient } from 'mongodb';
import fs from 'node:fs/promises';
import path from 'node:path';

const uri = process.env.DATABASE_URI;
if (!uri) {
  console.error('DATABASE_URI not set. Aborting.');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
});

try {
  await client.connect();
  const db = client.db();
  const mediaCollection = db.collection('payload-media');
  const docs = await mediaCollection.find({}).project({ filename: 1, sizes: 1 }).toArray();

  const referenced = new Set();

  for (const doc of docs) {
    if (doc?.filename) {
      referenced.add(doc.filename);
    }

    const sizes = doc?.sizes;
    if (sizes && typeof sizes === 'object') {
      for (const value of Object.values(sizes)) {
        if (value && typeof value === 'object' && value.filename) {
          referenced.add(value.filename);
        }
      }
    }
  }

  const mediaDir = path.join(process.cwd(), 'media');
  const files = await fs.readdir(mediaDir);

  const unused = files.filter((file) => file !== '.gitkeep' && !referenced.has(file));

  if (!unused.length) {
    console.log('No unused media files found.');
  } else {
    for (const file of unused) {
      const target = path.join(mediaDir, file);
      await fs.unlink(target);
      console.log(`Removed ${file}`);
    }
    console.log(`Removed ${unused.length} unused media file(s).`);
  }
} catch (error) {
  console.error('Failed to prune media files:', error);
  process.exitCode = 1;
} finally {
  await client.close().catch(() => {});
}
