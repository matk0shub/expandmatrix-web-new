export interface FAQ {
  id: string;
  question: {
    cs: string;
    en: string;
  };
  answer: {
    cs: string;
    en: string;
  };
  order: number;
  showOnSite: boolean;
  isFeatured: boolean;
  questionTitle?: string;
  createdAt?: string;
  updatedAt?: string;
  _status?: string;
}
