import React, { useState, useEffect } from 'react';
import { Button, Typography, Row, Col, message, Space } from 'antd';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import BookList from '../components/BookList';
import BookForm from '../components/BookForm';
import FilterBar from '../components/FilterBar';
import { Book, Filters, ColumnVisibility } from '../types';
import { db, addBook, updateBook, deleteBook, getAllBooks } from '../db/database';

const { Title } = Typography;

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('title');
  const [filters, setFilters] = useState<Filters>({
    title: '',
    author: '',
    genre: '',
    language: '',
    readStatus: '',
    bookType: '',
    publisher: '',
    favorite: false
  });
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
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
  });

  useEffect(() => {
    loadBooks();
    
    // Load saved column visibility preferences
    const savedColumnVisibility = localStorage.getItem('columnVisibility');
    if (savedColumnVisibility) {
      setColumnVisibility(JSON.parse(savedColumnVisibility));
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [books, filters, sortBy]);

  const loadBooks = async () => {
    try {
      const allBooks = await getAllBooks();
      setBooks(allBooks);
    } catch (error) {
      console.error('Error loading books:', error);
      message.error('Failed to load books');
    }
  };

  const applyFilters = () => {
    let result = [...books];

    // Apply text filters with support for multiple values (comma-separated)
    if (filters.title) {
      const titleTerms = filters.title.split(',').map(term => term.trim().toLowerCase());
      result = result.filter(book => 
        titleTerms.some(term => book.title.toLowerCase().includes(term))
      );
    }

    if (filters.author) {
      const authorTerms = filters.author.split(',').map(term => term.trim().toLowerCase());
      result = result.filter(book => 
        book.author && authorTerms.some(term => book.author?.toLowerCase().includes(term))
      );
    }

    if (filters.publisher) {
      const publisherTerms = filters.publisher.split(',').map(term => term.trim().toLowerCase());
      result = result.filter(book => 
        book.publisher && publisherTerms.some(term => book.publisher?.toLowerCase().includes(term))
      );
    }

    if (filters.genre) {
      const genreTerms = filters.genre.split(',');
      result = result.filter(book => 
        book.genre && genreTerms.includes(book.genre)
      );
    }

    if (filters.language) {
      const languageTerms = filters.language.split(',');
      result = result.filter(book => 
        languageTerms.includes(book.language)
      );
    }

    if (filters.readStatus) {
      const statusTerms = filters.readStatus.split(',');
      result = result.filter(book => 
        statusTerms.includes(book.readStatus)
      );
    }

    if (filters.bookType) {
      const typeTerms = filters.bookType.split(',');
      result = result.filter(book => 
        book.bookType && typeTerms.includes(book.bookType)
      );
    }

    // Apply favorite filter
    if (filters.favorite) {
      result = result.filter(book => book.favorite);
    }

    // Apply sorting
    result.sort((a, b) => {
      const fieldA = a[sortBy as keyof Book];
      const fieldB = b[sortBy as keyof Book];
      
      // Handle undefined values
      if (fieldA === undefined && fieldB === undefined) return 0;
      if (fieldA === undefined) return 1;
      if (fieldB === undefined) return -1;
      
      // Handle string comparison
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return fieldA.localeCompare(fieldB);
      }
      
      // Handle number comparison
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return fieldA - fieldB;
      }
      
      // Handle boolean comparison
      if (typeof fieldA === 'boolean' && typeof fieldB === 'boolean') {
        return fieldA === fieldB ? 0 : fieldA ? -1 : 1;
      }
      
      return 0;
    });

    setFilteredBooks(result);
  };

  const handleAddBook = () => {
    setEditingBook(undefined);
    setIsFormVisible(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setIsFormVisible(true);
  };

  const handleSaveBook = async (book: Book) => {
    try {
      if (book.id) {
        // Update existing book
        await updateBook(book);
        message.success('Book updated successfully');
      } else {
        // Add new book
        await addBook(book);
        message.success('Book added successfully');
      }
      
      setIsFormVisible(false);
      loadBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      message.error('Failed to save book');
    }
  };

  const handleDeleteBook = async (id: number) => {
    try {
      await deleteBook(id);
      message.success('Book deleted successfully');
      loadBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      message.error('Failed to delete book');
    }
  };

  const handleToggleFavorite = async (book: Book) => {
    try {
      const updatedBook = { ...book, favorite: !book.favorite };
      await updateBook(updatedBook);
      message.success(updatedBook.favorite ? 'Added to favorites' : 'Removed from favorites');
      loadBooks();
    } catch (error) {
      console.error('Error updating favorite status:', error);
      message.error('Failed to update favorite status');
    }
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      author: '',
      genre: '',
      language: '',
      readStatus: '',
      bookType: '',
      publisher: '',
      favorite: false
    });
  };

  const handleColumnVisibilityChange = (newVisibility: ColumnVisibility) => {
    setColumnVisibility(newVisibility);
  };

  const exportToCSV = () => {
    // Only export visible columns and their data
    const visibleColumns = Object.entries(columnVisibility)
      .filter(([_, isVisible]) => isVisible)
      .map(([column]) => column)
      .filter(column => column !== 'actions' && column !== 'favorite'); // Exclude action buttons and favorite toggle

    // Create header row
    const headers = visibleColumns.map(column => {
      // Convert camelCase to Title Case
      return column
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
    });

    // Create CSV content
    let csvContent = headers.join(',') + '\n';

    // Add data rows
    filteredBooks.forEach(book => {
      const row = visibleColumns.map(column => {
        const key = column as keyof Book;
        const value = book[key];
        
        // Handle different value types
        if (value === undefined || value === null) {
          return '';
        } else if (typeof value === 'boolean') {
          return value ? 'Yes' : 'No';
        } else if (key === 'rating') {
          return value || '0';
        } else {
          // Escape quotes and wrap in quotes if the value contains a comma
          const stringValue = String(value);
          return stringValue.includes(',') 
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue;
        }
      });
      
      csvContent += row.join(',') + '\n';
    });

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'books.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success('CSV file exported successfully');
  };

  return (
    <div className="w-full">
      <Row gutter={[16, 24]} align="middle" justify="space-between" className="w-full">
        <Col>
          <Title level={2}>My Book Collection</Title>
        </Col>
        <Col>
          <Space size="middle">
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
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-4 w-full">
        <Col span={24}>
          <FilterBar 
            filters={filters} 
            setFilters={setFilters} 
            clearFilters={clearFilters}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibilityChange}
            allBooks={books} // Pass all books for autocomplete suggestions
          />
        </Col>
      </Row>

      <div className="w-full">
        <BookList 
          books={filteredBooks}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          onToggleFavorite={handleToggleFavorite}
          sortBy={sortBy}
          setSortBy={setSortBy}
          columnVisibility={columnVisibility}
        />
      </div>

      <BookForm
        book={editingBook}
        onSave={handleSaveBook}
        onCancel={() => setIsFormVisible(false)}
        visible={isFormVisible}
      />
    </div>
  );
};

export default HomePage;
