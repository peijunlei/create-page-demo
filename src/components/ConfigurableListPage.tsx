import React from 'react';
import { Card, Form } from 'antd';
import { useAntdTable } from 'ahooks';
import { PageConfig, generateColumnRender } from '../utils/pageGenerator.tsx';
import ConfigurableSearch from './ConfigurableSearch';
import ConfigurableTable from './ConfigurableTable';
import type { ProductItem } from '../mock/productData';

/**
 * 可配置列表页面属性
 */
interface ConfigurableListPageProps {
  /**
   * 页面配置
   */
  config: PageConfig;
  /**
   * 获取数据的函数
   */
  fetchData: (params: any) => Promise<{
    data: {
      list: ProductItem[];
      total: number;
      pageSize: number;
      current: number;
    };
  }>;
}

/**
 * 可配置列表页面组件
 */
const ConfigurableListPage: React.FC<ConfigurableListPageProps> = ({ config, fetchData }) => {
  // 表单实例
  const [form] = Form.useForm();

  /**
   * 获取表格数据
   */
  const getTableData = async ({ current, pageSize }: { current: number; pageSize: number }, formData: any) => {
    try {
      const response = await fetchData({
        ...formData,
        current,
        pageSize,
      });
      return {
        total: response.data.total,
        list: response.data.list,
      };
    } catch (error) {
      console.error(`获取${config.name}列表失败:`, error);
      return {
        total: 0,
        list: [],
      };
    }
  };

  // 使用 useAntdTable 钩子
  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form,
  });

  const { submit, reset } = search;

  // 生成表格列配置
  const columns = config.columns.map(column => ({
    title: column.title,
    dataIndex: column.dataIndex,
    key: column.dataIndex,
    render: generateColumnRender(column),
  }));

  return (
    <div className="app-container">
      <Card className="search-card">
        <ConfigurableSearch
          form={form}
          config={config.searchForm}
          onSubmit={submit}
          onReset={reset}
        />
      </Card>

      <Card className="table-card" title={`${config.name}列表`}>
        <ConfigurableTable
          tableProps={tableProps}
          columns={columns}
          actions={config.actions}
        />
      </Card>
    </div>
  );
};

export default ConfigurableListPage; 