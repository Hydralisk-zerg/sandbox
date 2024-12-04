import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { api } from "../../services/apiClient";
import { Table, Input, Space, Button } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { ApiResponse, GenericDataType } from "../../interfaces/interfase";

const DictionaryPage: React.FC = () => {
  const { dictionaryName } = useParams<{ dictionaryName?: string }>();
  const [data, setData] = useState<GenericDataType[]>([]);
  const [filteredData, setFilteredData] = useState<GenericDataType[]>([]);
  const [columns, setColumns] = useState<ColumnsType<GenericDataType>>([]);
  const [searchText, setSearchText] = useState('');

  const getDescriptionWidth = (totalColumns: number): number => {
    if (totalColumns <= 2) return 800;
    if (totalColumns <= 3) return 600;
    if (totalColumns <= 5) return 300;
    return 250;
  };

  const getRegularColumnWidth = (totalColumns: number): number => {
    return 150; // фиксированная ширина для обычных колонок
  };

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

        const regularColumns: ColumnsType<GenericDataType> = regularKeys.map(key => ({
          title: formatColumnTitle(key),
          dataIndex: key,
          key: key,
          width: getRegularColumnWidth(keys.length),
          ellipsis: true,
          render: (text: string) => highlightText(text?.toString() || '', searchText),
        }));

        if (hasDescription) {
          const descriptionColumn: ColumnType<GenericDataType> = {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: getDescriptionWidth(keys.length),
            render: (text: string) => {
              return (
                <div
                  style={{
                    position: 'relative',
                    minHeight: '20px',
                    maxWidth: getDescriptionWidth(keys.length),
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget;
                      target.style.whiteSpace = 'normal';
                      target.style.wordBreak = 'break-word';
                      target.style.backgroundColor = '#fafafa';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget;
                      target.style.whiteSpace = 'nowrap';
                      target.style.wordBreak = 'normal';
                      target.style.backgroundColor = 'transparent';
                    }}
                  >
                    {highlightText(text, searchText)}
                  </div>
                </div>
              );
            },
          };
          
          regularColumns.push(descriptionColumn);
        }

        setColumns(regularColumns);
      }
    };
    fetchData();
  }, [dictionaryName, searchText]);

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
    <div style={{ padding: '20px', maxWidth: '100%' }}>
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
        pagination={{ pageSize: 15 }}
        style={{ width: '100%' }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default DictionaryPage;
