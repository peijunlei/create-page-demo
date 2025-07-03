import { ProductType, DateFormat } from '../utils/constants';
import dayjs from 'dayjs';

/**
 * 商品数据接口
 */
export interface ProductItem {
  id: number;
  name: string;
  type: ProductType;
  specification: string;
  marketPrice: number;
  createTime: string;
}

/**
 * 生成模拟数据
 * @param count 数据条数
 * @returns 商品数据数组
 */
export const generateMockData = (count: number): ProductItem[] => {
  const data: ProductItem[] = [];
  
  for (let i = 1; i <= count; i++) {
    const isPhysical = Math.random() > 0.5;
    data.push({
      id: i,
      name: `商品${i}`,
      type: isPhysical ? ProductType.PHYSICAL : ProductType.VIRTUAL,
      specification: isPhysical ? `规格${i}` : '无规格',
      marketPrice: Math.floor(Math.random() * 1000000), // 单位：分
      createTime: dayjs().subtract(Math.floor(Math.random() * 30), 'day').format(DateFormat.DATETIME),
    });
  }
  
  return data;
};

/**
 * 模拟获取商品列表数据
 * @param params 查询参数
 * @returns 分页数据
 */
export const fetchProductList = (params: {
  pageSize: number;
  current: number;
  name?: string;
  type?: ProductType;
}) => {
  const { pageSize, current, name, type } = params;
  
  // 生成100条模拟数据
  const allData = generateMockData(100);
  
  // 根据查询条件过滤数据
  let filteredData = allData;
  
  if (name) {
    filteredData = filteredData.filter(item => item.name.includes(name));
  }
  
  if (type !== undefined) {
    filteredData = filteredData.filter(item => item.type === type);
  }
  
  // 计算分页数据
  const total = filteredData.length;
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredData.slice(start, end);
  // 模拟网络延迟
  return new Promise<{
    data: {
      list: ProductItem[];
      total: number;
      pageSize: number;
      current: number;
    };
  }>(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          list,
          total,
          pageSize,
          current,
        },
      });
    }, 300);
  });
}; 