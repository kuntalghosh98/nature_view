export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthState = {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
};
