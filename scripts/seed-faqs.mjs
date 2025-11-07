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

const sampleFaqsPath = path.join(projectRoot, 'src', 'data', 'faqs.json');
const sampleFaqs = JSON.parse(fs.readFileSync(sampleFaqsPath, 'utf-8'));

async function upsertFaq(sample) {
  const existing = await payload.find({
    collection: 'faqs',
    where: {
      'question.cs': {
        equals: sample.question.cs,
      },
    },
    limit: 1,
  });

  if (existing.totalDocs > 0) {
    const existingDoc = existing.docs[0];
    await payload.update({
      collection: 'faqs',
      id: existingDoc.id,
      data: {
        question: sample.question,
        answer: sample.answer,
        order: sample.order,
        showOnSite: sample.showOnSite ?? true,
        isFeatured: sample.isFeatured,
      },
    });
    return { action: 'updated', id: existingDoc.id };
  }

  const created = await payload.create({
    collection: 'faqs',
    data: {
      question: sample.question,
      answer: sample.answer,
      order: sample.order,
      showOnSite: sample.showOnSite ?? true,
      isFeatured: sample.isFeatured,
    },
  });

  return { action: 'created', id: created.id };
}

try {
  const results = [];
  for (const faq of sampleFaqs) {
    const result = await upsertFaq(faq);
    results.push({ ...result, question: faq.question.cs });
  }

  const summary = results.reduce(
    (acc, result) => {
      acc[result.action] += 1;
      return acc;
    },
    { created: 0, updated: 0 },
  );

  console.log('FAQ seed complete:', summary);
  results.forEach((result) => {
    console.log(`- ${result.action.toUpperCase()}: ${result.question} (id: ${result.id})`);
  });
} catch (error) {
  console.error('Failed to seed FAQs:', error);
  process.exitCode = 1;
} finally {
  const client = payload?.db?.connection?.getClient?.() ?? payload?.db?.client;
  await client?.close?.();
}
