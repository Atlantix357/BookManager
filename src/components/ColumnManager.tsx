import React from 'react';
import { ColumnVisibility } from '../types';
import { Dropdown, Checkbox, Button, Space, Divider } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

interface ColumnManagerProps {
  columnVisibility: ColumnVisibility;
  onColumnVisibilityChange: (visibility: ColumnVisibility) => void;
}

const ColumnManager: React.FC<ColumnManagerProps> = ({ 
  columnVisibility, 
  onColumnVisibilityChange 
}) => {
  const handleColumnToggle = (column: keyof ColumnVisibility) => {
    const updatedVisibility = {
      ...columnVisibility,
      [column]: !columnVisibility[column]
    };
    onColumnVisibilityChange(updatedVisibility);
  };

  const resetColumns = () => {
    onColumnVisibilityChange({
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
  };

  const items = [
    {
      key: 'columns',
      label: (
        <div style={{ padding: '8px 0' }}>
          <div style={{ padding: '0 8px 8px', fontWeight: 'bold' }}>
            Show/Hide Columns
          </div>
          <Divider style={{ margin: '0 0 8px 0' }} />
          <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '0 8px' }}>
            <Checkbox
              checked={columnVisibility.favorite}
              onChange={() => handleColumnToggle('favorite')}
              style={{ display: 'block', marginBottom: 8 }}
            >
              Favorite
            </Checkbox>
            <Checkbox
              checked={columnVisibility.title}
              onChange={() => handleColumnToggle('title')}
              style={{ display: 'block', marginBottom: 8 }}
            >
              Title
            </Checkbox>
            <Checkbox
              checked={columnVisibility.author}
              onChange={() => handleColumnToggle('author')}
              style={{ display: 'block', marginBottom: 8 }}
            >
              Author
            </Checkbox>
            <Checkbox
              checked={columnVisibility.publisher}
              onChange={() => handleColumnToggle('publisher')}
              style={{ display: 'block', marginBottom: 8 }}
            >
              Publisher
            </Checkbox>
            <Checkbox
              checked={columnVisibility.publishDate}
              onChange={() => handleColumnToggle('publishDate')}
              style={{ display: 'block', marginBottom: 8 }}
            >
              Published
            </Checkbox>
            <Checkbox
              checked={columnVisibility.genre}
              onChange={() => handleColumnToggle('genre')}
              style={{ display: 'block', marginBottom: 8 }}
            >
              Genre
            </Checkbox>
            <Checkbox
              checked={columnVisibility.language}
              onChange={() => handleColumnToggle('language')}
              style={{ display: 'block', marginBottom: 8 }}
            >
              Language
            </Checkbox>
            <Checkbox
              checked={columnVisibility.bookType}
              onChange={() => handleColumnToggle('bookType')}
              style={{ display: 'block', marginBottom: 8 }}
            >
              Type
            </Checkbox>
            <Checkbox
              checked={columnVisibility.readStatus}
              onChange={() => handleColumnToggle('readStatus')}
              style={{ display: 'block', marginBottom: 8 }}
            >
              Status
            </Checkbox>
            <Checkbox
              checked={columnVisibility.dateOfReading}
              onChange={() => handleColumnToggle('dateOfReading')}
              style={{ display: 'block', marginBottom: 8 }}
            >
              Date Read
            </Checkbox>
            <Checkbox
              checked={columnVisibility.rating}
              onChange={() => handleColumnToggle('rating')}
              style={{ display: 'block', marginBottom: 8 }}
            >
              Rating
            </Checkbox>
            <Checkbox
              checked={columnVisibility.actions}
              onChange={() => handleColumnToggle('actions')}
              style={{ display: 'block', marginBottom: 8 }}
            >
              Actions
            </Checkbox>
          </div>
          <Divider style={{ margin: '8px 0' }} />
          <div style={{ padding: '0 8px', textAlign: 'right' }}>
            <Button size="small" onClick={resetColumns}>
              Reset to Default
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
      <Button icon={<SettingOutlined />}>
        Columns
      </Button>
    </Dropdown>
  );
};

export default ColumnManager;
