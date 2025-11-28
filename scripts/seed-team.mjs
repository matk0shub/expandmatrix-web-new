import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

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

const sampleDocs = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src', 'data', 'teamMembers.json'), 'utf-8'),
);

const ensureLocalizedGroup = (group = {}) => ({
  cs: group?.cs ?? group?.en ?? '',
  en: group?.en ?? group?.cs ?? '',
});

function normalizeFocus(focus = []) {
  return focus.map((item) => ({
    id: item.id,
    value: {
      cs: item.label?.cs ?? item.label?.en ?? '',
      en: item.label?.en ?? item.label?.cs ?? '',
    },
  }));
}

const ensureAvatarPath = (sample) => {
  const directPath = typeof sample.avatarPath === 'string' ? sample.avatarPath : null;
  const legacyPath = sample.avatar?.file ?? sample.avatar?.url ?? null;
  const selected = directPath ?? legacyPath;

  if (!selected) {
    throw new Error(`Missing avatar path for ${sample.name?.cs ?? sample.name?.en ?? 'member'}`);
  }

  const normalized = selected.startsWith('/') ? selected : `/${selected}`;
  const diskPath = path.join(publicDir, normalized.replace(/^\/+/, ''));
  if (!fs.existsSync(diskPath)) {
    throw new Error(`Avatar asset not found on disk: ${normalized}`);
  }

  return normalized;
};

function buildTeamPayload(sample) {
  const avatarPath = ensureAvatarPath(sample);
  const payloadData = {
    name: ensureLocalizedGroup(sample.name),
    role: ensureLocalizedGroup(sample.role),
    bio: ensureLocalizedGroup(sample.bio),
    focus: normalizeFocus(sample.focus),
    accent: sample.accent,
    socials: sample.socials ?? {},
    order: typeof sample.order === 'number' ? sample.order : Number(sample.order ?? 0),
    featured: Boolean(sample.featured),
    showOnSite: sample.showOnSite ?? true,
    avatarPath,
  };

  return payloadData;
}

async function upsertTeamMember(sample) {
  const existing = await payload.find({
    collection: 'teamMembers',
    where: {
      'name.cs': {
        equals: sample.name?.cs ?? sample.name?.en,
      },
    },
    limit: 1,
  });

  let data
  try {
    data = buildTeamPayload(sample);
  } catch (error) {
    console.error('[seed:team] Failed to prepare payload data:', error);
    throw error;
  }

  if (existing.totalDocs > 0) {
    const existingDoc = existing.docs[0];
    await payload.update({
      collection: 'teamMembers',
      id: existingDoc.id,
      data,
    });
    return { action: 'updated', id: existingDoc.id, name: sample.name?.cs ?? sample.name?.en };
  }

  const created = await payload.create({
    collection: 'teamMembers',
    data,
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
