export type ContactSubmission = {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ContactResponse = {
  success: boolean;
  data: ContactSubmission;
};
