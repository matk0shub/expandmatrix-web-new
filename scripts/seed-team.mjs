import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const possibleEnvFiles = ['.env.local', '.env'];
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

const sampleDocs = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src', 'data', 'teamMembers.json'), 'utf-8'),
);

function normalizeFocus(focus = [], locale = 'en') {
  return focus.map((item) => ({
    id: item.id,
    value: item.value?.[locale] ?? item.value?.en ?? item.value?.cs ?? '',
  }));
}

function buildLocalizedData(sample, locale) {
  return {
    name: sample.name?.[locale] ?? sample.name?.en ?? sample.name?.cs ?? '',
    focus: normalizeFocus(sample.focus, locale),
  };
}

function buildSharedData(sample) {
  return {
    role: sample.role,
    bio: sample.bio,
    accent: sample.accent,
    socials: sample.socials,
    order: sample.order,
    featured: sample.featured,
    showOnSite: sample.showOnSite ?? true,
  };
}

async function upsertTeamMember(sample) {
  const existing = await payload.find({
    collection: 'teamMembers',
    where: {
      name: {
        equals: sample.name?.en ?? sample.name?.cs,
      },
    },
    limit: 1,
  });

  const sharedData = buildSharedData(sample);
  const englishData = {
    ...sharedData,
    ...buildLocalizedData(sample, 'en'),
  };
  const czechData = {
    ...sharedData,
    ...buildLocalizedData(sample, 'cs'),
  };

  if (existing.totalDocs > 0) {
    const existingDoc = existing.docs[0];
    await payload.update({
      collection: 'teamMembers',
      id: existingDoc.id,
      data: englishData,
      locale: 'en',
    });

    await payload.update({
      collection: 'teamMembers',
      id: existingDoc.id,
      data: czechData,
      locale: 'cs',
    });
    return { action: 'updated', id: existingDoc.id, name: sample.name?.cs ?? sample.name?.en };
  }

  const created = await payload.create({
    collection: 'teamMembers',
    data: englishData,
    locale: 'en',
  });

  await payload.update({
    collection: 'teamMembers',
    id: created.id,
    data: czechData,
    locale: 'cs',
  });

  return { action: 'created', id: created.id, name: sample.name?.cs ?? sample.name?.en };
}

try {
  const results = [];
  for (const doc of sampleDocs) {
    const result = await upsertTeamMember(doc);
    results.push(result);
  }

  const summary = results.reduce(
    (acc, result) => {
      acc[result.action] += 1;
      return acc;
    },
    { created: 0, updated: 0 },
  );

  console.log('Team seed complete:', summary);
  results.forEach((result) => {
    console.log(`- ${result.action.toUpperCase()}: ${result.name} (id: ${result.id})`);
  });
} catch (error) {
  console.error('Failed to seed team members:', error);
  process.exitCode = 1;
} finally {
  const client = payload?.db?.connection?.getClient?.() ?? payload?.db?.client;
  await client?.close?.();
}
