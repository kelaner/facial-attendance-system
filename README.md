### 项目简介

一款基于 TensorFlow.js 封装人脸识别模型的考勤管理系统，旨在解决传统考勤方式中存在的效率低下、准确性不足等问题。通过先进的人脸识别算法，结合硬件设备和后台管理系统，实现对员工考勤的智能化管理，提升考勤管理的效率和准确性。

### 技术栈

- **React**: 用于构建用户界面的 JavaScript 库。
- **Next.js**: 用于构建服务器渲染和静态网站的框架。
- **TypeScript**: 用于开发静态类型检查的 JavaScript 代码。
- **face-api.js**: 基于 TensorFlow.js 的 JavaScript API，专门用于在浏览器和 Node.js 环境中进行人脸检测和人脸识别。
- **Strapi**: 用于构建后端 API 的开源头less CMS。

### 关键技术

- **TensorFlow.js**: 用于机器学习和深度学习的 JavaScript 库，提供了神经网络的训练和推理功能。
- **WebGL**: 用于在浏览器中进行高性能的图形渲染，加速 TensorFlow.js 的计算。
- **Node.js**: 用于在服务器端运行 JavaScript 代码，支持与 TensorFlow.js 的集成。

### 框架

- **face-api.js**: 提供了人脸检测、人脸识别、表情识别等功能的高级 API。

### 项目功能

1. **人脸检测**:
   - 检测图片中的人脸并标记出边框。
   - 获取面部关键点、年龄、性别以及表情检测等信息。

2. **人脸分析**:
   - 分析人脸图片，获得人脸的复杂关键点信息。
   - 对五官和脸部轮廓进行精确检测。

3. **人脸搜索**:
   - 将一张人脸与 N 张人脸进行比对，找出最相似的一张或多张人脸（1:N 人脸搜索）。

4. **人脸库管理 API**:
   - 按照 REST API 标准设计人脸库相关的 API 接口格式。
   - 支持前端用户直接对数据库中的数据进行获取。
   - 配置实体服务 API 与查询引擎 API，便于前端交互。

5. **后端集成**:
   - 使用 Strapi 作为后端，拓展 GraphQL API。
   - 通过内容类型生成器创建数据结构并开始通过内容管理器添加数据后，自动创建具体的 API 接口信息。
  
### 相关项目

- **Strapi CMS 代码库**:
  - 该项目的后端管理系统基于 Strapi 构建，代码库地址为：[GitHub - kelaner/attendance-ts-cms](https://github.com/kelaner/attendance-ts-cms)。
  - 该代码库包含了 Strapi 的配置和管理后台的实现，支持项目的后端功能。

### 入门指南

首先，运行开发服务器：

```bash
npm run dev
# 或者
yarn dev
# 或者
pnpm dev
```

然后在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。
