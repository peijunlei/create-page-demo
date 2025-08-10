import React, { useMemo } from 'react';
import { Button, Card, Space, Tabs, Typography } from 'antd';
import { PageConfig } from '../../utils/pageGenerator.tsx';
import ConfigurableListPage from '../ConfigurableListPage';
import dayjs from 'dayjs';
import {
  generateSearchFormCode,
  generateTableCode,
  generateEntryCode,
  generateWebApiCode
} from '../../utils/new-templateGenerator';
import CodeCopy from '../CodeCopy/index.tsx';

const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

interface ConfigPreviewProps {
  config: PageConfig;
  onPrev: () => void;
  onComplete: () => void;
}
// 处理枚举映射字符串转换为对象
const processConfig = (config: PageConfig): PageConfig => {
  const processedConfig = { ...config };
  // 处理表格列中的枚举映射
  if (processedConfig.columns) {
    processedConfig.columns = processedConfig.columns.map(column => {
      const newColumn = { ...column };
      if (newColumn.type === 'enum' && Array.isArray(newColumn.enumMap)) {
        // 将对象数组格式转换为键值对对象
        newColumn.enumMap = (newColumn.enumMap as any[]).reduce((acc: Record<string | number, string>, item: any) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
      }
      return newColumn;
    });
  }

  return processedConfig;
};
const ConfigPreview: React.FC<ConfigPreviewProps> = ({ config, onPrev, onComplete }) => {

  const processedConfig = useMemo(() => processConfig(config), [config]);
  // 根据配置生成 mock 数据
  const generateMockData = (params: {
    pageSize: number;
    current: number;
    [key: string]: any;
  }) => {
    const { pageSize, current, ...searchParams } = params;

    // 生成100条模拟数据
    const allData = Array.from({ length: 100 }, (_, i) => {
      const item: any = { id: i + 1 };

      // 根据配置的列生成数据
      processedConfig.columns?.forEach(column => {
        switch (column.type) {
          case 'text':
            item[column.dataIndex] = `${column.title}${i + 1}`;
            break;
          case 'enum':
            if (column.enumMap && typeof column.enumMap === 'object') {
              const keys = Object.keys(column.enumMap);
              const randomKey = keys[Math.floor(Math.random() * keys.length)];
              item[column.dataIndex] = randomKey;
            } else {
              item[column.dataIndex] = Math.floor(Math.random() * 2);
            }
            break;
          case 'money':
            item[column.dataIndex] = Math.floor(Math.random() * 1000000);
            break;
          case 'datetime':
            item[column.dataIndex] = dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD HH:mm:ss');
            break;
          case 'date':
            item[column.dataIndex] = dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD');
            break;
          case 'custom':
            item[column.dataIndex] = `自定义${i + 1}`;
            break;
          default:
            item[column.dataIndex] = `数据${i + 1}`;
        }
      });

      return item;
    });

    // 根据搜索条件过滤数据
    let filteredData = allData;

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        filteredData = filteredData.filter(item => {
          const itemValue = item[key];
          if (typeof itemValue === 'string') {
            return itemValue.includes(value);
          }
          return itemValue === value;
        });
      }
    });

    // 计算分页数据
    const total = filteredData.length;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    const list = filteredData.slice(start, end);

    // 模拟网络延迟
    return new Promise<{
      data: {
        list: any[];
        total: number;
        pageSize: number;
        current: number;
      };
    }>(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            list,
            total,
            pageSize,
            current,
          },
        });
      }, 300);
    });
  };

  return (
    <Card title="步骤4：配置预览" >
      <Tabs defaultActiveKey="preview">
        <TabPane tab="页面预览" key="preview">
          <ConfigurableListPage
            config={processedConfig}
            fetchData={generateMockData}
          />
        </TabPane>
        <TabPane tab="index.tsx" key="entry">
            <CodeCopy code={generateEntryCode(processedConfig)} title="index.tsx" />
        </TabPane>
        <TabPane tab="SearchForm.tsx" key="search">
          <CodeCopy code={generateSearchFormCode(processedConfig)} title="SearchForm.tsx" />
        </TabPane>
        <TabPane tab="DataTable.tsx" key="table">
          <CodeCopy code={generateTableCode(processedConfig)} title="DataTable.tsx" />
        </TabPane>
        <TabPane tab="webapi.ts" key="api">
          <CodeCopy code={generateWebApiCode()} title="webapi.ts" />
        </TabPane>

      </Tabs>
      <div style={{ marginTop: 16 }}>
        <Space>
          <Button onClick={onPrev}>上一步</Button>
          <Button type="primary" onClick={onComplete}>
            完成
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default ConfigPreview; 