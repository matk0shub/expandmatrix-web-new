/**
 * Team member data and configuration
 * Centralized place for team information
 */

export interface TeamMember {
  name: string;
  position: string;
  bio: string;
  image: string;
  linkedin: string;
  email: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Jan Novák",
    position: "CEO & AI Strategist",
    bio: "Více než 10 let zkušeností s AI a business strategií. Specializuje se na implementaci AI řešení do podnikových procesů.",
    image: "JN",
    linkedin: "#",
    email: "jan@expandmatrix.cz"
  },
  {
    name: "Marie Svobodová",
    position: "Lead Developer",
    bio: "Expert na moderní webové technologie a AI implementace. Vede tým vývojářů a zajišťuje kvalitu kódu.",
    image: "MS",
    linkedin: "#",
    email: "marie@expandmatrix.cz"
  },
  {
    name: "Petr Dvořák",
    position: "AI Engineer",
    bio: "Specialista na machine learning a AI algoritmy. Vytváří inteligentní řešení pro naše klienty.",
    image: "PD",
    linkedin: "#",
    email: "petr@expandmatrix.cz"
  },
  {
    name: "Anna Kratochvílová",
    position: "UX/UI Designer",
    bio: "Kreativní designérka s vášní pro uživatelsky přívětivé rozhraní. Zajišťuje, že naše řešení vypadají skvěle.",
    image: "AK",
    linkedin: "#",
    email: "anna@expandmatrix.cz"
  }
];
