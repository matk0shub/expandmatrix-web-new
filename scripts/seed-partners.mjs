import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

const envPath = path.join(projectRoot, '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

if (!process.env.PAYLOAD_SECRET || !process.env.DATABASE_URI) {
  console.error('Missing PAYLOAD_SECRET or DATABASE_URI. Aborting partners seed.');
  process.exit(1);
}

const logoEntries = [
  { name: 'Anthropic', file: 'images/partners/anthropic.svg', alt: 'Anthropic', scale: 0.78, order: 1 },
  { name: 'Augment', file: 'images/partners/augment.svg', alt: 'Augment AI', scale: 0.82, order: 2 },
  { name: 'Claude', file: 'images/partners/claude.svg', alt: 'Claude AI', scale: 0.82, order: 3 },
  { name: 'Copilot', file: 'images/partners/copilot.svg', alt: 'GitHub Copilot', scale: 0.74, order: 4 },
  { name: 'Cursor', file: 'images/partners/cursor.svg', alt: 'Cursor', scale: 0.76, order: 5 },
  { name: 'Gemini', file: 'images/partners/gemini.svg', alt: 'Google Gemini', scale: 0.8, order: 6 },
  { name: 'Grok', file: 'images/partners/grok.svg', alt: 'xAI Grok', scale: 0.8, order: 7 },
  { name: 'Kimi', file: 'images/partners/kimi.svg', alt: 'Kimi AI', scale: 0.82, order: 8 },
  { name: 'Kling', file: 'images/partners/kling-color.svg', alt: 'Kling AI', scale: 0.86, order: 9 },
  { name: 'MiniMax', file: 'images/partners/minimax.svg', alt: 'MiniMax', scale: 0.8, order: 10 },
  { name: 'n8n', file: 'images/partners/n8n_logo.svg', alt: 'n8n Automation', scale: 0.75, order: 11 },
  { name: 'Ollama', file: 'images/partners/ollama.svg', alt: 'Ollama', scale: 0.8, order: 12 },
  { name: 'OpenAI', file: 'images/partners/openai_logo.svg', alt: 'OpenAI', scale: 0.72, order: 13 },
  { name: 'Sora', file: 'images/partners/sora.svg', alt: 'OpenAI Sora', scale: 0.8, order: 14 },
];

const readLocalAsset = (relativePath) => {
  const absolutePath = path.join(publicDir, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing logo asset at ${relativePath}`);
  }

  const buffer = fs.readFileSync(absolutePath);
  const extension = path.extname(absolutePath).toLowerCase();
  const mimeType =
    extension === '.svg'
      ? 'image/svg+xml'
      : extension === '.png'
        ? 'image/png'
        : extension === '.jpg' || extension === '.jpeg'
          ? 'image/jpeg'
          : extension === '.webp'
            ? 'image/webp'
            : 'application/octet-stream';

  return {
    buffer,
    mimeType,
    filename: path.basename(absolutePath),
  };
};

const { default: payload } = await import('payload');
const configModule = await import(path.join(projectRoot, 'payload.config.js'));
const config = configModule.default ?? configModule;

await payload.init({
  config,
  local: true,
});

const findMediaByFilename = async (filename) => {
  const result = await payload.find({
    collection: 'media',
    where: {
      filename: {
        equals: filename,
      },
    },
    limit: 1,
  });

  if (result.totalDocs > 0) {
    const doc = result.docs[0];
    return {
      id: doc.id ?? doc._id,
      doc,
    };
  }

  return { id: null, doc: null };
};

const ensureMediaAsset = async (entry) => {
  const { filename, buffer, mimeType } = readLocalAsset(entry.file);
  const existing = await findMediaByFilename(filename);

  if (existing.id) {
    await payload.update({
      collection: 'media',
      id: existing.id,
      data: {
        alt: entry.alt,
      },
      file: {
        name: filename,
        data: buffer,
        size: buffer.length,
        mimetype: mimeType,
      },
    });
    return existing.id;
  }

  const created = await payload.create({
    collection: 'media',
    data: {
      alt: entry.alt,
    },
    file: {
      name: filename,
      data: buffer,
      size: buffer.length,
      mimetype: mimeType,
    },
  });

  return created.id ?? created._id;
};

const upsertPartner = async (entry) => {
  const logoId = await ensureMediaAsset(entry);

  const existing = await payload.find({
    collection: 'partners',
    where: {
      name: {
        equals: entry.name,
      },
    },
    limit: 1,
    locale: 'all',
  });

  const baseData = {
    name: entry.name,
    logo: logoId,
    logoAlt: entry.alt,
    scale: entry.scale,
    order: entry.order,
    showOnSite: true,
  };

  if (existing.totalDocs > 0) {
    const doc = existing.docs[0];
    const id = doc.id ?? doc._id;
    await payload.update({
      collection: 'partners',
      id,
      data: baseData,
    });
    return { action: 'updated', id };
  }

  const created = await payload.create({
    collection: 'partners',
    data: baseData,
  });

  return { action: 'created', id: created.id ?? created._id };
};

const allowedNames = new Set(logoEntries.map((entry) => entry.name.toLowerCase()));

try {
  const summary = { created: 0, updated: 0, removed: 0 };
  for (const entry of logoEntries) {
    const result = await upsertPartner(entry);
    summary[result.action] += 1;
    console.log(`${result.action.toUpperCase()}: ${entry.name} (${result.id})`);
  }

  const existingPartners = await payload.find({
    collection: 'partners',
    limit: 200,
    locale: 'all',
  });

  for (const partner of existingPartners.docs) {
    const id = partner.id ?? partner._id;
    if (!id) {
      continue;
    }

    const name = String(partner.name ?? '').toLowerCase();
    if (!allowedNames.has(name)) {
      await payload.delete({ collection: 'partners', id });
      summary.removed += 1;
      console.log(`REMOVED: ${partner.name} (${id})`);
    }
  }

  console.log('Partners seed finished', summary);
} catch (error) {
  console.error('Failed to seed partners:', error);
  process.exitCode = 1;
} finally {
  const client =
    payload?.db?.connection?.getClient?.() ??
    payload?.db?.client ??
    payload?.db?.connection?.client ??
    null;
  await client?.close?.();
}
