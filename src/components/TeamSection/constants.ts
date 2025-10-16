import type { Narrative, TeamCardTheme } from './types';

export const SPOTLIGHT_ORDER = ['Matěj Štipčák', 'Matěj Venclík', 'Jakub Hrůza'];
export const FALLBACK_LOCALE = 'cs';

export const CARD_NARRATIVES: Record<string, Narrative> = {
  'Matěj Štipčák': {
    cs: 'Velí autopilotům, které loví klienty dřív, než mu stihne vychladnout espresso.',
    en: 'Commands the autopilots that charm clients before his espresso cools down.',
  },
  'Matěj Venclík': {
    cs: 'Trénuje agentní mozky, aby držely kurz — a občas je učí i říkat prosím.',
    en: 'Coaches agent minds to stay on course—and occasionally reminds them to say please.',
  },
  'Jakub Hrůza': {
    cs: 'Hlídá, aby náš AI loď plula v rytmu, i když vývojáři spí.',
    en: 'Keeps the AI mothership on tempo even while the engineers are asleep.',
  },
};

export const CARD_THEMES: TeamCardTheme[] = [
  {
    wrapperClass: '',
    glowStyle: 'radial-gradient(circle at 32% 22%, rgba(0, 166, 124, 0.55), transparent 72%)',
    frameGradient: 'linear-gradient(145deg, #041a16, #020e0c 60%, #010807)',
    headerOverlay: 'linear-gradient(180deg, rgba(0, 166, 124, 0.35), rgba(0, 54, 44, 0.05))',
    accentBorder: 'border-emerald-300/45',
    accentGlow: 'bg-[radial-gradient(circle,rgba(0,166,124,0.35),transparent_65%)]',
  },
  {
    wrapperClass: '',
    glowStyle: 'radial-gradient(circle at 55% 28%, rgba(0, 208, 150, 0.58), transparent 70%)',
    frameGradient: 'linear-gradient(150deg, #031815, #010d0b 55%, #010807)',
    headerOverlay: 'linear-gradient(180deg, rgba(0, 195, 142, 0.32), rgba(0, 46, 37, 0.08))',
    accentBorder: 'border-emerald-200/45',
    accentGlow: 'bg-[radial-gradient(circle,rgba(0,195,142,0.32),transparent_65%)]',
  },
  {
    wrapperClass: '',
    glowStyle: 'radial-gradient(circle at 72% 80%, rgba(0, 180, 135, 0.5), transparent 70%)',
    frameGradient: 'linear-gradient(150deg, #041916, #020e0c 55%, #010807)',
    headerOverlay: 'linear-gradient(180deg, rgba(0, 180, 135, 0.3), rgba(0, 40, 32, 0.08))',
    accentBorder: 'border-emerald-300/40',
    accentGlow: 'bg-[radial-gradient(circle,rgba(0,180,135,0.32),transparent_65%)]',
  },
];

export const getLocalizedCopy = <T extends Record<string, string>>(dictionary: T, locale: string) => {
  return (
    dictionary[locale as keyof T] ??
    dictionary[FALLBACK_LOCALE as unknown as keyof T] ??
    Object.values(dictionary)[0]
  );
};

