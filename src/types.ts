export type Category = 'jobs' | 'results' | 'admit' | 'admission' | 'scheme' | 'cert' | 'state' | 'central';

export interface GovLink {
  id: string;
  title: string;
  org: string;
  description: string;
  url: string;
  notificationUrl?: string;
  category: Category;
  tags: string[];
  createdAt: any; // Firestore Timestamp
  updatedAt: any;
}

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'jobs', label: 'नौकरी', icon: '💼' },
  { id: 'results', label: 'Results', icon: '📋' },
  { id: 'admit', label: 'Admit', icon: '🪪' },
  { id: 'admission', label: 'Admission', icon: '🎓' },
  { id: 'scheme', label: 'Yojana', icon: '🏛' },
  { id: 'cert', label: 'Certificate', icon: '📜' },
  { id: 'state', label: 'State', icon: '🗺' },
  { id: 'central', label: 'Central', icon: '🏢' },
];
