import React, { useState, useEffect } from 'react';
import { Button, Tabs, Typography, Flex, Card, Spin, Empty, Space } from 'antd';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import BookList from '../components/BookList';
import BookForm from '../components/BookForm';
import FilterBar from '../components/FilterBar';
import { Book, Filters, ColumnVisibility } from '../types';
import { db, addBook, updateBook, deleteBook, getAllBooks } from '../db/database';

const { Title } = Typography;
const { TabPane } = Tabs;

const defaultFilters: Filters = {
  title: '',
  author: '',
  genre: '',
  language: '',
  readStatus: '',
  bookType: '',
  publisher: '',
  favorite: false
};

const defaultColumnVisibility: ColumnVisibility = {
  favorite: true,
  title: true,
  author: true,
  publisher: true,
  publishDate: true,
  genre: true,
  language: true,
  bookType: true,
  readStatus: true,
  dateOfReading: true,
  rating: true,
  actions: true
};

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sortBy, setSortBy] = useState<string>('title');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(defaultColumnVisibility);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const allBooks = await getAllBooks();
      setBooks(allBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = () => {
    setSelectedBook(undefined);
    setIsFormVisible(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsFormVisible(true);
  };

  const handleSaveBook = async (book: Book) => {
    try {
      if (book.id) {
        await updateBook(book);
      } else {
        await addBook(book);
      }
      await loadBooks();
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleDeleteBook = async (id: number) => {
    try {
      await deleteBook(id);
      await loadBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleToggleFavorite = async (book: Book) => {
    try {
      const updatedBook = { ...book, favorite: !book.favorite };
      await updateBook(updatedBook);
      await loadBooks();
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleColumnVisibilityChange = (newVisibility: ColumnVisibility) => {
    setColumnVisibility(newVisibility);
  };

  const exportToCSV = () => {
    if (books.length === 0) return;

    // Create CSV content
    const headers = [
      'Title',
      'Author',
      'Publisher',
      'Published',
      'Genre',
      'Language',
      'Book Type',
      'Status',
      'Date Read',
      'Rating',
      'Favorite',
      'Comment'
    ].join(',');

    const rows = books.map(book => [
      `"${book.title.replace(/"/g, '""')}"`,
      `"${(book.author || '').replace(/"/g, '""')}"`,
      `"${(book.publisher || '').replace(/"/g, '""')}"`,
      `"${(book.publishDate || '').replace(/"/g, '""')}"`,
      `"${(book.genre || '').replace(/"/g, '""')}"`,
      `"${(book.language || '').replace(/"/g, '""')}"`,
      `"${(book.bookType || '').replace(/"/g, '""')}"`,
      `"${(book.readStatus || '').replace(/"/g, '""')}"`,
      `"${(book.dateOfReading || '').replace(/"/g, '""')}"`,
      book.rating || 0,
      book.favorite ? 'Yes' : 'No',
      `"${(book.comment || '').replace(/"/g, '""')}"`
    ].join(','));

    const csvContent = [headers, ...rows].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'book_collection.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBooks = books.filter(book => {
    // Filter by title
    if (filters.title && !book.title.toLowerCase().includes(filters.title.toLowerCase())) {
      return false;
    }
    
    // Filter by author
    if (filters.author && (!book.author || !book.author.toLowerCase().includes(filters.author.toLowerCase()))) {
      return false;
    }
    
    // Filter by genre
    if (filters.genre && book.genre !== filters.genre) {
      return false;
    }
    
    // Filter by language
    if (filters.language && book.language !== filters.language) {
      return false;
    }
    
    // Filter by read status
    if (filters.readStatus && book.readStatus !== filters.readStatus) {
      return false;
    }
    
    // Filter by book type
    if (filters.bookType && book.bookType !== filters.bookType) {
      return false;
    }
    
    // Filter by publisher
    if (filters.publisher && (!book.publisher || !book.publisher.toLowerCase().includes(filters.publisher.toLowerCase()))) {
      return false;
    }
    
    // Filter by favorite
    if (filters.favorite && !book.favorite) {
      return false;
    }
    
    return true;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'author') {
      return (a.author || '').localeCompare(b.author || '');
    } else if (sortBy === 'dateOfReading') {
      return (a.dateOfReading || '').localeCompare(b.dateOfReading || '');
    } else if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });

  return (
    <div className="page-content">
      <Flex justify="end" align="center" className="mb-6">
        <Space>
          <Button 
            icon={<DownloadOutlined />} 
            onClick={exportToCSV}
          >
            Export to CSV
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddBook}
            size="large"
          >
            Add Book
          </Button>
        </Space>
      </Flex>

      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        clearFilters={() => setFilters(defaultFilters)}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        allBooks={books}
      />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : books.length === 0 ? (
        <Empty 
          description="Your book collection is empty. Start by adding your first book!" 
          style={{ padding: '40px' }}
        />
      ) : (
        <BookList 
          books={sortedBooks}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          onToggleFavorite={handleToggleFavorite}
          sortBy={sortBy}
          setSortBy={setSortBy}
          columnVisibility={columnVisibility}
        />
      )}

      <BookForm
        book={selectedBook}
        onSave={handleSaveBook}
        onCancel={() => setIsFormVisible(false)}
        visible={isFormVisible}
      />
    </div>
  );
};

export default HomePage;
