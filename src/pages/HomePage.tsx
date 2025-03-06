import React, { useState, useEffect } from 'react';
import { Typography, Button, Space } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import BookList from '../components/BookList';
import BookForm from '../components/BookForm';
import FilterBar from '../components/FilterBar';
import { Book, BookFilter, ColumnVisibility } from '../types';
import { getAllBooks, addBook, updateBook, deleteBook } from '../db/database';

const { Title } = Typography;

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [filters, setFilters] = useState<BookFilter>({});
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
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
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

  const handleAddBook = async (book: Book) => {
    try {
      await addBook(book);
      fetchBooks();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleUpdateBook = async (book: Book) => {
    try {
      await updateBook(book);
      fetchBooks();
      setIsModalVisible(false);
      setEditingBook(null);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDeleteBook = async (id: number) => {
    try {
      await deleteBook(id);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingBook(null);
  };

  const handleFilterChange = (newFilters: BookFilter) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleExportCSV = () => {
    // Implementation for CSV export
    const headers = [
      'Title',
      'Author',
      'Publisher',
      'Publish Date',
      'Genre',
      'Language',
      'Book Type',
      'Read Status',
      'Date of Reading',
      'Rating',
      'Favorite'
    ].join(',');

    const csvRows = books.map(book => {
      return [
        `"${book.title || ''}"`,
        `"${book.author || ''}"`,
        `"${book.publisher || ''}"`,
        `"${book.publishDate || ''}"`,
        `"${book.genre || ''}"`,
        `"${book.language || ''}"`,
        `"${book.bookType || ''}"`,
        `"${book.readStatus || ''}"`,
        `"${book.dateOfReading || ''}"`,
        `"${book.rating || ''}"`,
        `"${book.favorite ? 'Yes' : 'No'}"`
      ].join(',');
    });

    const csvContent = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'books.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter books based on current filters
  const filteredBooks = books.filter(book => {
    // Check each filter
    for (const [key, value] of Object.entries(filters)) {
      if (value && key in book) {
        const bookValue = book[key as keyof Book];
        
        // Skip if the book doesn't have this property or it's null/undefined
        if (bookValue === undefined || bookValue === null) {
          return false;
        }
        
        // Special case for favorite which is boolean
        if (key === 'favorite') {
          if (value === 'true' && !bookValue) return false;
          if (value === 'false' && bookValue) return false;
          continue;
        }
        
        // For string values, check if the filter value is included in the book value
        if (typeof bookValue === 'string' && typeof value === 'string') {
          if (!bookValue.toLowerCase().includes(value.toLowerCase())) {
            return false;
          }
        } 
        // For exact matches (like select filters)
        else if (bookValue !== value) {
          return false;
        }
      }
    }
    return true;
  });

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Space>
          <Button 
            icon={<DownloadOutlined />} 
            onClick={handleExportCSV}
          >
            Export to CSV
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsModalVisible(true)}
          >
            Add Book
          </Button>
        </Space>
      </div>

      <FilterBar 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onClearFilters={handleClearFilters}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />

      <BookList 
        books={filteredBooks} 
        loading={loading} 
        onEdit={handleEdit} 
        onDelete={handleDeleteBook}
        columnVisibility={columnVisibility}
      />

      <BookForm
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={editingBook ? handleUpdateBook : handleAddBook}
        initialValues={editingBook}
      />
    </div>
  );
};

export default HomePage;
