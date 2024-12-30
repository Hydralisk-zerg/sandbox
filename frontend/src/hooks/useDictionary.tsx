import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/apiClient';

// Визначаємо типи
interface DictionaryContextType {
  fetchDictionaryData: (sourceTable: string, sourceColumn: string) => Promise<any[]>;
  fetchTablesList: () => Promise<string[]>;
  fetchTableColumns: (tableName: string) => Promise<string[]>;
  clearCache: () => void;
}

interface DictionaryProviderProps {
  children: React.ReactNode;
}

interface ApiResponse {
    [key: string]: any[];
  }
// Створюємо контекст
const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

const AVAILABLE_TABLES = {
  countries: 'countries',
  cities: 'cities',
  terminals: 'terminals',
  currencies: 'currencies',
  containers: 'containers',
  danger_classes: 'danger_classes',
  incoterms: 'incoterms',
  packaging_types: 'packaging_types',
  delivery_types: 'delivery_types',
  cargos: 'cargos'
} as const;

export const DictionaryProvider: React.FC<DictionaryProviderProps> = ({ children }) => {
  const [dataCache, setDataCache] = useState<Record<string, any[]>>({});
//   const [, setTablesCache] = useState<string[]>([]);
  const [columnsCache, setColumnsCache] = useState<Record<string, string[]>>({});

  const fetchTablesList = useCallback(async () => {
    try {
      const tables = Object.keys(AVAILABLE_TABLES);
    //   setTablesCache(tables);
      return tables;
    } catch (error) {
      console.error('Помилка завантаження списку таблиць:', error);
      return [];
    }
  }, []);

  const fetchTableColumns = useCallback(async (tableName: string) => {
    try {
      if (!AVAILABLE_TABLES[tableName as keyof typeof AVAILABLE_TABLES]) {
        console.error('Невідома таблиця:', tableName);
        return [];
      }

      if (columnsCache[tableName]) {
        return columnsCache[tableName];
      }

      const response = await api.get<ApiResponse>(`/dictionary/${tableName}/`);
      console.log('Response from API:', response);

      const responseData = response as unknown as ApiResponse;
      const data = responseData[tableName];

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Дані відсутні або неправильний формат');
      }

      const columns = Object.keys(data[0]);
      console.log('Found columns:', columns);

      setColumnsCache(prev => ({
        ...prev,
        [tableName]: columns
      }));
      
      return columns;
    } catch (error) {
      console.error('Помилка завантаження колонок:', error);
      return [];
    }
  }, [columnsCache]);

  const fetchDictionaryData = useCallback(async (sourceTable: string, sourceColumn: string): Promise<any[]> => {
    try {
      if (!sourceColumn || !AVAILABLE_TABLES[sourceTable as keyof typeof AVAILABLE_TABLES]) {
        return [];
      }

      const cacheKey = `${sourceTable}_${sourceColumn}`;
      
      if (dataCache[cacheKey]?.length > 0) {
        return dataCache[cacheKey];
      }

      const response = await api.get<ApiResponse>(`/dictionary/${sourceTable}/`);
      const responseData = response as unknown as ApiResponse;
      const data = responseData[sourceTable];

      if (!Array.isArray(data)) {
        throw new Error('Неправильний формат даних');
      }

      const formattedData = data.map((item: any) => {
        let label = '';
        
        switch(sourceTable) {
          case 'countries':
          case 'cities':
          case 'terminals':
          case 'packaging_types':
            label = item[`name_${sourceColumn}`] || item[sourceColumn] || item.name || '';
            break;
          case 'currencies':
            label = `${item.code || ''} - ${item.name || ''}`;
            break;
          case 'delivery_types':
            label = item.short_name || item.name || '';
            break;
          case 'cargos':
            label = item[`name_${sourceColumn}`] || item.cargo_code || '';
            break;
          default:
            label = item[sourceColumn] || '';
        }

        return {
          value: item.id,
          label: label || 'Без назви'
        };
      });

      setDataCache(prev => ({
        ...prev,
        [cacheKey]: formattedData
      }));

      return formattedData;
    } catch (error) {
      console.error(`Помилка отримання даних для ${sourceTable}:`, error);
      return [];
    }
  }, [dataCache]);

  const clearCache = useCallback(() => {
    setDataCache({});
    setColumnsCache({});
  }, []);

  return (
    <DictionaryContext.Provider value={{ 
      fetchDictionaryData, 
      fetchTablesList, 
      fetchTableColumns, 
      clearCache 
    }}>
      {children}
    </DictionaryContext.Provider>
  );
};

export const useDictionary = () => {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context;
};
