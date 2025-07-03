import React, { useState } from 'react';
import { Form, Input, Select, Button, Card, Table, Space, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnConfig, ColumnType } from '../../utils/pageGenerator.tsx';

interface TableColumnsConfigProps {
  initialValues: ColumnConfig[];
  onSave: (columns: ColumnConfig[]) => void;
  onPrev: () => void;
}

const commonStyle = {
  width: 250
}

const TableColumnsConfig: React.FC<TableColumnsConfigProps> = ({ initialValues, onSave, onPrev }) => {
  const [form] = Form.useForm();
  const [enumModalVisible, setEnumModalVisible] = useState(false);
  const [currentFieldName, setCurrentFieldName] = useState<string>('');
  const [enumForm] = Form.useForm();

  // 初始化表单数据
  React.useEffect(() => {
    form.setFieldsValue({ columns: initialValues });
  }, [initialValues, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave(values.columns || []);
    });
  };

  // 打开枚举映射配置弹窗
  const handleOpenEnumModal = (fieldName: string) => {
    setCurrentFieldName(fieldName);
    const currentEnumMap = form.getFieldValue(['columns', fieldName, 'enumMap']) || [];
    enumForm.setFieldsValue({ enumMap: currentEnumMap });
    setEnumModalVisible(true);
  };

  // 保存枚举映射配置
  const handleSaveEnumMap = () => {
    enumForm.validateFields().then((values) => {
      form.setFieldsValue({
        columns: {
          ...form.getFieldValue('columns'),
          [currentFieldName]: {
            ...form.getFieldValue(['columns', currentFieldName]),
            enumMap: values.enumMap
          }
        }
      });
      setEnumModalVisible(false);
    });
  };

  return (
    <Card title="步骤3：表格列配置">
      <Form form={form} layout="vertical">
        <Form.List name="columns">
          {(fields, { add, remove }) => {
            const columns = [
              {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                render: (_: any, field: any, index: number) => (
                  <Form.Item
                    name={[field.name, 'title']}
                    rules={[{ required: true, message: '请输入标题' }]}
                    style={{ margin: 0 }}
                  >
                    <Input placeholder="例如：商品名称、商品类型等" style={commonStyle} />
                  </Form.Item>
                ),
              },
              {
                title: '字段名',
                dataIndex: 'dataIndex',
                key: 'dataIndex',
                render: (_: any, field: any, index: number) => (
                  <Form.Item
                    name={[field.name, 'dataIndex']}
                    rules={[{ required: true, message: '请输入字段名' }]}
                    style={{ margin: 0 }}
                  >
                    <Input placeholder="例如：name、type等" style={commonStyle} />
                  </Form.Item>
                ),
              },
              {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                render: (_: any, field: any, index: number) => (
                  <Form.Item
                    name={[field.name, 'type']}
                    rules={[{ required: true, message: '请选择类型' }]}
                    style={{ margin: 0 }}
                  >
                    <Select placeholder="请选择类型" style={commonStyle}>
                      <Select.Option value={ColumnType.TEXT}>文本</Select.Option>
                      <Select.Option value={ColumnType.ENUM}>枚举</Select.Option>
                      <Select.Option value={ColumnType.MONEY}>金额</Select.Option>
                      <Select.Option value={ColumnType.DATETIME}>日期时间</Select.Option>
                      <Select.Option value={ColumnType.DATE}>日期</Select.Option>
                      <Select.Option value={ColumnType.CUSTOM}>自定义</Select.Option>
                    </Select>
                  </Form.Item>
                ),
              },
              {
                title: '枚举映射',
                dataIndex: 'enumMap',
                key: 'enumMap',
                width: 150,
                render: (_: any, field: any, index: number) => (
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => {
                      const prevType = prevValues?.columns?.[field.name]?.type;
                      const currentType = currentValues?.columns?.[field.name]?.type;
                      return prevType !== currentType;
                    }}
                  >
                    {({ getFieldValue }) => {
                      const type = getFieldValue(['columns', field.name, 'type']);
                      return type === ColumnType.ENUM ? (
                        <Button
                          type="link"
                          onClick={() => handleOpenEnumModal(field.name)}
                        >
                          配置映射
                        </Button>
                      ) : (
                        <span style={{ color: '#999' }}>-</span>
                      );
                    }}
                  </Form.Item>
                ),
              },
              {
                title: '操作',
                key: 'action',
                width: 80,
                render: (_: any, field: any, index: number) => (
                  <Button
                    type="link"
                    danger
                    onClick={() => remove(field.name)}
                  >
                    删除
                  </Button>
                ),
              },
            ];

            return (
              <>
                <Table
                  rowKey="name"
                  columns={columns}
                  dataSource={fields}
                  pagination={false}
                  scroll={{ x: 1200 }}
                />
                
                <Button
                  style={{ marginTop: 16 }}
                  type="dashed"
                  block
                  icon={<PlusOutlined />}
                  onClick={() => {
                    add({
                      title: '',
                      dataIndex: '',
                      type: ColumnType.TEXT,
                    });
                  }}
                >
                  添加表格列
                </Button>
                
                <Space style={{ marginTop: 16 }}>
                  <Button onClick={onPrev}>上一步</Button>
                  <Button
                    type="primary"
                    onClick={handleSave}
                    disabled={fields.length === 0}
                  >
                    下一步
                  </Button>
                </Space>
              </>
            );
          }}
        </Form.List>
      </Form>

      {/* 枚举映射配置弹窗 */}
      <Modal
        title="配置枚举映射"
        open={enumModalVisible}
        onOk={handleSaveEnumMap}
        onCancel={() => setEnumModalVisible(false)}
        width={600}
      >
        <Form form={enumForm} layout="vertical">
          <Form.List name="enumMap">
            {(fields, { add, remove }) => (
              <>
                <Table
                  rowKey="name"
                  scroll={{ y: 400 }}
                  columns={[
                    {
                      title: 'key',
                      dataIndex: 'key',
                      key: 'key',
                      render: (_: any, field: any, index: number) => (
                        <Form.Item
                          name={[field.name, 'key']}
                          rules={[{ required: true, message: '请输入key' }]}
                          style={{ margin: 0 }}
                        >
                          <Input placeholder="例如：1、启用" />
                        </Form.Item>
                      ),
                    },
                    {
                      title: 'value',
                      dataIndex: 'value',
                      key: 'value',
                      render: (_: any, field: any, index: number) => (
                        <Form.Item
                          name={[field.name, 'value']}
                          rules={[{ required: true, message: '请输入value' }]}
                          style={{ margin: 0 }}
                        >
                          <Input placeholder="例如：启用、禁用" />
                        </Form.Item>
                      ),
                    },
                    {
                      title: '操作',
                      key: 'action',
                      width: 80,
                      render: (_: any, field: any, index: number) => (
                        <Button 
                          type="link" 
                          danger 
                          onClick={() => remove(field.name)}
                        >
                          删除
                        </Button>
                      ),
                    },
                  ]}
                  dataSource={fields}
                  pagination={false}
                />
                <Button
                  block
                  type="dashed"
                  onClick={() => {
                    add({
                      key: '',
                      value: '',
                    });
                  }}
                >
                  添加映射
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Card>
  );
};

export default TableColumnsConfig; 