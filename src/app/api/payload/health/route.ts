import { NextResponse } from 'next/server';
import { serverLog } from '@/utils/serverLog'

import { getPayloadClient } from '@/payload/getPayloadClient';

export async function GET() {
  const startedAt = Date.now();
  try {
    serverLog('[health] checking Payload and MongoDB ping...')
    const payload = await getPayloadClient();

    const payloadDb = (payload as { db?: { connection?: unknown; client?: unknown } })?.db;
    if (!payloadDb) {
      throw new Error('Payload database adapter missing');
    }

    const connection = payloadDb.connection as
      | {
          db?: { admin: () => { command: (input: unknown) => Promise<unknown> } };
          getClient?: () => { db: (name?: string) => { command: (input: unknown) => Promise<unknown> } };
        }
      | undefined;

    const directClient = (payloadDb as {
      client?: { db: (name?: string) => { command: (input: unknown) => Promise<unknown> } };
    }).client;

    if (connection?.db?.admin) {
      await connection.db.admin().command({ ping: 1 });
    } else if (connection?.getClient) {
      await connection.getClient().db().command({ ping: 1 });
    } else if (directClient?.db) {
      await directClient.db().command({ ping: 1 });
    } else {
      throw new Error('Unable to resolve a MongoDB client from Payload connection');
    }

    const latencyMs = Date.now() - startedAt;

    serverLog('[health] ok', { latencyMs })
    return NextResponse.json({
      status: 'ok',
      latencyMs,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown Payload health error';
    serverLog('[health] error', message)
    return NextResponse.json(
      {
        status: 'error',
        message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
