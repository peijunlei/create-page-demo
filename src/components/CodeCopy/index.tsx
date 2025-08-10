import React, { useState } from 'react';
import { Button, message } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import './index.css';

interface CodeCopyProps {
  code: string;
  title?: string;
  showCopyButton?: boolean;
  className?: string;
}

const CodeCopy: React.FC<CodeCopyProps> = ({
  code,
  title,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      // 2秒后重置状态
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (err) {
      message.error('复制失败，请手动复制');
      console.error('复制失败:', err);
    }
  };

  return (
    <div className={`code-copy-container ${className}`}>
      <div className="code-copy-header">
        <span className="code-copy-title">{title}</span>
        <Button
          type="text"
          size="small"
          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
          onClick={handleCopy}
          className="code-copy-button"
        >
          {copied ? '已复制' : '复制'}
        </Button>
      </div>
      <div className="code-copy-content">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeCopy;
