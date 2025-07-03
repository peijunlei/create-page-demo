/**
 * 工具函数
 */

/**
 * 格式化金额
 * @param money 金额（单位：分）
 * @returns 格式化后的金额字符串（单位：元）
 */
export const formateMoney = (money?: number): string => {
  if (money === undefined || money === null) {
    return '-';
  }
  return `¥${(money / 100).toFixed(2)}`;
}; 