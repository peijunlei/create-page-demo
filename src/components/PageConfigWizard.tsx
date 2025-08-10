import React, { useState } from 'react';
import { Steps, Button, Card, Space, message } from 'antd';
import BasicConfigForm from './wizard/BasicConfigForm';
import SearchFormConfig from './wizard/SearchFormConfig';
import TableColumnsConfig from './wizard/TableColumnsConfig';
import ConfigPreview from './wizard/ConfigPreview';
import { PageConfig, FormItemConfig, ColumnConfig } from '../utils/pageGenerator.tsx';

const { Step } = Steps;

/**
 * 页面配置向导组件
 */
const PageConfigWizard: React.FC = () => {
  // 当前步骤
  const [currentStep, setCurrentStep] = useState(0);
  
  // 配置数据
  const [config, setConfig] = useState<Partial<PageConfig>>({
    name: '',
    route: '',
    searchForm: [],
    columns: [],
    actions: {
      showView: true,
      showEdit: true,
    },
  });

  // 步骤内容
  const steps = [
    {
      title: '基本配置',
      content: (
        <BasicConfigForm
          initialValues={{ name: config.name, route: config.route }}
          onSave={(values) => {
            setConfig({ ...config, ...values });
            setCurrentStep(1);
          }}
        />
      ),
    },
    {
      title: '搜索项配置',
      content: (
        <SearchFormConfig
          initialValues={config.searchForm || []}
          onSave={(searchForm) => {
            setConfig({ ...config, searchForm });
            setCurrentStep(2);
          }}
          onPrev={() => setCurrentStep(0)}
        />
      ),
    },
    {
      title: '表格列配置',
      content: (
        <TableColumnsConfig
          initialValues={config.columns || []}
          onSave={(columns) => {
            setConfig({ ...config, columns });
            setCurrentStep(3);
          }}
          onPrev={() => setCurrentStep(1)}
        />
      ),
    },
    {
      title: '预览',
      content: (
        <ConfigPreview
          config={config as PageConfig}
          onPrev={() => setCurrentStep(2)}
          onComplete={() => {
            message.success('配置完成！');
            console.log('最终配置:', config);
            // 这里可以将配置保存到文件或数据库
          }}
        />
      ),
    },
  ];

  return (
    <div className="page-config-wizard">
      <Card title="页面配置向导">
        <Steps current={currentStep}>
          {steps.map((step) => (
            <Step key={step.title} title={step.title} />
          ))}
        </Steps>
        <div className="steps-content" style={{ marginTop: 24, marginBottom: 24 }}>
          {steps[currentStep].content}
        </div>
      </Card>
    </div>
  );
};

export default PageConfigWizard; 