import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Statistic, Progress, List, Tag, Divider } from 'antd';
import { BookOutlined, StarOutlined, ReadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Book } from '../types';
import { getAllBooks } from '../db/database';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const { Title: AntTitle } = Typography;

const DashboardPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const allBooks = await getAllBooks();
        setBooks(allBooks);
      } catch (error) {
        console.error('Error loading books for dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Calculate statistics
  const totalBooks = books.length;
  const readBooks = books.filter(book => book.readStatus === 'Read').length;
  const unreadBooks = books.filter(book => book.readStatus === 'Unread').length;
  const dnfBooks = books.filter(book => book.readStatus === 'Did not finish').length;
  const favoriteBooks = books.filter(book => book.favorite).length;
  
  const readPercentage = totalBooks > 0 ? Math.round((readBooks / totalBooks) * 100) : 0;
  
  // Calculate average rating
  const ratedBooks = books.filter(book => book.rating && book.rating > 0);
  const averageRating = ratedBooks.length > 0 
    ? (ratedBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / ratedBooks.length).toFixed(1)
    : 'N/A';

  // Get book types distribution
  const paperBooks = books.filter(book => book.bookType === 'Paper').length;
  const ebookBooks = books.filter(book => book.bookType === 'E-book').length;
  const audioBooks = books.filter(book => book.bookType === 'Audiobook').length;

  // Get language distribution
  const languageCounts: Record<string, number> = {};
  books.forEach(book => {
    if (book.language) {
      languageCounts[book.language] = (languageCounts[book.language] || 0) + 1;
    }
  });

  // Get genre distribution
  const genreCounts: Record<string, number> = {};
  books.forEach(book => {
    if (book.genre) {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    }
  });

  // Get top authors
  const authorCounts: Record<string, number> = {};
  books.forEach(book => {
    if (book.author) {
      authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
    }
  });

  const topAuthors = Object.entries(authorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Get top publishers
  const publisherCounts: Record<string, number> = {};
  books.forEach(book => {
    if (book.publisher) {
      publisherCounts[book.publisher] = (publisherCounts[book.publisher] || 0) + 1;
    }
  });

  const topPublishers = Object.entries(publisherCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Chart data for book types
  const bookTypeData = {
    labels: ['Paper', 'E-book', 'Audiobook'],
    datasets: [
      {
        label: 'Book Types',
        data: [paperBooks, ebookBooks, audioBooks],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for reading status
  const readingStatusData = {
    labels: ['Read', 'Unread', 'Did not finish'],
    datasets: [
      {
        label: 'Reading Status',
        data: [readBooks, unreadBooks, dnfBooks],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for languages
  const languageData = {
    labels: Object.keys(languageCounts),
    datasets: [
      {
        label: 'Languages',
        data: Object.values(languageCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for genres
  const genreLabels = Object.keys(genreCounts).slice(0, 10);
  const genreValues = genreLabels.map(label => genreCounts[label]);

  const genreData = {
    labels: genreLabels,
    datasets: [
      {
        label: 'Genres',
        data: genreValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Genre Distribution',
      },
    },
  };

  return (
    <div className="dashboard-container page-content">
      <AntTitle level={2}>Dashboard</AntTitle>
      
      {/* Summary Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="statistic-card">
            <Statistic
              title="Total Books"
              value={totalBooks}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="statistic-card">
            <Statistic
              title="Read Books"
              value={readBooks}
              suffix={`/ ${totalBooks}`}
              prefix={<ReadOutlined />}
            />
            <Progress percent={readPercentage} status="active" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="statistic-card">
            <Statistic
              title="Favorite Books"
              value={favoriteBooks}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="statistic-card">
            <Statistic
              title="Average Rating"
              value={averageRating}
              prefix={<StarOutlined />}
              suffix={ratedBooks.length > 0 ? "/5" : ""}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Card title="Book Types" bordered={false} className="chart-card">
            <div style={{ height: '300px' }}>
              <Pie data={bookTypeData} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Reading Status" bordered={false} className="chart-card">
            <div style={{ height: '300px' }}>
              <Pie data={readingStatusData} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Card title="Languages" bordered={false} className="chart-card">
            <div style={{ height: '300px' }}>
              <Pie data={languageData} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Genre Distribution" bordered={false} className="chart-card">
            <div style={{ height: '300px' }}>
              <Bar options={barOptions} data={genreData} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Lists */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Top Authors" bordered={false}>
            <List
              dataSource={topAuthors}
              renderItem={([author, count]) => (
                <List.Item>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{author}</span>
                    <Tag color="blue">{count} book{count !== 1 ? 's' : ''}</Tag>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Top Publishers" bordered={false}>
            <List
              dataSource={topPublishers}
              renderItem={([publisher, count]) => (
                <List.Item>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{publisher}</span>
                    <Tag color="purple">{count} book{count !== 1 ? 's' : ''}</Tag>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
