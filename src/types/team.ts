export type LocalizedValue = {
  cs?: string;
  en?: string;
  [locale: string]: string | undefined;
};

export type TeamMemberFocusItem = {
  id?: string;
  value?: LocalizedValue;
};

export type TeamMemberSocials = {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
};

export type TeamMemberMedia = {
  id?: string;
  url?: string;
  alt?: string;
  filename?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  sizes?: Record<
    string,
    {
      url?: string;
      width?: number;
      height?: number;
    }
  >;
} | null;

export interface TeamMemberDocument {
  id: string;
  name: LocalizedValue | string;
  role: {
    cs?: string;
    en?: string;
    [locale: string]: string | undefined;
  };
  bio?: LocalizedValue;
  focus?: TeamMemberFocusItem[];
  accent?: string;
  socials?: TeamMemberSocials;
  avatar?: TeamMemberMedia | string | null;
  order: number;
  featured: boolean;
  showOnSite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NormalizedTeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  focus: string[];
  accent?: string;
  socials: TeamMemberSocials;
  avatar?: {
    url: string;
    alt?: string;
  };
  order: number;
  featured: boolean;
  showOnSite: boolean;
}
