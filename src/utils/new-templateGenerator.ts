import { PageConfig } from './pageGenerator.tsx';
import { templateGenerator } from './handlebarsTemplateGenerator.ts';

/**
 * 生成搜索表单代码
 */
export const generateSearchFormCode = (config: PageConfig) => {
  return templateGenerator.generateSearchFormCode(config);
};

/**
 * 生成表格代码
 */
export const generateTableCode = (config: PageConfig) => {
  return templateGenerator.generateTableCode(config); 
};

/**
 * 生成入口文件代码
 */
export const generateEntryCode = (config: PageConfig) => {
  return templateGenerator.generateEntryCode(config);
};

/**
 * 生成 Web API 接口代码
 */
export const generateWebApiCode = () => {
  return templateGenerator.generateWebApiCode();
}; 