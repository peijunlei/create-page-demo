import React from 'react';
import { Button, Col, Form, Row, Space } from 'antd';
import { FormItemConfig, generateFormItem } from '../utils/pageGenerator.tsx';

/**
 * 可配置搜索组件属性
 */
interface ConfigurableSearchProps {
  /**
   * 表单实例
   */
  form: any;
  /**
   * 搜索表单配置
   */
  config: FormItemConfig[];
  /**
   * 提交搜索回调
   */
  onSubmit: () => void;
  /**
   * 重置表单回调
   */
  onReset: () => void;
}

/**
 * 可配置搜索组件
 */
const ConfigurableSearch: React.FC<ConfigurableSearchProps> = ({ form, config, onSubmit, onReset }) => {
  return (
    <Form
      form={form}
      name="searchForm"
      layout="inline"
    >
      <Row gutter={24} style={{ width: '100%' }}>
        {config.map((item) => (
          <Col key={item.name} span={item.span || 8}>
            <Form.Item name={item.name} label={item.label}>
              {generateFormItem(item)}
            </Form.Item>
          </Col>
        ))}
        <Col span={8} style={{ textAlign: 'right' }}>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={onSubmit} htmlType="submit">
                搜索
              </Button>
              <Button onClick={onReset}>重置</Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ConfigurableSearch; 