export type Localized = { en?: string; bn?: string };

export type NewsMedia = {
  _id: string;
  url: string;
  filename?: string;
};

export type NewsItem = {
  _id?: string;
  title: Localized;
  slug: string;
  summary?: Localized;
  body?: Localized;
  featuredImage?: string | NewsMedia | null;
  isFeatured?: boolean;
  isPublished?: boolean;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type NewsListResponse = {
  success: boolean;
  data: {
    featured: NewsItem[];
    items: NewsItem[];
  } | NewsItem[];
};
