import React, { useState } from 'react';
import { Book, ColumnVisibility } from '../types';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Typography, 
  Rate, 
  Tooltip, 
  Drawer, 
  theme,
  Image
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  StarOutlined, 
  StarFilled, 
  MessageOutlined,
  BookOutlined,
  ReadOutlined,
  StopOutlined,
  TabletOutlined,
  SoundOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Text, Paragraph } = Typography;

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (book: Book) => void;
  sortBy: string;
  setSortBy: (field: string) => void;
  columnVisibility: ColumnVisibility;
}

const BookList: React.FC<BookListProps> = ({ 
  books, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  columnVisibility
}) => {
  const { isDark } = useTheme();
  const { token } = theme.useToken();
  const [commentDrawer, setCommentDrawer] = useState<{ visible: boolean; book: Book | null }>({
    visible: false,
    book: null
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Read':
        return 'success';
      case 'Unread':
        return 'warning';
      case 'Did not finish':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Read':
        return <ReadOutlined />;
      case 'Unread':
        return <BookOutlined />;
      case 'Did not finish':
        return <StopOutlined />;
      default:
        return <BookOutlined />;
    }
  };

  const getBookTypeIcon = (type?: string) => {
    switch (type) {
      case 'E-book':
        return <TabletOutlined style={{ color: token.colorInfo }} />;
      case 'Audiobook':
        return <SoundOutlined style={{ color: token.colorPurple }} />;
      case 'Paper':
      default:
        return <BookOutlined style={{ color: token.colorWarning }} />;
    }
  };

  const showCommentDrawer = (book: Book) => {
    setCommentDrawer({
      visible: true,
      book
    });
  };

  const closeCommentDrawer = () => {
    setCommentDrawer({
      visible: false,
      book: null
    });
  };

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: '',
      dataIndex: 'favorite',
      key: 'favorite',
      width: 50,
      render: (_: any, record: Book) => (
        <Button
          type="text"
          icon={record.favorite ? <StarFilled style={{ color: token.colorWarning }} /> : <StarOutlined />}
          onClick={() => onToggleFavorite(record)}
          aria-label={record.favorite ? "Remove from favorites" : "Add to favorites"}
        />
      ),
      hidden: !columnVisibility.favorite
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (_: any, record: Book) => (
        <Space>
          {record.coverImage ? (
            <Image
              src={record.coverImage}
              alt={record.title}
              width={40}
              height={60}
              style={{ objectFit: 'cover', borderRadius: '4px' }}
              preview={{
                mask: 'View',
                maskClassName: 'text-xs'
              }}
              fallback="data:image/png;base64,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"
            />
          ) : (
            <div style={{ 
              width: 40, 
              height: 60, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: isDark ? token.colorBgContainer : token.colorBgLayout,
              borderRadius: '4px'
            }}>
              {getBookTypeIcon(record.bookType)}
            </div>
          )}
          <Tooltip title={record.title}>
            <Text ellipsis style={{ maxWidth: 200 }}>{record.title}</Text>
          </Tooltip>
        </Space>
      ),
      hidden: !columnVisibility.title
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      render: (author: string) => (
        <Tooltip title={author || '-'}>
          <Text ellipsis style={{ maxWidth: 150 }}>{author || '-'}</Text>
        </Tooltip>
      ),
      hidden: !columnVisibility.author
    },
    {
      title: 'Publisher',
      dataIndex: 'publisher',
      key: 'publisher',
      render: (publisher: string) => (
        <Tooltip title={publisher || '-'}>
          <Text ellipsis style={{ maxWidth: 150 }}>{publisher || '-'}</Text>
        </Tooltip>
      ),
      hidden: !columnVisibility.publisher
    },
    {
      title: 'Published',
      dataIndex: 'publishDate',
      key: 'publishDate',
      render: (date: string) => date || '-',
      hidden: !columnVisibility.publishDate
    },
    {
      title: 'Genre',
      dataIndex: 'genre',
      key: 'genre',
      render: (genre: string) => genre || '-',
      hidden: !columnVisibility.genre
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      render: (language: string) => (
        <Space>
          {language === 'English' ? (
            <img src="/flags/gb.svg" alt="GB" style={{ width: 20, height: 12 }} />
          ) : language === 'Ukrainian' ? (
            <img src="/flags/ua.svg" alt="UA" style={{ width: 20, height: 12 }} />
          ) : null}
          <span>{language}</span>
        </Space>
      ),
      hidden: !columnVisibility.language
    },
    {
      title: 'Type',
      dataIndex: 'bookType',
      key: 'bookType',
      render: (type: string) => (
        <Space>
          {getBookTypeIcon(type)}
          <span>{type || 'Paper'}</span>
        </Space>
      ),
      hidden: !columnVisibility.bookType
    },
    {
      title: 'Status',
      dataIndex: 'readStatus',
      key: 'readStatus',
      render: (status: string) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
      hidden: !columnVisibility.readStatus
    },
    {
      title: 'Date Read',
      dataIndex: 'dateOfReading',
      key: 'dateOfReading',
      render: (date: string) => date || '-',
      hidden: !columnVisibility.dateOfReading
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating || 0} />,
      hidden: !columnVisibility.rating
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Book) => (
        <Space size="small">
          {record.comment && (
            <Button
              type="text"
              icon={<MessageOutlined style={{ color: token.colorInfo }} />}
              onClick={() => showCommentDrawer(record)}
              aria-label="View comment"
            />
          )}
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            aria-label="Edit book"
          />
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: token.colorError }} />}
            onClick={() => record.id && onDelete(record.id)}
            aria-label="Delete book"
          />
        </Space>
      ),
      hidden: !columnVisibility.actions
    },
  ].filter(column => !column.hidden);

  return (
    <>
      <div className="w-full overflow-x-auto" style={{ overflowX: 'auto' }}>
        <Table
          dataSource={books}
          columns={columns}
          rowKey={record => String(record.id)}
          pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'] }}
          locale={{ emptyText: 'No books found. Add your first book!' }}
          style={{ width: '100%' }}
          scroll={{ x: 'max-content' }}
        />
      </div>
      
      <Drawer
        title="Book Comments"
        placement="right"
        onClose={closeCommentDrawer}
        open={commentDrawer.visible}
        width={400}
      >
        {commentDrawer.book && (
          <div>
            <Typography.Title level={5}>{commentDrawer.book.title}</Typography.Title>
            {commentDrawer.book.author && (
              <Text type="secondary">by {commentDrawer.book.author}</Text>
            )}
            <Paragraph style={{ marginTop: 16, whiteSpace: 'pre-wrap' }}>
              {commentDrawer.book.comment}
            </Paragraph>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default BookList;
