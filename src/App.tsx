import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Layout, Menu } from 'antd';
import ProductListPage from './pages/ProductListPage';
import PageConfigWizardPage from './pages/PageConfigWizardPage';
import './App.css';
import { useTheme } from './components/theme-provider';

const { Header, Content } = Layout;

const App: React.FC = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Router>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                label: <Link to="/">商品列表</Link>
              },
              {
                key: '2',
                label: <Link to="/page-config">页面配置向导</Link>
              },
            ]}
          />
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content" style={{ margin: '16px 0' }}>
            <Routes>
              <Route path="/" element={<ProductListPage />} />
              <Route path="/page-config" element={<PageConfigWizardPage />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
