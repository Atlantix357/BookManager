export interface Book {
  id?: number;
  title: string;
  author?: string;
  genre?: string;
  language: string;
  readStatus: 'Read' | 'Unread' | 'Did not finish';
  bookType?: 'Paper' | 'E-book' | 'Audiobook';
  coverImage?: string;
  dateOfReading?: string;
  rating?: number;
  comment?: string;
  favorite?: boolean;
  publisher?: string;
  publishDate?: string;
}

export type ThemeMode = 'light' | 'dark';

export interface Filters {
  title: string;
  author: string;
  genre: string;
  language: string;
  readStatus: string;
  bookType: string;
  publisher: string;
  favorite: boolean;
}

export interface ColumnVisibility {
  favorite: boolean;
  title: boolean;
  author: boolean;
  publisher: boolean;
  publishDate: boolean;
  genre: boolean;
  language: boolean;
  bookType: boolean;
  readStatus: boolean;
  dateOfReading: boolean;
  rating: boolean;
  actions: boolean;
}

export const GENRES = [
  'Fiction',
  'Non-Fiction'
];

export const LANGUAGES = [
  'English',
  'Ukrainian'
];
