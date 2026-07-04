export type Localized = { en?: string; bn?: string };

export type AttractionMedia = {
  _id: string;
  url: string;
  filename?: string;
};

export type Attraction = {
  _id?: string;
  title: Localized;
  slug: string;
  summary?: Localized;
  body?: Localized;
  gallery?: Array<string | AttractionMedia>;
  featuredImage?: string | AttractionMedia | null;
  status?: "demo" | "upcoming" | "on-going" | "completed";
  isFeatured?: boolean;
  isPublished?: boolean;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AttractionListResponse = {
  success: boolean;
  data: {
    featured: Attraction[];
    items: Attraction[];
  } | Attraction[];
};
