import React from 'react';
import { Input, Select } from 'antd';
import dayjs from 'dayjs';
import * as util from './util';
import { DateFormat } from './constants';

/**
 * 表单项类型枚举
 */
export enum FormItemType {
  INPUT = 'input',
  SELECT = 'select',
}

/**
 * 表格列类型枚举
 */
export enum ColumnType {
  TEXT = 'text',
  ENUM = 'enum',
  MONEY = 'money',
  DATETIME = 'datetime',
  DATE = 'date',
  CUSTOM = 'custom',
}

/**
 * 表单项配置接口
 */
export interface FormItemConfig {
  /**
   * 表单项标签
   */
  label: string;
  /**
   * 表单项字段名
   */
  name: string;
  /**
   * 表单项类型
   */
  type: FormItemType;
  /**
   * 表单项占位文本
   */
  placeholder?: string;
  /**
   * 下拉选项（仅当type为SELECT时有效）
   */
  options?: Array<{
    label: string;
    value: any;
  }>;
  /**
   * 表单项宽度（栅格）
   */
  span?: number;
}

/**
 * 表格列配置接口
 */
export interface ColumnConfig {
  /**
   * 列标题
   */
  title: string;
  /**
   * 列数据字段
   */
  dataIndex: string;
  /**
   * 列数据类型
   */
  type: ColumnType;
  /**
   * 枚举映射（仅当type为ENUM时有效）
   */
  enumMap?: Record<string | number, string>;
  /**
   * 自定义渲染函数（仅当type为CUSTOM时有效）
   */
  customRender?: (value: any, record: any) => React.ReactNode;
}

/**
 * 页面配置接口
 */
export interface PageConfig {
  /**
   * 页面名称
   */
  name: string;
  /**
   * 页面路由
   */
  route: string;
  /**
   * 搜索表单配置
   */
  searchForm: FormItemConfig[];
  /**
   * 表格列配置
   */
  columns: ColumnConfig[];
  /**
   * 操作列配置
   */
  actions?: {
    /**
     * 是否显示查看按钮
     */
    showView?: boolean;
    /**
     * 是否显示编辑按钮
     */
    showEdit?: boolean;
    /**
     * 自定义操作按钮
     */
    customActions?: (record: any) => React.ReactNode;
  };
}

/**
 * 生成表单项
 * @param config 表单项配置
 * @returns 表单项组件
 */
export const generateFormItem = (config: FormItemConfig) => {
  const { type, placeholder, options } = config;

  switch (type) {
    case FormItemType.INPUT:
      return <Input placeholder={placeholder || `请输入${config.label}`} />;
    case FormItemType.SELECT:
      return (
        <Select placeholder={placeholder || `请选择${config.label}`} allowClear>
          {options?.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      );
    default:
      return null;
  }
};

/**
 * 生成表格列渲染函数
 * @param config 列配置
 * @returns 列渲染函数
 */
export const generateColumnRender = (config: ColumnConfig) => {
  const { type, enumMap, customRender } = config;
  switch (type) {
    case ColumnType.TEXT:
      return (text: any) => text || '-';
    case ColumnType.ENUM:
      return (value: any) => (enumMap ? enumMap[value] || '-' : '-');
    case ColumnType.MONEY:
      return (value: any) => util.formateMoney(value);
    case ColumnType.DATETIME:
      return (value: any) => (value ? dayjs(value).format(DateFormat.DATETIME) : '-');
    case ColumnType.DATE:
      return (value: any) => (value ? dayjs(value).format(DateFormat.DATE) : '-');
    case ColumnType.CUSTOM:
      return customRender || ((text: any) => text || '-');
    default:
      return (text: any) => text || '-';
  }
}; 