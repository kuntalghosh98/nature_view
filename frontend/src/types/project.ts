export type Localized = { en?: string; bn?: string };

export type ProjectMedia = {
  _id: string;
  url: string;
  filename?: string;
};

export type Project = {
  _id?: string;
  title: Localized;
  slug: string;
  summary?: Localized;
  body?: Localized;
  gallery?: Array<string | ProjectMedia>;
  featuredImage?: string | ProjectMedia | null;
  isPublished?: boolean;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
