# 页面配置生成器

一个基于 React + TypeScript 的可视化页面配置工具，通过向导式界面快速生成列表页面。

## 功能特性

- 🎯 **可视化配置**：通过向导界面配置页面基本信息、搜索表单和表格列
- 📋 **列表页面生成**：支持生成包含搜索、表格、分页的完整列表页面
- 🎨 **现代化UI**：基于 Ant Design 组件库，界面美观易用
- 📱 **响应式设计**：适配不同屏幕尺寸

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Rsbuild
- **UI组件库**：Ant Design 5.x
- **路由管理**：React Router DOM
- **工具库**：ahooks、dayjs、handlebars
- **开发语言**：TypeScript

## 快速开始

### 环境要求

- Node.js >= 16
- pnpm (推荐) 或 npm

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

项目将在 `http://localhost:8080` 启动，并自动打开浏览器。

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── PageConfigWizard.tsx    # 页面配置向导主组件
│   ├── ConfigurableListPage.tsx # 可配置列表页面组件
│   ├── ConfigurableSearch.tsx  # 可配置搜索组件
│   ├── ConfigurableTable.tsx   # 可配置表格组件
│   └── wizard/         # 向导步骤组件
├── pages/              # 页面组件
│   ├── ProductListPage.tsx     # 商品列表页面
│   └── PageConfigWizardPage.tsx # 配置向导页面
├── utils/              # 工具函数
│   ├── pageGenerator.tsx       # 页面生成器
│   ├── handlebarsTemplateGenerator.ts # 模板生成器
│   └── constants.ts    # 常量定义
└── mock/               # 模拟数据
    └── productData.ts  # 商品数据
```

## 使用说明

### 1. 商品列表页面

访问首页可以看到一个完整的商品列表页面，包含：
- 搜索表单（商品名称、状态筛选）
- 数据表格（分页显示）
- 操作按钮（查看、编辑、删除）

### 2. 页面配置向导

访问 `/page-config` 路径进入配置向导，包含四个步骤：

1. **基本配置**：设置页面名称和路由
2. **搜索项配置**：配置搜索表单字段
3. **表格列配置**：配置表格显示列
4. **预览**：预览最终生成的页面效果

## 开发说明

### 添加新的表单项类型

在 `src/utils/pageGenerator.tsx` 中的 `FormItemType` 枚举中添加新类型，并在相应的组件中实现渲染逻辑。

### 添加新的表格列类型

在 `ColumnType` 枚举中添加新类型，并在 `ConfigurableTable.tsx` 中实现对应的渲染函数。

### 自定义模板

项目使用 Handlebars 模板引擎，可以在 `src/utils/handlebarsTemplateGenerator.ts` 中自定义页面模板。

## 许可证

MIT License
