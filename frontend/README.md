# 魔兽世界 Web MMO 前端

基于 React + TypeScript + Phaser3 开发的魔兽世界风格网页MMO游戏前端。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Redux Toolkit
- **路由**: React Router DOM
- **游戏引擎**: Phaser3
- **样式**: Styled Components
- **HTTP客户端**: Axios
- **图标**: Lucide React

## 功能特性

✅ **用户系统**
- 用户注册/登录
- JWT身份验证
- 自动登录状态保持

✅ **角色系统**
- 多角色创建
- 12种职业选择
- 13种种族选择
- 角色信息展示

✅ **游戏世界**
- Phaser3 2D游戏引擎
- 瓦片地图渲染
- 八方向角色移动
- 碰撞检测
- 实时角色状态同步

✅ **游戏UI**
- 血条/蓝条显示
- 技能快捷栏
- 聊天系统
- 游戏菜单
- 背包/地图/社交功能入口

## 项目结构

```
frontend/
├── src/
│   ├── assets/          # 静态资源（图片、音频、地图）
│   ├── components/      # 公共组件
│   ├── game/            # 游戏相关逻辑
│   ├── hooks/           # 自定义Hooks
│   ├── pages/           # 页面组件
│   │   ├── Login.tsx          # 登录页
│   │   ├── Register.tsx       # 注册页
│   │   ├── CharacterSelect.tsx # 角色选择页
│   │   └── Game.tsx           # 游戏主页面
│   ├── router/          # 路由配置
│   ├── store/           # Redux状态管理
│   │   ├── slices/
│   │   │   ├── authSlice.ts   # 用户认证状态
│   │   │   └── gameSlice.ts   # 游戏状态
│   │   └── index.ts
│   ├── styles/          # 全局样式
│   ├── types/           # TypeScript类型定义
│   ├── utils/           # 工具函数
│   │   ├── api.ts       # Axios封装
│   │   └── gameEngine.ts # Phaser游戏引擎封装
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动。

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产版本

```bash
npm run preview
```

## 开发说明

### 代理配置

API请求默认代理到 `http://localhost:8080`，可以在 `vite.config.ts` 中修改。

### 游戏资源

游戏资源（地图、精灵、UI图标）需要放置在 `public/assets/` 目录下：

```
public/
└── assets/
    ├── maps/      # Tiled地图文件
    ├── sprites/   # 角色精灵图
    ├── tiles/     # 地图瓦片
    └── ui/        # UI资源
```

### 状态管理

- `authSlice`: 处理用户登录、注册、身份验证
- `gameSlice`: 处理角色创建、选择、游戏状态管理

### 游戏引擎

`src/utils/gameEngine.ts` 封装了Phaser3游戏引擎的初始化、场景管理、游戏循环等逻辑。

## 后端对接

需要配合后端API使用，默认API前缀为 `/api`。后端需要提供以下接口：

- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `GET /auth/me` - 获取当前用户信息
- `GET /characters` - 获取用户角色列表
- `POST /characters` - 创建新角色
- `GET /characters/:id` - 获取角色详情

## 许可证

MIT
