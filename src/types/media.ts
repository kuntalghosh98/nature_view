export type MediaItem = {
  _id: string;
  filename: string;
  url: string;
  type?: string;
  size?: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  alt?: string;
  tags?: string[];
  language?: string;
  createdAt?: string;
  updatedAt?: string;
};
