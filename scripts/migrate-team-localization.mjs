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
    'Missing PAYLOAD_SECRET or DATABASE_URI. Ensure environment variables are set before running the migration script.',
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

console.log('🔄 Migrating team members from localized fields to group fields...')

try {
  // Get all team members
  const teamMembers = await payload.find({
    collection: 'teamMembers',
    limit: 100,
    depth: 0,
  });

  console.log(`📋 Found ${teamMembers.docs.length} team members`)

  for (const member of teamMembers.docs) {
    console.log(`👤 Migrating ${member.id}...`)

    // Check if data is already in group format
    const isGroupFormat = member.name && typeof member.name === 'object' && member.name.cs !== undefined;
    
    if (isGroupFormat) {
      console.log(`✅ ${member.id} already in group format, skipping`)
      continue;
    }

    // Migrate from localized to group format
    const updateData = {};

    // Migrate name field
    if (member.name) {
      if (typeof member.name === 'string') {
        updateData.name = {
          cs: member.name,
          en: member.name
        };
      } else if (typeof member.name === 'object') {
        updateData.name = {
          cs: member.name.cs || member.name.en || member.name || 'Unknown',
          en: member.name.en || member.name.cs || member.name || 'Unknown'
        };
      }
    }

    // Migrate role field
    if (member.role) {
      if (typeof member.role === 'string') {
        updateData.role = {
          cs: member.role,
          en: member.role
        };
      } else if (typeof member.role === 'object') {
        updateData.role = {
          cs: member.role.cs || member.role.en || member.role || 'Unknown',
          en: member.role.en || member.role.cs || member.role || 'Unknown'
        };
      }
    }

    // Migrate bio field
    if (member.bio) {
      if (typeof member.bio === 'string') {
        updateData.bio = {
          cs: member.bio,
          en: member.bio
        };
      } else if (typeof member.bio === 'object') {
        updateData.bio = {
          cs: member.bio.cs || member.bio.en || member.bio || '',
          en: member.bio.en || member.bio.cs || member.bio || ''
        };
      }
    }

    // Migrate focus field
    if (member.focus && Array.isArray(member.focus)) {
      updateData.focus = member.focus.map((item, index) => {
        if (typeof item === 'string') {
          return {
            id: `focus-${index}`,
            value: {
              cs: item,
              en: item
            }
          };
        } else if (item && typeof item === 'object') {
          return {
            id: item.id || `focus-${index}`,
            value: {
              cs: item.value?.cs || item.value?.en || item.value || item || 'Unknown',
              en: item.value?.en || item.value?.cs || item.value || item || 'Unknown'
            }
          };
        }
        return {
          id: `focus-${index}`,
          value: {
            cs: 'Unknown',
            en: 'Unknown'
          }
        };
      });
    }

    // Add display fields for admin interface
    if (updateData.name) {
      updateData.displayName = updateData.name.cs || updateData.name.en || 'Unknown';
    }
    if (updateData.role) {
      updateData.roleDisplay = updateData.role.cs || updateData.role.en || 'Unknown';
    }

    // Update the team member
    if (Object.keys(updateData).length > 0) {
      await payload.update({
        collection: 'teamMembers',
        id: member.id,
        data: updateData
      });

      console.log(`✅ Migrated ${member.id} successfully`)
    } else {
      console.log(`⚠️ No migration needed for ${member.id}`)
    }
  }

  console.log('🎉 All team members migrated successfully!')

} catch (error) {
  console.error('❌ Error migrating team members:', error)
  process.exitCode = 1;
} finally {
  const client = payload?.db?.connection?.getClient?.() ?? payload?.db?.client;
  await client?.close?.();
}
