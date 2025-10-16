import type { TeamMember } from '@/hooks/useTeamMembers';

export type Narrative = Record<string, string>;

export type TeamCardTheme = {
  wrapperClass?: string;
  glowStyle: string;
  frameGradient: string;
  headerOverlay: string;
  accentBorder: string;
  accentGlow: string;
};

export type TeamSpotlightCardProps = {
  member: TeamMember;
  locale: string;
  narrative?: Narrative;
  theme: TeamCardTheme;
};

export type TeamCardsGridProps = {
  members: TeamMember[];
  locale: string;
};

