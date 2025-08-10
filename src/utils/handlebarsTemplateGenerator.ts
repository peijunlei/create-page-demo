import Handlebars from 'handlebars';
import { PageConfig } from './pageGenerator.tsx';

/**
 * 注册 Handlebars 助手函数
 */
Handlebars.registerHelper('ifEquals', function (this: any, arg1: any, arg2: any, options: any) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});
// 添加 switch 助手函数
Handlebars.registerHelper('switch', function(this: any, value: any, options: any) {
  this.switch_value = value;
  this.switch_break = false;
  return options.fn(this);
});

Handlebars.registerHelper('case', function(this: any, value: any, options: any) {
  if (this.switch_break || this.switch_value !== value) {
    return '';
  }
  this.switch_break = true;
  return options.fn(this);
});

Handlebars.registerHelper('default', function(this: any, options: any) {
  if (this.switch_break) {
    return '';
  }
  return options.fn(this);
});

// 添加 options 转换助手函数
Handlebars.registerHelper('formatOptions', function(options: any[]) {
  if (!options || !Array.isArray(options)) {
    return '{[]}';
  }
  return `{${JSON.stringify(options)}}`;
});
Handlebars.registerHelper('json', function (obj: any) {
  return JSON.stringify(obj);
});

Handlebars.registerHelper('getType', function (type: string) {
  if (type === 'money') return 'number';
  if (type === 'datetime' || type === 'date') return 'string';
  return 'any';
});

Handlebars.registerHelper('renderColumn', function (column: any) {
  let renderCode = '';
  switch (column.type) {
    case 'enum':
      renderCode = `
      render: (value: any) => {
        const enumMap = ${JSON.stringify(column.enumMap || {})};
        return enumMap[value] || '-';
      }`;
      break;
    case 'money':
      renderCode = `
      render: (value: number) => {
        return value ? formatMoney(value) : '-';
      }`;
      break;
    case 'datetime':
      renderCode = `
      render: (value: string) => {
        return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-';
      }`;
      break;
    case 'date':
      renderCode = `
      render: (value: string) => {
        return value ? dayjs(value).format('YYYY-MM-DD') : '-';
      }`;
      break;
    default:
      renderCode = `
      render: (value: string) => {
        return value || '-';
      }`;
  }

  return `{
      title: '${column.title}',
      dataIndex: '${column.dataIndex}',
      key: '${column.dataIndex}',${renderCode}
    },`;
});

/**
 * 基于 Handlebars 的模板生成器（前端版本）
 */
export class HandlebarsTemplateGenerator {
  /**
   * 内联模板定义
   */
  private templates = {
    searchForm: Handlebars.compile(
`import React from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import type { FormInstance } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

interface SearchFormProps {
  form: FormInstance<any>;
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
    <Form form={form} layout="inline" >
      <Row gutter={16} >
        {{#each searchForm}}
        <Col span={{span}}>
          <Form.Item
            name="{{name}}"
            label="{{label}}"
          >
            {{#switch type}}
              {{#case "input"}}
                <Input placeholder="{{placeholder}}" allowClear />
              {{/case}}
              {{#case "select"}}
                <Select 
                  placeholder="{{placeholder}}" 
                  allowClear 
                  options={{{formatOptions options}}}
                />
              {{/case}}
              {{#case "date"}}
                <DatePicker placeholder="{{placeholder}}" style={{ width: '100%' }} />
              {{/case}}
              {{#case "datetime"}}
                <DatePicker 
                  showTime 
                  placeholder="{{placeholder}}" 
                  style={{ width: '100%' }} 
                />
              {{/case}}
              {{#default}}
                <Input placeholder="{{placeholder}}" allowClear />
              {{/default}}
            {{/switch}}
          </Form.Item>
        </Col>
        {{/each}}
        <Col span={24}>
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset} >
              重置
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;`
),

    dataTable: Handlebars.compile(`import React from 'react';
import { Table, Button, Space } from 'antd';
import dayjs from 'dayjs';
import { formatMoney } from '../utils/util';

interface DataItem {
  id: number;
  [key: string]: any;
}

interface TableProps {
  tableProps: any;
  onView?: (record: DataItem) => void;
  onEdit?: (record: DataItem) => void;
}

const DataTable: React.FC<TableProps> = ({ tableProps, onView, onEdit }) => {
  const columns = [
    {{#each columns}}
    {{{renderColumn this }}}
    {{/each}}
    {
      title: '操作',
      key: 'action',
      render: (_, record: DataItem) => (
        <Space>
          <Button type="link" onClick={() => onView?.(record)}>
            查看
          </Button>
          <Button type="link" onClick={() => onEdit?.(record)}>
            编辑
          </Button>
        </Space>
      ),
    }
  ];

  return (
    <Table
      {...tableProps}
      columns={columns}
      rowKey="id"
    />
  );
};

export default DataTable;`),

    indexPage: Handlebars.compile(`import React from 'react';
import { Card, Form } from 'antd';
import { useAntdTable } from 'ahooks';
import SearchForm from './SearchForm';
import DataTable from './DataTable';
import { getListApi } from './webapi';
    
interface DataItem {
  id: number;
  [key: string]: any;
}
    
const IndexPage: React.FC = () => {
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
    <Card title="{{name}}">
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
    
export default IndexPage;`),

    webapi: Handlebars.compile(`import { request } from '../utils/request';

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
};`)
  };

  /**
   * 生成搜索表单代码
   */
  generateSearchFormCode(config: PageConfig): string {
    return this.templates.searchForm({
      searchForm: config.searchForm,
    });
  }

  /**
   * 生成表格代码
   */
  generateTableCode(config: PageConfig): string {
    return this.templates.dataTable({
      columns: config.columns,
      actions: config.actions,
    });
  }

  /**
   * 生成入口文件代码
   */
  generateEntryCode(config: PageConfig): string {
    return this.templates.indexPage({
      name: config.name
    });
  }

  /**
   * 生成 Web API 接口代码
   */
  generateWebApiCode(): string {
    return this.templates.webapi({});
  }

  /**
   * 生成所有文件代码
   */
  generateAllFiles(config: PageConfig) {
    return {
      searchForm: this.generateSearchFormCode(config),
      dataTable: this.generateTableCode(config),
      indexPage: this.generateEntryCode(config),
      webapi: this.generateWebApiCode(),
    };
  }
}

// 导出默认实例
export const templateGenerator = new HandlebarsTemplateGenerator(); 