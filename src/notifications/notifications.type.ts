export type SendMailParam = {
  message: string;
  to: string;
  from?: string;
  subject: string;
};

export type FindAllParam = {
  receiverId: string;
  isRead?: boolean;
  page?: number;
  take?: number;
};
