import React from 'react';
import ConfigurableListPage from '../components/ConfigurableListPage';
import { PageConfig, FormItemType, ColumnType } from '../utils/pageGenerator.tsx';
import { ProductType, ProductTypeMap } from '../utils/constants';
import { fetchProductList } from '../mock/productData';

/**
 * 商品列表页面配置
 */
const productListConfig: PageConfig = {
  name: '商品',
  route: '/products',
  searchForm: [
    {
      label: '商品名称',
      name: 'name',
      type: FormItemType.INPUT,
      placeholder: '请输入商品名称',
    },
    {
      label: '商品类型',
      name: 'type',
      type: FormItemType.SELECT,
      placeholder: '请选择商品类型',
      options: [
        { label: '实物商品', value: ProductType.PHYSICAL },
        { label: '虚拟商品', value: ProductType.VIRTUAL },
      ],
    },
  ],
  columns: [
    {
      title: '商品名称',
      dataIndex: 'name',
      type: ColumnType.TEXT,
    },
    {
      title: '商品类型',
      dataIndex: 'type',
      type: ColumnType.ENUM,
      enumMap: ProductTypeMap,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      type: ColumnType.TEXT,
    },
    {
      title: '市场价',
      dataIndex: 'marketPrice',
      type: ColumnType.MONEY,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      type: ColumnType.DATETIME,
    },
  ],
  actions: {
    showView: true,
    showEdit: true,
  },
};

/**
 * 商品列表页面
 */
const ProductListPage: React.FC = () => {
  return (
    <ConfigurableListPage
      config={productListConfig}
      fetchData={fetchProductList}
    />
  );
};

export default ProductListPage; 