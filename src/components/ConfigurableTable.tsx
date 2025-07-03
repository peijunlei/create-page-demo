import React from 'react';
import { Button, Space, Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';

/**
 * 可配置表格组件属性
 */
interface ConfigurableTableProps {
  /**
   * 表格属性
   */
  tableProps: any;
  /**
   * 表格列配置
   */
  columns: ColumnsType<any>;
  /**
   * 操作列配置
   */
  actions?: {
    showView?: boolean;
    showEdit?: boolean;
    customActions?: (record: any) => React.ReactNode;
  };
}

/**
 * 可配置表格组件
 */
const ConfigurableTable: React.FC<ConfigurableTableProps> = ({ tableProps, columns, actions }) => {
  /**
   * 查看详情
   */
  const handleView = (record: any) => {
    message.info(`查看: ${record.name || record.id}`);
  };

  /**
   * 编辑
   */
  const handleEdit = (record: any) => {
    message.info(`编辑: ${record.name || record.id}`);
  };

  // 如果有操作列配置，添加操作列
  const finalColumns = [...columns];
  
  if (actions) {
    finalColumns.push({
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {actions.showView && (
            <Button type="link" onClick={() => handleView(record)}>查看</Button>
          )}
          {actions.showEdit && (
            <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          )}
          {actions.customActions && actions.customActions(record)}
        </Space>
      ),
    });
  }

  return (
    <Table
      columns={finalColumns}
      rowKey="id"
      {...tableProps}
    />
  );
};

export default ConfigurableTable; 