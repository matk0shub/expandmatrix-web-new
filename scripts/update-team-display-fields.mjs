#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const possibleEnvFiles = ['.env'];
for (const envFile of possibleEnvFiles) {
  const envPath = path.join(projectRoot, envFile);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

if (!process.env.PAYLOAD_SECRET || !process.env.DATABASE_URI) {
  console.error(
    'Missing PAYLOAD_SECRET or DATABASE_URI. Ensure environment variables are set before running the update script.',
  );
  process.exit(1);
}

const { default: payload } = await import('payload');
const configModule = await import(path.join(projectRoot, 'payload.config.js'));
const config = await configModule.default;

await payload.init({
  config,
  local: true,
});

console.log('🔄 Updating team members with display fields...')

try {
  // Get all team members
  const teamMembers = await payload.find({
    collection: 'teamMembers',
    limit: 100,
    depth: 0,
  });

  console.log(`📋 Found ${teamMembers.docs.length} team members`)

  for (const member of teamMembers.docs) {
    console.log(`👤 Updating ${member.id}...`)

    const updateData = {};

    // Update displayName
    if (member.name && typeof member.name === 'object') {
      updateData.displayName = member.name.cs || member.name.en || 'Unknown';
    } else if (member.name) {
      updateData.displayName = member.name;
    }

    // Update roleDisplay
    if (member.role && typeof member.role === 'object') {
      updateData.roleDisplay = member.role.cs || member.role.en || 'Unknown';
    } else if (member.role) {
      updateData.roleDisplay = member.role;
    }

    // Update the team member
    if (Object.keys(updateData).length > 0) {
      await payload.update({
        collection: 'teamMembers',
        id: member.id,
        data: updateData
      });

      console.log(`✅ Updated ${member.id} with display fields`)
    } else {
      console.log(`⚠️ No update needed for ${member.id}`)
    }
  }

  console.log('🎉 All team members updated successfully!')

} catch (error) {
  console.error('❌ Error updating team members:', error)
  process.exitCode = 1;
} finally {
  const client = payload?.db?.connection?.getClient?.() ?? payload?.db?.client;
  await client?.close?.();
}
