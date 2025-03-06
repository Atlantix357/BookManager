import React, { useState, useEffect, useMemo } from 'react';
import { Filters, GENRES, LANGUAGES, ColumnVisibility } from '../types';
import { 
  Card, 
  Input, 
  Select, 
  Button, 
  Row, 
  Col, 
  Space, 
  Divider,
  Modal,
  Checkbox,
  Dropdown,
  Menu,
  Typography,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  ClearOutlined, 
  SettingOutlined,
  EyeOutlined,
  FilterOutlined,
  SaveOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

interface FilterBarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  clearFilters: () => void;
  columnVisibility: ColumnVisibility;
  onColumnVisibilityChange: (visibility: ColumnVisibility) => void;
  allBooks: any[]; // Add this to get access to all books for suggestions
}

// Define available filters
const AVAILABLE_FILTERS = [
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'publisher', label: 'Publisher' },
  { key: 'genre', label: 'Genre' },
  { key: 'language', label: 'Language' },
  { key: 'readStatus', label: 'Status' },
  { key: 'bookType', label: 'Book Type' },
  { key: 'favorite', label: 'Favorites' }
];

const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  setFilters, 
  clearFilters,
  columnVisibility,
  onColumnVisibilityChange,
  allBooks = [] // Provide default empty array to prevent undefined errors
}) => {
  // State for filter visibility preferences
  const [filterVisibility, setFilterVisibility] = useState<Record<string, boolean>>({
    title: true,
    author: true,
    publisher: true,
    genre: true,
    language: true,
    readStatus: true,
    bookType: true,
    favorite: true
  });

  // State for filter/column customization modals
  const [filterCustomizationVisible, setFilterCustomizationVisible] = useState(false);
  const [columnCustomizationVisible, setColumnCustomizationVisible] = useState(false);
  
  // State for temporary changes in customization modals
  const [tempFilterVisibility, setTempFilterVisibility] = useState<Record<string, boolean>>({});
  const [tempColumnVisibility, setTempColumnVisibility] = useState<ColumnVisibility>({...columnVisibility});

  // Extract unique values for autocomplete suggestions
  const uniqueTitles = useMemo(() => {
    if (!allBooks || !Array.isArray(allBooks)) return [];
    const titles = allBooks.map(book => book?.title).filter(Boolean);
    return [...new Set(titles)].sort();
  }, [allBooks]);

  const uniqueAuthors = useMemo(() => {
    if (!allBooks || !Array.isArray(allBooks)) return [];
    const authors = allBooks.map(book => book?.author).filter(Boolean);
    return [...new Set(authors)].sort();
  }, [allBooks]);

  const uniquePublishers = useMemo(() => {
    if (!allBooks || !Array.isArray(allBooks)) return [];
    const publishers = allBooks.map(book => book?.publisher).filter(Boolean);
    return [...new Set(publishers)].sort();
  }, [allBooks]);

  // Load saved preferences on component mount
  useEffect(() => {
    const savedFilterVisibility = localStorage.getItem('filterVisibility');
    if (savedFilterVisibility) {
      setFilterVisibility(JSON.parse(savedFilterVisibility));
    }
    
    const savedColumnVisibility = localStorage.getItem('columnVisibility');
    if (savedColumnVisibility) {
      onColumnVisibilityChange(JSON.parse(savedColumnVisibility));
    }
  }, []);

  // Handle multiselect filter changes
  const handleFilterChange = (name: string, value: string[]) => {
    // For multiselect filters, we'll join the values with commas
    setFilters(prev => ({ ...prev, [name]: value.join(',') }));
  };

  // Handle checkbox filter changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: checked }));
  };

  // Open filter customization modal
  const showFilterCustomization = () => {
    setTempFilterVisibility({...filterVisibility});
    setFilterCustomizationVisible(true);
  };

  // Open column customization modal
  const showColumnCustomization = () => {
    setTempColumnVisibility({...columnVisibility});
    setColumnCustomizationVisible(true);
  };

  // Save filter visibility preferences
  const saveFilterPreferences = () => {
    setFilterVisibility(tempFilterVisibility);
    localStorage.setItem('filterVisibility', JSON.stringify(tempFilterVisibility));
    setFilterCustomizationVisible(false);
  };

  // Save column visibility preferences
  const saveColumnPreferences = () => {
    onColumnVisibilityChange(tempColumnVisibility);
    localStorage.setItem('columnVisibility', JSON.stringify(tempColumnVisibility));
    setColumnCustomizationVisible(false);
  };

  // Handle filter visibility toggle
  const handleFilterVisibilityToggle = (key: string) => {
    setTempFilterVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle column visibility toggle
  const handleColumnVisibilityToggle = (column: keyof ColumnVisibility) => {
    setTempColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Reset column visibility to defaults
  const resetColumns = () => {
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
    
    setTempColumnVisibility(defaultColumnVisibility);
  };

  // Reset filter visibility to defaults
  const resetFilters = () => {
    const defaultFilterVisibility = {
      title: true,
      author: true,
      publisher: true,
      genre: true,
      language: true,
      readStatus: true,
      bookType: true,
      favorite: true
    };
    
    setTempFilterVisibility(defaultFilterVisibility);
  };

  // Convert string filter values to arrays for multiselect
  const getFilterValues = (key: string): string[] => {
    const value = filters[key as keyof Filters];
    if (typeof value === 'string' && value) {
      return value.split(',');
    }
    if (typeof value === 'boolean') {
      return value ? ['true'] : [];
    }
    return [];
  };

  // Filter options based on input for predictive search
  const filterOptions = (input: string, option: any) => {
    if (!input || !option?.value) return true;
    return option.value.toLowerCase().includes(input.toLowerCase());
  };

  return (
    <>
      <Card 
        title={
          <Space>
            <SearchOutlined />
            <span>Filter Books</span>
          </Space>
        }
        extra={
          <Space>
            <Button 
              icon={<ClearOutlined />} 
              onClick={clearFilters}
              size="small"
            >
              Clear filters
            </Button>
            <Button
              icon={<FilterOutlined />}
              onClick={showFilterCustomization}
              size="small"
            >
              Customize Filters
            </Button>
            <Button
              icon={<EyeOutlined />}
              onClick={showColumnCustomization}
              size="small"
            >
              Customize Columns
            </Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[16, 16]}>
          {/* Title Filter */}
          {filterVisibility.title && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <div style={{ marginBottom: 8 }}>Title</div>
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Filter by title..."
                value={getFilterValues('title')}
                onChange={(value) => handleFilterChange('title', value)}
                allowClear
                tokenSeparators={[',']}
                showSearch
                filterOption={filterOptions}
                optionFilterProp="children"
              >
                {uniqueTitles.map(title => (
                  <Option key={title} value={title}>{title}</Option>
                ))}
              </Select>
            </Col>
          )}

          {/* Author Filter */}
          {filterVisibility.author && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <div style={{ marginBottom: 8 }}>Author</div>
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Filter by author..."
                value={getFilterValues('author')}
                onChange={(value) => handleFilterChange('author', value)}
                allowClear
                tokenSeparators={[',']}
                showSearch
                filterOption={filterOptions}
                optionFilterProp="children"
              >
                {uniqueAuthors.map(author => (
                  <Option key={author} value={author}>{author}</Option>
                ))}
              </Select>
            </Col>
          )}

          {/* Publisher Filter */}
          {filterVisibility.publisher && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <div style={{ marginBottom: 8 }}>Publisher</div>
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Filter by publisher..."
                value={getFilterValues('publisher')}
                onChange={(value) => handleFilterChange('publisher', value)}
                allowClear
                tokenSeparators={[',']}
                showSearch
                filterOption={filterOptions}
                optionFilterProp="children"
              >
                {uniquePublishers.map(publisher => (
                  <Option key={publisher} value={publisher}>{publisher}</Option>
                ))}
              </Select>
            </Col>
          )}

          {/* Genre Filter */}
          {filterVisibility.genre && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <div style={{ marginBottom: 8 }}>Genre</div>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Filter by genre..."
                value={getFilterValues('genre')}
                onChange={(value) => handleFilterChange('genre', value)}
                allowClear
              >
                {GENRES.map(genre => (
                  <Option key={genre} value={genre}>{genre}</Option>
                ))}
              </Select>
            </Col>
          )}

          {/* Language Filter */}
          {filterVisibility.language && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <div style={{ marginBottom: 8 }}>Language</div>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Filter by language..."
                value={getFilterValues('language')}
                onChange={(value) => handleFilterChange('language', value)}
                allowClear
              >
                {LANGUAGES.map(language => (
                  <Option key={language} value={language}>
                    {language === 'English' ? '🇬🇧 English' : '🇺🇦 Ukrainian'}
                  </Option>
                ))}
              </Select>
            </Col>
          )}

          {/* Status Filter */}
          {filterVisibility.readStatus && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <div style={{ marginBottom: 8 }}>Status</div>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Filter by status..."
                value={getFilterValues('readStatus')}
                onChange={(value) => handleFilterChange('readStatus', value)}
                allowClear
              >
                <Option value="Read">Read</Option>
                <Option value="Unread">Unread</Option>
                <Option value="Did not finish">Did not finish</Option>
              </Select>
            </Col>
          )}

          {/* Book Type Filter */}
          {filterVisibility.bookType && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <div style={{ marginBottom: 8 }}>Book Type</div>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Filter by book type..."
                value={getFilterValues('bookType')}
                onChange={(value) => handleFilterChange('bookType', value)}
                allowClear
              >
                <Option value="Paper">Paper</Option>
                <Option value="E-book">E-book</Option>
                <Option value="Audiobook">Audiobook</Option>
              </Select>
            </Col>
          )}

          {/* Favorites Filter */}
          {filterVisibility.favorite && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <div style={{ marginBottom: 8 }}>Favorites</div>
              <Select
                style={{ width: '100%' }}
                placeholder="Show favorites only"
                value={filters.favorite ? ['true'] : []}
                onChange={(value) => setFilters(prev => ({ ...prev, favorite: value && value.includes('true') }))}
                allowClear
              >
                <Option value="true">Favorites only</Option>
              </Select>
            </Col>
          )}
        </Row>
      </Card>

      {/* Filter Customization Modal */}
      <Modal
        title="Customize Filters"
        open={filterCustomizationVisible}
        onCancel={() => setFilterCustomizationVisible(false)}
        footer={[
          <Button key="reset" onClick={resetFilters}>
            Reset to Default
          </Button>,
          <Button key="cancel" onClick={() => setFilterCustomizationVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            icon={<SaveOutlined />}
            onClick={saveFilterPreferences}
          >
            Save Preferences
          </Button>,
        ]}
      >
        <div style={{ maxHeight: '400px', overflow: 'auto', padding: '12px 0' }}>
          <Text>Select filters to display:</Text>
          <Divider style={{ margin: '12px 0' }} />
          <Row gutter={[16, 16]}>
            {AVAILABLE_FILTERS.map(filter => (
              <Col span={12} key={filter.key}>
                <Checkbox
                  checked={tempFilterVisibility[filter.key]}
                  onChange={() => handleFilterVisibilityToggle(filter.key)}
                >
                  {filter.label}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>

      {/* Column Customization Modal */}
      <Modal
        title="Customize Columns"
        open={columnCustomizationVisible}
        onCancel={() => setColumnCustomizationVisible(false)}
        footer={[
          <Button key="reset" onClick={resetColumns}>
            Reset to Default
          </Button>,
          <Button key="cancel" onClick={() => setColumnCustomizationVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            icon={<SaveOutlined />}
            onClick={saveColumnPreferences}
          >
            Save Preferences
          </Button>,
        ]}
      >
        <div style={{ maxHeight: '400px', overflow: 'auto', padding: '12px 0' }}>
          <Text>Select columns to display:</Text>
          <Divider style={{ margin: '12px 0' }} />
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Checkbox
                checked={tempColumnVisibility.favorite}
                onChange={() => handleColumnVisibilityToggle('favorite')}
              >
                Favorite
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={tempColumnVisibility.title}
                onChange={() => handleColumnVisibilityToggle('title')}
              >
                Title
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={tempColumnVisibility.author}
                onChange={() => handleColumnVisibilityToggle('author')}
              >
                Author
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={tempColumnVisibility.publisher}
                onChange={() => handleColumnVisibilityToggle('publisher')}
              >
                Publisher
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={tempColumnVisibility.publishDate}
                onChange={() => handleColumnVisibilityToggle('publishDate')}
              >
                Published
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={tempColumnVisibility.genre}
                onChange={() => handleColumnVisibilityToggle('genre')}
              >
                Genre
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={tempColumnVisibility.language}
                onChange={() => handleColumnVisibilityToggle('language')}
              >
                Language
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={tempColumnVisibility.bookType}
                onChange={() => handleColumnVisibilityToggle('bookType')}
              >
                Type
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={tempColumnVisibility.readStatus}
                onChange={() => handleColumnVisibilityToggle('readStatus')}
              >
                Status
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={tempColumnVisibility.dateOfReading}
                onChange={() => handleColumnVisibilityToggle('dateOfReading')}
              >
                Date Read
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={tempColumnVisibility.rating}
                onChange={() => handleColumnVisibilityToggle('rating')}
              >
                Rating
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={tempColumnVisibility.actions}
                onChange={() => handleColumnVisibilityToggle('actions')}
              >
                Actions
              </Checkbox>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default FilterBar;
