import React, { useState } from 'react';
import { Form, Input, Select, Button, Card, Table, Space, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormItemConfig, FormItemType } from '../../utils/pageGenerator.tsx';
const commonStyle = {
  width: 250
}
interface SearchFormConfigProps {
  initialValues: FormItemConfig[];
  onSave: (searchForm: FormItemConfig[]) => void;
  onPrev: () => void;
}

const SearchFormConfig: React.FC<SearchFormConfigProps> = ({ initialValues, onSave, onPrev }) => {
  const [form] = Form.useForm();
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [currentFieldName, setCurrentFieldName] = useState<string>('');
  const [optionsForm] = Form.useForm();

  // 初始化表单数据
  React.useEffect(() => {
    form.setFieldsValue({ searchItems: initialValues });
  }, [initialValues, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave(values.searchItems || []);
    });
  };

  // 打开选项配置弹窗
  const handleOpenOptionsModal = (fieldName: string) => {
    setCurrentFieldName(fieldName);
    const currentOptions = form.getFieldValue(['searchItems', fieldName, 'options']) || [];
    optionsForm.setFieldsValue({ options: currentOptions });
    setOptionsModalVisible(true);
  };

  // 保存选项配置
  const handleSaveOptions = () => {
    optionsForm.validateFields().then((values) => {
      form.setFieldsValue({
        searchItems: {
          ...form.getFieldValue('searchItems'),
          [currentFieldName]: {
            ...form.getFieldValue(['searchItems', currentFieldName]),
            options: values.options
          }
        }
      });
      setOptionsModalVisible(false);
    });
  };

  return (
    <Card title="步骤2：搜索表单配置">
      <Form form={form} layout="vertical">
        <Form.List name="searchItems">
          {(fields, { add, remove }) => {
            const columns = [
              {
                title: '标签',
                dataIndex: 'label',
                key: 'label',
                render: (_: any, field: any, index: number) => (
                  <Form.Item
                    name={[field.name, 'label']}
                    rules={[{ required: true, message: '请输入标签' }]}
                    style={{ margin: 0 }}
                  >
                    <Input placeholder="例如：商品名称、商品类型等" style={commonStyle} />
                  </Form.Item>
                ),
              },
              {
                title: '字段名',
                dataIndex: 'name',
                key: 'name',
                render: (_: any, field: any, index: number) => (
                  <Form.Item
                    name={[field.name, 'name']}
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
                      <Select.Option value={FormItemType.INPUT}>输入框</Select.Option>
                      <Select.Option value={FormItemType.SELECT}>下拉选择框</Select.Option>
                    </Select>
                  </Form.Item>
                ),
              },
              {
                title: '占位文本',
                dataIndex: 'placeholder',
                key: 'placeholder',
                render: (_: any, field: any, index: number) => (
                  <Form.Item
                    name={[field.name, 'placeholder']}
                    style={{ margin: 0 }}
                  >
                    <Input placeholder="例如：请输入商品名称、请选择商品类型等" style={commonStyle} />
                  </Form.Item>
                ),
              },
              {
                title: '选项',
                dataIndex: 'options',
                key: 'options',
                width: 150,
                render: (_: any, field: any, index: number) => (
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => {
                      const prevType = prevValues?.searchItems?.[field.name]?.type;
                      const currentType = currentValues?.searchItems?.[field.name]?.type;
                      return prevType !== currentType;
                    }}
                  >
                    {({ getFieldValue }) => {
                      const type = getFieldValue(['searchItems', field.name, 'type']);
                      return type === FormItemType.SELECT ? (
                        <Button
                          type="link"
                          onClick={() => handleOpenOptionsModal(field.name)}
                        >
                          配置选项
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
                      label: '',
                      name: '',
                      type: FormItemType.INPUT,
                      placeholder: '',
                    });
                  }}
                >
                  添加搜索项
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

      {/* 选项配置弹窗 */}
      <Modal
        title="配置选项"
        open={optionsModalVisible}
        onOk={handleSaveOptions}
        onCancel={() => setOptionsModalVisible(false)}
        width={600}
      >
        <Form form={optionsForm} layout="vertical">
          <Form.List name="options">
            {(fields, { add, remove }) => (
              <>
                <Table
                  rowKey="name"
                  scroll={{ y: 400 }}
                  columns={[
                    {
                      title: 'label',
                      dataIndex: 'label',
                      key: 'label',
                      render: (_: any, field: any, index: number) => (
                        <Form.Item
                          name={[field.name, 'label']}
                          rules={[{ required: true, message: '请输入标签' }]}
                          style={{ margin: 0 }}
                        >
                          <Input placeholder="例如：启用、禁用" />
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
                          rules={[{ required: true, message: '请输入值' }]}
                          style={{ margin: 0 }}
                        >
                          <Input placeholder="例如：1、0" />
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
                      label: '',
                      value: '',
                    });
                  }}
                >
                  添加选项
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Card>
  );
};

export default SearchFormConfig; 