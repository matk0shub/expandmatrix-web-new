import Image from 'next/image';

import { getPartners } from '@/data/partners.server';
import type { NormalizedPartner } from '@/types/partners';

export const revalidate = 60;

export default async function PartnersPage() {
  const { partners } = await getPartners();
  const partnerList: NormalizedPartner[] = Array.isArray(partners) ? partners : [];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Partners Showcase</h1>
        <p className="text-sm text-gray-500">
          Pulled from the Payload <code>partners</code> collection using the Local API.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {partnerList.length === 0 ? (
          <p className="text-sm text-gray-600">No partners are published yet.</p>
        ) : (
          partnerList.map((partner) => (
            <article key={partner.id} className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white/70 p-4 shadow-sm">
              <div className="relative flex h-28 w-40 items-center justify-center">
                {partner.logo?.url ? (
                  <Image
                    src={partner.logo.url}
                    alt={partner.logo.alt ?? partner.name ?? 'Partner logo'}
                    fill
                    sizes="160px"
                    className="object-contain"
                  />
                ) : (
                  <span className="text-sm text-gray-500">Logo pending</span>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-lg font-medium">{partner.name ?? 'Unnamed partner'}</h2>
                {partner.scale ? (
                  <p className="text-xs text-gray-500">Scale factor: {partner.scale.toFixed(2)}</p>
                ) : null}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
