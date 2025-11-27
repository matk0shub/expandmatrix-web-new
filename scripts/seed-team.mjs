import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const mediaDir = path.join(projectRoot, 'media');

if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

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

const normalizeRelativePath = (value = '') => value.replace(/^\/+/, '');

const getMimeTypeFromExtension = (extension) => {
  switch (extension) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
};

const readLocalAsset = (relativePath = '') => {
  const normalized = normalizeRelativePath(relativePath);
  const absolutePath = path.join(publicDir, normalized);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing avatar asset at ${normalized}`);
  }

  const buffer = fs.readFileSync(absolutePath);
  const extension = path.extname(absolutePath).toLowerCase();

  return {
    buffer,
    filename: path.basename(absolutePath),
    mimeType: getMimeTypeFromExtension(extension),
  };
};

const { default: payload } = await import('payload');
const configModule = await import(path.join(projectRoot, 'payload.config.js'));
const config = await configModule.default;

await payload.init({
  config,
  local: true,
});

const findMediaByFilename = async (filename) => {
  if (!filename) {
    return { id: null, doc: null };
  }

  const existing = await payload.find({
    collection: 'media',
    where: {
      filename: {
        equals: filename,
      },
    },
    limit: 1,
  });

  if (existing.totalDocs > 0) {
    const doc = existing.docs[0];
    const diskFilename = doc.filename ?? filename;
    const diskPath = diskFilename ? path.join(mediaDir, diskFilename) : null;

    if (diskPath && fs.existsSync(diskPath)) {
      return { id: doc.id ?? doc._id, doc };
    }

    const identifier = doc.id ?? doc._id;
    if (identifier) {
      console.warn(
        `[seed:team] Media document "${diskFilename}" missing on disk, deleting and re-uploading.`,
      );
      await payload.delete({
        collection: 'media',
        id: identifier,
      });
    }
  }

  return { id: null, doc: null };
};

const ensureAvatarAsset = async (sample) => {
  const filePath = sample.avatar?.file ?? sample.avatar?.url;
  if (!filePath) {
    return null;
  }

  let asset;
  try {
    asset = readLocalAsset(filePath);
  } catch (error) {
    console.warn(
      `[seed:team] ${error instanceof Error ? error.message : error} for ${
        sample.name?.cs ?? sample.name?.en ?? 'unknown member'
      }`,
    );
    return null;
  }

  const filename = (sample.avatar?.filename ?? asset.filename).toLowerCase();
  const { id: existingId } = await findMediaByFilename(filename);

  const altText = sample.avatar?.alt ?? sample.name?.cs ?? sample.name?.en ?? 'Team member';

  const filePayload = {
    name: filename,
    data: asset.buffer,
    size: asset.buffer.length,
    mimetype: asset.mimeType,
  };

  if (existingId) {
    await payload.update({
      collection: 'media',
      id: existingId,
      data: { alt: altText },
      file: filePayload,
    });
    return existingId;
  }

  const created = await payload.create({
    collection: 'media',
    data: { alt: altText },
    file: filePayload,
  });

  return created.id ?? created._id;
};

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

function buildTeamPayload(sample, avatarId) {
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
  };

  if (avatarId) {
    payloadData.avatar = avatarId;
  }

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

  const avatarId = await ensureAvatarAsset(sample);
  const data = buildTeamPayload(sample, avatarId);

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
