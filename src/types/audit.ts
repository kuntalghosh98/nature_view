export type AuditLog = {
  _id: string;
  userId?: string | null;
  userName: string;
  action: string;
  module: string;
  entityId?: string | null;
  entityTitle?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
