# WoW Web MMO Backend

基于 NestJS 的魔兽世界网页版 MMO 后端框架。

## 功能特性

- ✅ 用户注册/登录（JWT 认证）
- ✅ 角色创建/管理（支持10个种族，9个职业）
- ✅ 自动阵营分配
- ✅ 职业基础属性自动设置
- ✅ 升级系统
- ✅ SQLite 数据库
- ✅ 完整的 RESTful API
- ✅ 跨域支持

## 技术栈

- **框架**: NestJS
- **数据库**: SQLite3 + TypeORM
- **认证**: JWT + bcrypt
- **语言**: TypeScript

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run start:dev
```

服务器将运行在 `http://localhost:3000`

## API 接口

### 认证接口

#### 注册
```
POST /auth/register
Body: {
  "username": "player1",
  "email": "player1@example.com",
  "password": "password123"
}
```

#### 登录
```
POST /auth/login
Body: {
  "username": "player1",
  "password": "password123"
}
Response: {
  "access_token": "jwt_token",
  "user": { ... }
}
```

### 用户接口

#### 获取用户资料
```
GET /users/profile
Headers: Authorization: Bearer <jwt_token>
```

### 角色接口

#### 创建角色
```
POST /characters
Headers: Authorization: Bearer <jwt_token>
Body: {
  "name": "Thrall",
  "class": "shaman",
  "race": "orc"
}
```

#### 获取我的角色列表
```
GET /characters
Headers: Authorization: Bearer <jwt_token>
```

#### 获取单个角色
```
GET /characters/:id
Headers: Authorization: Bearer <jwt_token>
```

#### 更新角色
```
PATCH /characters/:id
Headers: Authorization: Bearer <jwt_token>
Body: { ... }
```

#### 删除角色
```
DELETE /characters/:id
Headers: Authorization: Bearer <jwt_token>
```

#### 增加经验值
```
POST /characters/:id/experience
Headers: Authorization: Bearer <jwt_token>
Body: { "experience": 500 }
```

## 支持的种族与职业

### 联盟种族
- Human
- Dwarf
- Night Elf
- Gnome
- Draenei

### 部落种族
- Orc
- Undead
- Tauren
- Troll
- Blood Elf

### 职业
- Warrior
- Mage
- Hunter
- Priest
- Rogue
- Shaman
- Paladin
- Warlock
- Druid

## 项目结构

```
src/
├── main.ts                 # 应用入口
├── app.module.ts           # 根模块
├── auth/                   # 认证模块
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   └── jwt-auth.guard.ts
├── users/                  # 用户模块
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── users.controller.ts
│   └── user.entity.ts
└── characters/             # 角色模块
    ├── characters.module.ts
    ├── characters.service.ts
    ├── characters.controller.ts
    └── character.entity.ts
```

## 数据库

数据库使用 SQLite，存储在 `wow.db` 文件中，首次启动时自动创建。

## 生产环境部署

1. 修改 `app.module.ts` 中的 `synchronize: false`
2. 替换 JWT 密钥为环境变量
3. 可以考虑更换为 MySQL/PostgreSQL 数据库
4. 运行 `npm run build` 构建
5. 运行 `npm run start:prod` 启动

## License

MIT
