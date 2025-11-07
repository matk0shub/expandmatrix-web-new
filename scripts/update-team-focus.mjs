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
    'Missing PAYLOAD_SECRET or DATABASE_URI. Ensure environment variables are set before running the seed script.',
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

console.log('🔄 Updating team member focus areas...')

try {
  // Get all team members
  const teamMembers = await payload.find({
    collection: 'teamMembers',
    limit: 100,
  })

  console.log(`📋 Found ${teamMembers.docs.length} team members`)

  // Update each team member with focus areas
  for (const member of teamMembers.docs) {
    console.log(`👤 Updating ${member.name}...`)
    
    let focusAreas = []
    
    // Define focus areas based on member name
    if (member.name === 'Matěj Štipčák') {
      focusAreas = [
        {
          id: 'focus-1',
          value: {
            cs: 'Vývoj webových aplikací',
            en: 'Web Development'
          }
        },
        {
          id: 'focus-2',
          value: {
            cs: 'React & Next.js',
            en: 'React & Next.js'
          }
        },
        {
          id: 'focus-3',
          value: {
            cs: 'UI/UX Design',
            en: 'UI/UX Design'
          }
        }
      ]
    } else if (member.name === 'Matěj Venclík') {
      focusAreas = [
        {
          id: 'focus-1',
          value: {
            cs: 'Backend vývoj',
            en: 'Backend Development'
          }
        },
        {
          id: 'focus-2',
          value: {
            cs: 'Node.js & Express',
            en: 'Node.js & Express'
          }
        },
        {
          id: 'focus-3',
          value: {
            cs: 'Databázový design',
            en: 'Database Design'
          }
        }
      ]
    } else if (member.name === 'Expandee') {
      focusAreas = [
        {
          id: 'focus-1',
          value: {
            cs: 'AI & Machine Learning',
            en: 'AI & Machine Learning'
          }
        },
        {
          id: 'focus-2',
          value: {
            cs: 'Datová věda',
            en: 'Data Science'
          }
        },
        {
          id: 'focus-3',
          value: {
            cs: 'Python vývoj',
            en: 'Python Development'
          }
        }
      ]
    }

    // Update the team member with new group structure
    if (focusAreas.length > 0) {
      // Get current name values
      const currentName = member.name || {}
      
      await payload.update({
        collection: 'teamMembers',
        id: member.id,
        data: {
          name: {
            cs: currentName.cs || member.name || 'Unknown',
            en: currentName.en || member.name || 'Unknown'
          },
          focus: focusAreas.map(focus => ({
            id: focus.id,
            value: {
              cs: focus.value.cs,
              en: focus.value.en
            }
          }))
        }
      })
      
      console.log(`✅ Updated ${member.name} with focus areas`)
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
