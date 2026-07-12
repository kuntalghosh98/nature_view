export type Localized = { en?: string; bn?: string };

export type TeamMember = {
  _id?: string;
  name?: Localized;
  role?: Localized;
  bio?: Localized;
  photo?: string | { _id: string; url: string } | null;
  socials?: Record<string, string>;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TeamListResponse = {
  success: boolean;
  data: TeamMember[];
};
