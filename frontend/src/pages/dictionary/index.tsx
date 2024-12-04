import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { api } from "../../services/apiClient";
import { Table, Tooltip, Input, Space, Button } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';

interface GenericDataType {
  id: number;
  [key: string]: any;
}

interface ApiResponse {
  [key: string]: GenericDataType[];
}

const DictionaryPage: React.FC = () => {
  const { dictionaryName } = useParams<{ dictionaryName?: string }>();
  const [data, setData] = useState<GenericDataType[]>([]);
  const [filteredData, setFilteredData] = useState<GenericDataType[]>([]);
  const [columns, setColumns] = useState<ColumnsType<GenericDataType>>([]);
  const [searchText, setSearchText] = useState('');

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const parts = text.toString().split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) => 
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={index} style={{ backgroundColor: '#ffd591' }}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!dictionaryName) return;

      const response = await api.getDictianaryInfoPage(dictionaryName) as ApiResponse;
      const tableData = response[dictionaryName] || [];
      setData(tableData);
      setFilteredData(tableData);

      if (tableData.length > 0) {
        const firstItem = tableData[0];
        const keys = Object.keys(firstItem).filter(key => key !== 'id');
        
        const regularKeys = keys.filter(key => key !== 'description');
        const hasDescription = keys.includes('description');

        const calculateDescriptionWidth = (totalColumns: number): string => {
          if (totalColumns <= 3) return '60%';
          if (totalColumns <= 5) return '35%';
          if (totalColumns <= 7) return '25%';
          return '20%';
        };

        const regularColumnWidth = hasDescription 
          ? `${(100 - parseInt(calculateDescriptionWidth(keys.length))) / regularKeys.length}%`
          : `${100 / regularKeys.length}%`;

        const regularColumns: ColumnsType<GenericDataType> = regularKeys.map(key => ({
          title: formatColumnTitle(key),
          dataIndex: key,
          key: key,
          width: regularColumnWidth,
          render: (text: string) => highlightText(text, searchText),
          sorter: (a: any, b: any) => {
            if (typeof a[key] === 'string') {
              return a[key].localeCompare(b[key]);
            }
            return a[key] - b[key];
          }
        }));

        if (hasDescription) {
          const descriptionColumn: ColumnType<GenericDataType> = {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: calculateDescriptionWidth(keys.length),
            render: (text: string) => (
              <Tooltip 
                title={highlightText(text, searchText)}
                placement="topLeft"
                overlayStyle={{ maxWidth: '500px' }}
              >
                <div style={{
                  maxWidth: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {highlightText(text, searchText)}
                </div>
              </Tooltip>
            ),
            sorter: (a: GenericDataType, b: GenericDataType) => 
              (a.description || '').localeCompare(b.description || '')
          };
          
          regularColumns.push(descriptionColumn);
        }

        setColumns(regularColumns);
      }
    };
    fetchData();
  }, [dictionaryName]);

  // Эффект для фильтрации данных при изменении поискового запроса
  useEffect(() => {
    if (!searchText) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item => {
      return Object.keys(item).some(key => {
        if (key === 'id') return false;
        const cellValue = item[key]?.toString().toLowerCase() || '';
        return cellValue.includes(searchText.toLowerCase());
      });
    });

    setFilteredData(filtered);
  }, [searchText, data]);

  const formatColumnTitle = (key: string): string => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleReset = () => {
    setSearchText('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1>Dictionary: {formatColumnTitle(dictionaryName || '')}</h1>
        <Space>
          <Input
            placeholder="Поиск..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Button 
            icon={<ClearOutlined />} 
            onClick={handleReset}
            disabled={!searchText}
          />
        </Space>
      </Space>
      <Table 
        columns={columns} 
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default DictionaryPage;
