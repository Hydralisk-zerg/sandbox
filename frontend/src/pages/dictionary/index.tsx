import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { api } from "../../services/apiClient";
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CountryData } from "../../interfaces/IUser";

interface ApiResponse {
  countries: CountryData[];
}

const DictionaryPage: React.FC = () => {
  const { dictionaryName } = useParams();
  const [data, setData] = useState<CountryData[]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.getDictianaryInfoPage(dictionaryName) as ApiResponse;
      setData(response.countries);
    }
    fetchData();
  }, [dictionaryName]);


    const columns: ColumnsType<CountryData> = [
      {
        title: 'Name (English)',
        dataIndex: 'name_en',
        key: 'name_en',
      },
      {
        title: 'Name (Ukrainian)',
        dataIndex: 'name_uk',
        key: 'name_uk',
      },
      {
        title: 'Alpha-2 code',
        dataIndex: 'alpha2',
        key: 'alpha2',
      },
      {
        title: 'Alpha-3 code',
        dataIndex: 'alpha3',
        key: 'alpha3',
      },
      {
        title: 'Numeric code',
        dataIndex: 'numeric_code',
        key: 'numeric_code',
      },

    ];
  
  return (
    <>
      <h1>Dictionary {dictionaryName}</h1>
      <Table 
          columns={columns} 
          dataSource={data} 
          // loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
    </>
      
    );
  
};

export default DictionaryPage;