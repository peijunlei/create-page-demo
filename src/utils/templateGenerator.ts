import { PageConfig } from './pageGenerator.tsx';

/**
 * 生成搜索表单代码
 */
export const generateSearchFormCode = (config: PageConfig) => {
  // 生成表单项代码
  const formItemsCode = config.searchForm.map(item => {
    const rulesCode = item.placeholder ? 'rules={[{ whitespace: true }]}' : '';
    
    let inputCode = '';
    if (item.type === 'input') {
      inputCode = `<Input placeholder="${item.placeholder || ''}" allowClear />`;
    } else if (item.type === 'select') {
      const optionsCode = (item.options || []).map(option => 
        `<Select.Option key="${option.value}" value="${option.value}">${option.label}</Select.Option>`
      ).join('\n              ');
      
      inputCode = `<Select placeholder="${item.placeholder || ''}" allowClear>
              ${optionsCode}
            </Select>`;
    }
    
    return `        <Col span={${item.span || 6}}>
          <Form.Item
            name="${item.name}"
            label="${item.label}"
            ${rulesCode}
          >
            ${inputCode}
          </Form.Item>
        </Col>`;
  }).join('\n');

  return `import React from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

interface SearchFormProps {
  form: any;
  onSubmit: () => void;
  onReset: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ form, onSubmit, onReset }) => {
  const handleSearch = () => {
    onSubmit();
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
      <Row gutter={16} style={{ width: '100%' }}>
${formItemsCode}
        <Col span={24}>
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset} style={{ marginLeft: 8 }}>
              重置
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;`;
};

/**
 * 生成表格代码
 */
export const generateTableCode = (config: PageConfig) => {
  // 生成接口定义
  const interfaceCode = config.columns.map(column => {
    let type = 'any';
    if (column.type === 'money') type = 'number';
    else if (column.type === 'datetime' || column.type === 'date') type = 'string';
    
    return `  ${column.dataIndex}: ${type};`;
  }).join('\n');

  // 生成列定义
  const columnsCode = config.columns.map(column => {
    let renderCode = '';
    
    if (column.type === 'enum') {
      const enumMapStr = JSON.stringify(column.enumMap || {});
      renderCode = `,
      render: (value: any) => {
        const enumMap = ${enumMapStr};
        return enumMap[value] || '-';
      }`;
    } else if (column.type === 'money') {
      renderCode = `,
      render: (value: number) => {
        return value ? formatMoney(value) : '-';
      }`;
    } else if (column.type === 'datetime') {
      renderCode = `,
      render: (value: string) => {
        return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-';
      }`;
    } else if (column.type === 'date') {
      renderCode = `,
      render: (value: string) => {
        return value ? dayjs(value).format('YYYY-MM-DD') : '-';
      }`;
    }
    
    return `    {
      title: '${column.title}',
      dataIndex: '${column.dataIndex}',
      key: '${column.dataIndex}'${renderCode}
    }`;
  }).join(',\n');

  // 生成操作列
  let actionsCode = '';
  if (config.actions?.showView || config.actions?.showEdit) {
    const actionButtons = [];
    if (config.actions?.showView) {
      actionButtons.push(`          <Button type="link" icon={<EyeOutlined />} onClick={() => onView?.(record)}>
            查看
          </Button>`);
    }
    if (config.actions?.showEdit) {
      actionButtons.push(`          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit?.(record)}>
            编辑
          </Button>`);
    }
    
    actionsCode = `,
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record: DataItem) => (
        <Space>
${actionButtons.join('\n')}
        </Space>
      ),
    }`;
  }

  return `import React from 'react';
import { Table, Button, Space } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatMoney } from '../utils/util';

interface DataItem {
  id: number;
${interfaceCode}
}

interface TableProps {
  tableProps: any;
  onView?: (record: DataItem) => void;
  onEdit?: (record: DataItem) => void;
}

const DataTable: React.FC<TableProps> = ({ tableProps, onView, onEdit }) => {
  const columns = [
${columnsCode}${actionsCode}
  ];

  return (
    <Table
      {...tableProps}
      columns={columns}
      rowKey="id"
    />
  );
};

export default DataTable;`;
};

/**
 * 生成入口文件代码
 */
export const generateEntryCode = (config: PageConfig) => {
  // 生成接口定义
  const interfaceCode = config.columns.map(column => {
    let type = 'any';
    if (column.type === 'money') type = 'number';
    else if (column.type === 'datetime' || column.type === 'date') type = 'string';
    
    return `  ${column.dataIndex}: ${type};`;
  }).join('\n');

  return `import React from 'react';
import { Card, Form } from 'antd';
import { useAntdTable } from 'ahooks';
import SearchForm from './SearchForm';
import DataTable from './DataTable';
import { getListApi } from './webapi';

interface DataItem {
  id: number;
${interfaceCode}
}

const IndexPage: React.FC = () => {
  // 表单实例
  const [form] = Form.useForm();

  // 获取表格数据
  const getTableData = async ({ current, pageSize }: { current: number; pageSize: number }, formData: any) => {
    try {
      const response = await getListApi({
        ...formData,
        current,
        pageSize,
      });
      
      return {
        total: response.data.total,
        list: response.data.list,
      };
    } catch (error) {
      console.error('获取数据失败:', error);
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

  // 处理查看
  const handleView = (record: DataItem) => {
    console.log('查看记录:', record);
    // 这里可以跳转到详情页面或打开详情弹窗
  };

  // 处理编辑
  const handleEdit = (record: DataItem) => {
    console.log('编辑记录:', record);
    // 这里可以跳转到编辑页面或打开编辑弹窗
  };

  return (
    <Card title="${config.name}列表">
      <SearchForm
        form={form}
        onSubmit={submit}
        onReset={reset}
      />
      <DataTable
        tableProps={tableProps}
        onView={handleView}
        onEdit={handleEdit}
      />
    </Card>
  );
};

export default IndexPage;`;
};

/**
 * 生成 Web API 接口代码
 */
export const generateWebApiCode = () => {
  return `import { request } from '../utils/request';

/**
 * 获取列表
 */
export const getListApi = (params: any) => {
  return request({
    url: '/api/list',
    method: 'POST',
    data: params,
  });
};

/**
 * 获取详情
 */
export const getDetailApi = (id: number) => {
  return request({
    url: \`/api/detail/\${id}\`,
    method: 'GET',
  });
};

/**
 * 创建
 */
export const createApi = (data: any) => {
  return request({
    url: '/api/create',
    method: 'POST',
    data,
  });
};

/**
 * 更新
 */
export const updateApi = (id: number, data: any) => {
  return request({
    url: \`/api/update/\${id}\`,
    method: 'PUT',
    data,
  });
};

/**
 * 删除
 */
export const deleteApi = (id: number) => {
  return request({
    url: \`/api/delete/\${id}\`,
    method: 'DELETE',
  });
};

/**
 * 批量删除
 */
export const batchDeleteApi = (ids: number[]) => {
  return request({
    url: '/api/batch-delete',
    method: 'DELETE',
    data: { ids },
  });
};`;
}; 