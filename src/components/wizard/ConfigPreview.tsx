import React from 'react';
import { Button, Card, Space, Tabs, Typography } from 'antd';
import { PageConfig } from '../../utils/pageGenerator.tsx';
import ConfigurableListPage from '../ConfigurableListPage';
import dayjs from 'dayjs';
import {
  generateSearchFormCode,
  generateTableCode,
  generateEntryCode,
  generateWebApiCode
} from '../../utils/templateGenerator';

const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

interface ConfigPreviewProps {
  config: PageConfig;
  onPrev: () => void;
  onComplete: () => void;
}

const ConfigPreview: React.FC<ConfigPreviewProps> = ({ config, onPrev, onComplete }) => {
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

  const processedConfig = processConfig(config);

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

  // 生成搜索表单代码
  const getSearchFormCode = () => {
    return generateSearchFormCode(config);
  };

  // 生成入口文件代码
  const getEntryCode = () => {
    return generateEntryCode(config);
  };

  // 生成 Web API 接口代码
  const getWebApiCode = () => {
    return generateWebApiCode();
  };

  // 生成表格代码
  const getTableCode = () => {
    return generateTableCode(config);
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
          <Typography>
            <Title level={4}>页面入口文件代码</Title>
            <Paragraph>
              <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, overflow: 'auto' }}>
                <code>{getEntryCode()}</code>
              </pre>
            </Paragraph>
            <Paragraph>
              <Text type="secondary">
                这是完整的页面入口文件，包含了数据获取、状态管理、事件处理等完整逻辑。
              </Text>
            </Paragraph>
          </Typography>
        </TabPane>
        <TabPane tab="SearchForm.tsx" key="search">
          <Typography>
            <Title level={4}>搜索表单组件代码</Title>
            <Paragraph>
              <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, overflow: 'auto' }}>
                <code>{getSearchFormCode()}</code>
              </pre>
            </Paragraph>
            <Paragraph>
              <Text type="secondary">
                这是根据您的配置生成的搜索表单组件代码，可以直接在项目中使用。
              </Text>
            </Paragraph>
          </Typography>
        </TabPane>
        <TabPane tab="DataTable.tsx" key="table">
          <Typography>
            <Title level={4}>表格组件代码</Title>
            <Paragraph>
              <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, overflow: 'auto' }}>
                <code>{getTableCode()}</code>
              </pre>
            </Paragraph>
            <Paragraph>
              <Text type="secondary">
                这是根据您的配置生成的表格组件代码，包含了所有列的渲染逻辑和操作按钮。
              </Text>
            </Paragraph>
          </Typography>
        </TabPane>
        <TabPane tab="webapi.ts" key="api">
          <Typography>
            <Title level={4}>Web API 接口代码</Title>
            <Paragraph>
              <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, overflow: 'auto' }}>
                <code>{getWebApiCode()}</code>
              </pre>
            </Paragraph>
            <Paragraph>
              <Text type="secondary">
                这是根据您的配置生成的 Web API 接口方法，包含了完整的 CRUD 操作接口定义。
              </Text>
            </Paragraph>
          </Typography>
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