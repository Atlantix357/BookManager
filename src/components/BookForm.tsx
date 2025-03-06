import React, { useState, useEffect } from 'react';
import { Book, GENRES, LANGUAGES } from '../types';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Rate, 
  Button, 
  Upload, 
  Space, 
  Typography,
  Divider,
  Row,
  Col
} from 'antd';
import { 
  UploadOutlined, 
  StarOutlined, 
  StarFilled, 
  DeleteOutlined 
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import { useTheme } from '../context/ThemeContext';

const { TextArea } = Input;
const { Title } = Typography;

interface BookFormProps {
  book?: Book;
  onSave: (book: Book) => void;
  onCancel: () => void;
  visible: boolean;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSave, onCancel, visible }) => {
  const { isDark } = useTheme();
  const [form] = Form.useForm();
  const [favorite, setFavorite] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');

  useEffect(() => {
    if (visible) {
      form.resetFields();
      
      if (book) {
        // Convert date string to dayjs object for DatePicker
        const dateOfReading = book.dateOfReading 
          ? dayjs(book.dateOfReading) 
          : undefined;
        
        form.setFieldsValue({
          ...book,
          dateOfReading
        });
        
        setFavorite(book.favorite || false);
        
        if (book.coverImage) {
          setCoverImageUrl(book.coverImage);
          setFileList([
            {
              uid: '-1',
              name: 'cover.jpg',
              status: 'done',
              url: book.coverImage,
            },
          ]);
        } else {
          setCoverImageUrl('');
          setFileList([]);
        }
      } else {
        setFavorite(false);
        setCoverImageUrl('');
        setFileList([]);
      }
    }
  }, [visible, book, form]);

  const handleFinish = (values: any) => {
    const formattedValues = {
      ...values,
      id: book?.id,
      favorite,
      coverImage: coverImageUrl,
      dateOfReading: values.dateOfReading ? values.dateOfReading.format('YYYY-MM-DD') : '',
    };
    
    onSave(formattedValues);
  };

  const toggleFavorite = () => {
    setFavorite(!favorite);
  };

  const handleCoverImageChange = (info: any) => {
    const { fileList } = info;
    setFileList(fileList);
    
    if (info.file.status === 'uploading') {
      return;
    }
    
    if (info.file.status === 'done') {
      // Read the file and convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setCoverImageUrl(dataUrl);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const removeCoverImage = () => {
    setCoverImageUrl('');
    setFileList([]);
  };

  const customRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isLt5M = file.size / 1024 / 1024 < 5;
    
    if (!isImage) {
      console.error('You can only upload image files!');
      return false;
    }
    
    if (!isLt5M) {
      console.error('Image must be smaller than 5MB!');
      return false;
    }
    
    return isImage && isLt5M;
  };

  return (
    <Modal
      title={book?.id ? 'Edit Book' : 'Add New Book'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          language: 'English',
          readStatus: 'Unread',
          bookType: 'Paper',
          rating: 0
        }}
      >
        <Row gutter={16}>
          <Col span={20}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter the book title' }]}
            >
              <Input placeholder="Enter book title" />
            </Form.Item>
          </Col>
          <Col span={4} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <Button
              type="text"
              icon={favorite ? <StarFilled style={{ color: '#fadb14', fontSize: '24px' }} /> : <StarOutlined style={{ fontSize: '24px' }} />}
              onClick={toggleFavorite}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              style={{ marginBottom: '24px' }}
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="author" label="Author">
              <Input placeholder="Enter author name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="publisher" label="Publisher">
              <Input placeholder="Enter publisher name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="publishDate" label="Publish Date">
              <Input placeholder="e.g., 2023 or May 2023" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="genre" label="Genre">
              <Select placeholder="Select genre">
                <Select.Option value="">Select Genre</Select.Option>
                {GENRES.map(genre => (
                  <Select.Option key={genre} value={genre}>{genre}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="language"
              label="Language"
              rules={[{ required: true, message: 'Please select a language' }]}
            >
              <Select>
                {LANGUAGES.map(language => (
                  <Select.Option key={language} value={language}>
                    {language === 'English' ? '🇬🇧 English' : '🇺🇦 Ukrainian'}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="bookType" label="Book Type">
              <Select>
                <Select.Option value="Paper">Paper</Select.Option>
                <Select.Option value="E-book">E-book</Select.Option>
                <Select.Option value="Audiobook">Audiobook</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="readStatus"
              label="Reading Status"
              rules={[{ required: true, message: 'Please select a reading status' }]}
            >
              <Select>
                <Select.Option value="Read">Read</Select.Option>
                <Select.Option value="Unread">Unread</Select.Option>
                <Select.Option value="Did not finish">Did not finish</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="dateOfReading" label="Date Read">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="rating" label="Rating">
              <Rate />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="comment" label="Comments">
          <TextArea
            rows={4}
            placeholder="Add your thoughts about the book..."
          />
        </Form.Item>

        <Divider orientation="left">Cover Image</Divider>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 24 }}>
          {coverImageUrl && (
            <div style={{ position: 'relative', marginRight: 16 }}>
              <img
                src={coverImageUrl}
                alt="Cover preview"
                style={{ width: 100, height: 140, objectFit: 'cover', borderRadius: 4 }}
              />
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={removeCoverImage}
                style={{
                  position: 'absolute',
                  top: -12,
                  right: -12,
                  color: '#ff4d4f',
                  background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)',
                  borderRadius: '50%',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Remove cover image"
              />
            </div>
          )}
          
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleCoverImageChange}
            customRequest={customRequest}
            beforeUpload={beforeUpload}
            maxCount={1}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Upload Cover Image</Button>
          </Upload>
        </div>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {book?.id ? 'Update Book' : 'Add Book'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BookForm;
