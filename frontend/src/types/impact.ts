export type Localized = { en?: string; bn?: string };

export type ImpactMetric = {
  _id?: string;
  title?: Localized;
  value: string;
  description?: Localized;
  isHighlighted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ImpactListResponse = {
  success: boolean;
  data: ImpactMetric[];
};
