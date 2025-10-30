import { getPayloadClient } from '@/payload/getPayloadClient'

// Fire-and-forget prewarm to avoid paying init cost on the first user request
// Safe in both dev and prod; failures are swallowed and fallback content is used
void getPayloadClient().catch(() => {});


