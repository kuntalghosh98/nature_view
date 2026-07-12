export type SearchItem = {
  _id: string;
  type: "project" | "attraction" | "news" | "event";
  title: string;
  summary: string;
  location?: string;
  slug: string;
  url: string;
  featuredImage?: string | null;
};

export type SearchResponse = {
  success: boolean;
  data: SearchItem[];
};