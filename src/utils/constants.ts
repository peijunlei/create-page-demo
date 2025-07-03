/**
 * 常量定义
 */
export const ValidConst = {
  phone: /^1[3-9]\d{9}$/,
};

/**
 * 商品类型枚举
 */
export enum ProductType {
  PHYSICAL = 1, // 实物商品
  VIRTUAL = 2, // 虚拟商品
}

/**
 * 商品类型映射表
 */
export const ProductTypeMap = {
  [ProductType.PHYSICAL]: '实物商品',
  [ProductType.VIRTUAL]: '虚拟商品',
};

/**
 * 日期格式常量
 */
export const DateFormat = {
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
}; 