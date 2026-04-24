import type { Metadata } from 'next';

import { getTeamMembers } from '@/data/teamMembers.server';
import type { NormalizedTeamMember } from '@/types/team';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Team | Expand Matrix',
  description:
    'Meet the people behind Expand Matrix — AI architects, system engineers and implementation specialists building production-grade AI agents.',
  alternates: { canonical: 'https://expandmatrix.com/team' },
  robots: { index: true, follow: true },
};

export default async function TeamPage() {
  const { members } = await getTeamMembers({ locale: 'en', featuredOnly: false });
  const teamMembers: NormalizedTeamMember[] = Array.isArray(members) ? members : [];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Team Directory</h1>
        <p className="text-sm text-gray-500">
          Listing generated from Payload&apos;s <code>teamMembers</code> collection via the Local API.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {teamMembers.length === 0 ? (
          <p className="text-sm text-gray-600">No team members are published yet.</p>
        ) : (
          teamMembers.map((member) => (
            <article key={member.id} className="rounded-lg border border-gray-200 bg-white/70 p-4 shadow-sm">
              <header>
                <h2 className="text-xl font-medium">{member.name}</h2>
                <p className="text-sm text-gray-600">{member.role}</p>
              </header>

              {member.bio ? (
                <p className="mt-3 text-sm leading-relaxed text-gray-700">{member.bio}</p>
              ) : null}

              {member.focus.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-gray-600">
                  {member.focus.map((focusItem) => (
                    <li
                      key={`${member.id}-${focusItem}`}
                      className="rounded-md border border-gray-300 px-2 py-1"
                    >
                      {focusItem}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
