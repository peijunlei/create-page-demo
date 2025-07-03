import React from 'react';
import { Form, Input, Button, Card } from 'antd';

interface BasicConfigFormProps {
  initialValues: {
    name?: string;
    route?: string;
  };
  onSave: (values: { name: string; route: string }) => void;
}

const BasicConfigForm: React.FC<BasicConfigFormProps> = ({ initialValues, onSave }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave(values);
    });
  };

  return (
    <Card title="步骤1：基本配置">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="页面名称"
          rules={[{ required: true, message: '请输入页面名称' }]}
        >
          <Input placeholder="例如：商品、订单、用户等" />
        </Form.Item>
        <Form.Item
          name="route"
          label="页面路由"
          rules={[{ required: true, message: '请输入页面路由' }]}
        >
          <Input placeholder="例如：/products、/orders、/users等" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            下一步
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BasicConfigForm; 