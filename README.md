
# 培英中学 AI 数智化平台

> 香港培英中学 AI 数智化行政平台 — 多角色、模块化的校园行政管理系统

---

## 项目概述

本项目旨在为培英中学构建一个统一的 AI 数智化行政平台，采用 **一个底座、多个子系统** 的架构设计。不同岗位用户登录后只看到自己的专属子系统，但底层共用登录、权限、文件、OCR、AI 等基础设施。

### 核心原则

- **AI 结果可复核** — 涉及学生、人事、财务的 AI 结果必须经人工确认后才能落地
- **敏感数据本地化** — 薪酬、人事、学生名单等敏感数据不发送到未评估的外部模型
- **模块自治** — 每个功能独立开发验证，再统一集成到平台

---

## 系统架构

```
Browser
  ↓
Next.js Frontend
  ↓
FastAPI Backend
  ↓
PostgreSQL
  ↓
Redis Queue
  ↓
AI/OCR Workers
  ↓
OCR / LLM / Office / PDF / Email / eClass / NAS
```

### 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | Next.js 16 + TypeScript + Ant Design 6 + Tailwind CSS 4 |
| **后端** | FastAPI + Python |
| **数据库** | PostgreSQL (开发环境 SQLite) |
| **异步任务** | Celery / RQ + Redis |
| **文件存储** | 本地 NAS / MinIO / S3 兼容对象存储 |
| **AI 能力** | OCR、LLM、文档解析、结构化抽取、RAG |

---

## 用户角色

| 用户 | 核心功能 |
|------|---------|
| **Apple** | 奖状奖学金、收支记录、报价单、资产管理 |
| **Danielle** | 宿费对账、零用金、家长查询 |
| **Steven** | 标书报价、采购、库存 |
| **Tommy** | 文件智能归档、租务提醒、扫描件处理 |
| **Wendy** | 家长通告、代课安排、月历 |
| **梁小姐** | 资讯汇总、薪酬计算、任务分派 |
| **Admin** | 用户、权限、模块、日志、系统配置 |

---

## 当前开发进度（Tommy 模块已全部完成）

### 页面列表

| 页面 | 路由 | 功能 |
|------|------|------|
| 🏠 总览 | `/dashboard/tommy/overview` | 统计卡片、处理进度、待复核列表、快捷操作 |
| 📄 文件智能归档 | `/dashboard/tommy/archive` | 上传 → OCR → AI 分类 → 人工确认 → 归档完整闭环 |
| 🔔 租务提醒 | `/dashboard/tommy/rent` | 8 住宅 + 9 车位租金到期追踪、逾期提醒 |
| 📷 扫描件处理 | `/dashboard/tommy/scan` | 上传扫描件、实时 OCR 进度、任务列表 |
| 📂 归档记录 | `/dashboard/tommy/records` | 历史归档查询、状态筛选 |
| ⚙️ 个人设定 | `/dashboard/tommy/settings` | 个人资料、通知偏好、密码修改 |

### 前端亮点

- **响应式布局** — 桌面可折叠侧边栏 / 平板自适应 / 手机 Drawer 抽屉菜单
- **共享组件库** — EmptyState、ConfidenceBar、FieldSource、FormSection 等可复用组件
- **微交互** — hover 过渡动效、阴影层级过渡、淡入动画
- **可访问性** — skip-to-content、ARIA landmarks、focus-visible、prefers-reduced-motion

---

## 开发指南

### 环境要求

- Node.js >= 18
- Python >= 3.10

### 前端启动

```bash
cd frontend
npm install
npm run dev
# 访问 http://localhost:3000
```

### 后端启动

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 构建

```bash
cd frontend
npm run build -- --webpack
```

---

## 设计规范

详细的 UI 设计规范见 [`design.md`](./design.md)，包括：

- 布局规范（顶部栏 + 侧边导航 + 工作区）
- 色彩体系（品牌色 #23675f、背景 #F6F7F9）
- 组件规范（PageHeader、StatsCard、DataTable 等统一组件）
- 表格规范（默认 5-7 个关键字段、行内操作不超过 2 个）
- AI 结果确认 UI（来源标注 + 信心度 + 人工确认流程）

---

## 项目结构

```
school-ai-platform/
├── frontend/               # Next.js 前端
│   └── src/
│       ├── app/            # 页面路由
│       │   └── dashboard/tommy/  # Tommy 模块页面
│       └── components/     # 共享组件
│           ├── ui/         # 通用 UI 组件
│           └── modules/    # 业务模块组件
├── backend/                # FastAPI 后端
│   └── app/
│       ├── routers/        # API 路由
│       ├── models/         # 数据模型
│       ├── schemas/        # Pydantic 模型
│       └── services/       # 业务逻辑
├── uploads/                # 文件存储
└── design.md               # 设计规范文档
```

---

## License

MIT
