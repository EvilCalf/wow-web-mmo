# 魔兽世界Web MMO - 经典回合制

&gt; 基于魔兽世界IP的轻量级Web回合制MMO游戏，还原经典职业、技能、天赋和副本

🌐 **线上访问地址**: https://wow.evilcalf.online

## 🎯 核心定位
- **锚点版本**：魔兽世界 `巫妖王之怒 (WLK)` 版本（玩家认知度最高，内容最成熟）
- **玩法**：经典回合制战斗 + 角色养成 + 副本探索 + 社交系统
- **平台**：Web端即开即玩，PC/手机双端自适应
- **特色**：❌ 无卡牌元素，❌ 无随从系统，✅ 纯职业build玩法，✅ 还原经典副本动态难度

## 📋 核心设计文档
| 文档 | 状态 |
|------|------|
| [核心玩法设计](docs/gameplay.md) | ✅ 已完成 |
| [职业技能天赋设计](docs/classes.md) | ✅ 已完成 |
| [副本与大地图设计](docs/world.md) | ✅ 已完成 |
| [社交系统设计](docs/social.md) | 📝 待写 |
| [技术架构设计](docs/architecture.md) | ✅ 已完成 |
| [开发 roadmap](docs/roadmap.md) | ✅ 已完成 |

## 🛠️ 技术栈
### 前端
- Vue 3 + TypeScript + Pinia
- Canvas 2D 渲染引擎
- Tailwind CSS 样式
- Vite 构建工具

### 后端
- Node.js + TypeScript + NestJS
- MongoDB 数据库
- Redis 缓存 + 会话存储
- Socket.io 实时通信

### 部署
- Docker + Docker Compose
- Nginx 反向代理
- 腾讯云/阿里云 轻量应用服务器

## 🚀 快速开始

### 🌐 线上体验
直接访问：https://wow.evilcalf.online

### 💻 本地开发
```bash
# 克隆项目
git clone https://github.com/EvilCalf/wow-web-mmo.git
cd wow-web-mmo

# 开发环境启动
docker-compose up -d

# 本地访问
前端: http://localhost:3002
后端: http://localhost:3001
```

## 🤝 开发协作
- 主分支：`master`（保护分支，需要PR合并）
- 开发分支：`feature/xxx` 功能分支，`fix/xxx` 修复分支
- 提交规范：`feat: 新功能` / `fix: 修复bug` / `docs: 文档更新`
- 每个功能模块分配给不同的subagent开发，主会话负责代码合并和review

## 📄 许可证
MIT License - 仅用于非商业学习用途，魔兽世界IP归属暴雪娱乐所有
