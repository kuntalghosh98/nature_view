export type Localized = { en?: string; bn?: string };

export type EventItem = {
  _id?: string;
  title: Localized;
  slug: string;
  summary?: Localized;
  body?: Localized;
  location?: string;
  startDate?: string | null;
  endDate?: string | null;
  registrationUrl?: string;
  featuredImage?: string | { _id: string; url: string } | null;
  status?: "demo" | "upcoming" | "on-going" | "completed";
  isFeatured?: boolean;
  isPublished?: boolean;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type EventListResponse = {
  success: boolean;
  data: {
    featured: EventItem[];
    items: EventItem[];
  } | EventItem[];
};
