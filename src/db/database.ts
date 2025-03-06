import Dexie, { Table } from 'dexie';
import { Book } from '../types';

export class BookDatabase extends Dexie {
  books!: Table<Book>;

  constructor() {
    super('BookDatabase');
    this.version(4).stores({
      books: '++id, title, author, genre, language, readStatus, bookType, dateOfReading, rating, favorite, publisher, publishDate'
    });
  }
}

export const db = new BookDatabase();

// Add the missing addBook function
export const addBook = async (book: Book): Promise<number> => {
  return await db.books.add(book);
};

// Add other helper functions for CRUD operations
export const updateBook = async (book: Book): Promise<number> => {
  if (!book.id) throw new Error('Book ID is required for update');
  return await db.books.update(book.id, book);
};

export const deleteBook = async (id: number): Promise<void> => {
  return await db.books.delete(id);
};

export const getAllBooks = async (): Promise<Book[]> => {
  return await db.books.toArray();
};
