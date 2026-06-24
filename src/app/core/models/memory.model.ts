export type MemoryCategory =
  | 'birth'
  | 'first-smile'
  | 'first-laugh'
  | 'first-tooth'
  | 'first-crawl'
  | 'first-walk'
  | 'first-word'
  | 'first-birthday'
  | 'first-school'
  | 'family-trip'
  | 'celebration'
  | 'milestone'
  | 'everyday'
  | 'other';

export interface Memory {
  id: string;
  title: string;
  date: string;           // ISO date string 'YYYY-MM-DD'
  category: MemoryCategory;
  notes: string;
  photos: string[];       // base64 data URIs
  createdAt: string;
  updatedAt: string;
}

export interface ChildProfile {
  name: string;
  dateOfBirth: string;    // ISO date 'YYYY-MM-DD'
  gender: 'boy' | 'girl' | 'prefer-not-to-say';
  photoUri?: string;      // base64 avatar
}

export interface AppData {
  version: number;
  child: ChildProfile | null;
  memories: Memory[];
  exportedAt?: string;
}

export const CATEGORY_META: Record<MemoryCategory, { label: string; icon: string; color: string }> = {
  'birth':          { label: 'Birth',            icon: 'heart',             color: '#e8a090' },
  'first-smile':    { label: 'First Smile',      icon: 'happy',             color: '#f0c060' },
  'first-laugh':    { label: 'First Laugh',      icon: 'happy-outline',     color: '#f0c060' },
  'first-tooth':    { label: 'First Tooth',      icon: 'star',              color: '#90c0d4' },
  'first-crawl':    { label: 'First Crawl',      icon: 'footsteps',         color: '#a0d4a0' },
  'first-walk':     { label: 'First Walk',       icon: 'walk',              color: '#a0d4a0' },
  'first-word':     { label: 'First Word',       icon: 'chatbubble',        color: '#d4a0d0' },
  'first-birthday': { label: '1st Birthday',     icon: 'gift',              color: '#f0a0b0' },
  'first-school':   { label: 'First School',     icon: 'school',            color: '#90b0e0' },
  'family-trip':    { label: 'Family Trip',      icon: 'airplane',          color: '#90b8e0' },
  'celebration':    { label: 'Celebration',      icon: 'balloon',           color: '#f0b080' },
  'milestone':      { label: 'Milestone',        icon: 'ribbon',            color: '#c090d8' },
  'everyday':       { label: 'Everyday',         icon: 'camera',            color: '#a8c8a8' },
  'other':          { label: 'Other',            icon: 'ellipse',           color: '#c0b8b0' },
};
