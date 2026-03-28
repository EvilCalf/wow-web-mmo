# 魔兽世界Web MMO 游戏数据配置

本目录包含魔兽世界Web MMO游戏的所有基础数据配置，可直接导入前后端项目使用。

## 📁 目录结构

```
shared/
├── classes.json          # 10大职业配置
├── skills.json           # 技能配置
├── talents.json          # 天赋配置
├── items.json            # 物品配置
├── download-icons.js     # Node.js版图标下载脚本
├── download-icons.sh     # Shell版图标下载脚本（推荐）
├── DataLoader.js         # 数据加载工具类
├── game-data.js          # 自动生成的ES模块（运行DataLoader.js后生成）
├── game-data.json        # 自动生成的合并JSON（运行DataLoader.js后生成）
└── icons/                # 图标资源目录（下载后生成）
    ├── index.json        # 图标索引
    ├── *.png             # 图标文件
    └── README.md         # 图标说明
```

## 🚀 快速开始

### 1. 下载图标资源

#### 方法一：使用Shell脚本（推荐，无需依赖）
```bash
cd shared
chmod +x download-icons.sh
./download-icons.sh
```

#### 方法二：使用Node.js脚本
```bash
cd shared
node download-icons.js
```

### 2. 加载数据到项目

#### Node.js/前端项目
```javascript
// 方式1：使用DataLoader工具类（推荐，支持查询方法）
const dataLoader = require('./shared/DataLoader');
dataLoader.loadAll();

// 获取所有职业
const classes = dataLoader.getAllClasses();

// 根据ID获取职业
const warrior = dataLoader.getClassById('warrior');

// 获取战士的所有技能
const warriorSkills = dataLoader.getSkillsByClass('warrior');

// 获取橙色品质物品
const legendaries = dataLoader.getItemsByQuality('legendary');

// 方式2：直接导入生成的ES模块
import { classes, skills, items } from './shared/game-data';
```

#### 其他语言/后端项目
直接读取JSON文件：
```python
import json

with open('shared/classes.json', 'r', encoding='utf-8') as f:
    classes = json.load(f)['classes']
```

## 📊 数据结构说明

### 1. 职业配置 (classes.json)
包含10大经典职业，每个职业包含3种专精：
- **战士 (Warrior)**：武器、狂怒、防护
- **圣骑士 (Paladin)**：神圣、防护、惩戒
- **猎人 (Hunter)**：野兽控制、射击、生存
- **潜行者 (Rogue)**：奇袭、狂徒、敏锐
- **牧师 (Priest)**：戒律、神圣、暗影
- **死亡骑士 (Death Knight)**：鲜血、冰霜、邪恶
- **萨满祭司 (Shaman)**：元素、增强、恢复
- **法师 (Mage)**：奥术、火焰、冰霜
- **术士 (Warlock)**：痛苦、恶魔学识、毁灭
- **武僧 (Monk)**：酒仙、织雾、踏风

每个职业包含：
- 基本信息（名称、颜色、图标、描述）
- 基础属性（力量、敏捷、耐力、智力、精神）
- 可用专精及角色定位

### 2. 技能配置 (skills.json)
包含每个职业的核心技能，支持：
- 技能伤害/治疗计算
- 资源消耗（怒气、法力、能量、符文能量等）
- 施法时间、冷却时间、射程
- 特殊效果（DOT、HOT、增益、减益、控制等）
- 专精适配

### 3. 天赋配置 (talents.json)
包含各职业专精的天赋树，支持：
- 多层天赋选择
- 点数分配
- 被动/主动天赋效果
- 数值缩放

### 4. 物品配置 (items.json)
包含经典装备和消耗品：
- 传说武器（灰烬使者、风剑、橙锤等）
- 史诗装备
- 消耗品（药水、药剂等）
- 完整的物品属性、伤害、特效描述

## 🔧 工具类功能

DataLoader.js提供丰富的查询接口：

### 职业查询
- `getAllClasses()` - 获取所有职业
- `getClassById(classId)` - 根据ID获取职业
- `getClassesByRole(role)` - 根据角色类型筛选

### 技能查询
- `getAllSkills()` - 获取所有技能
- `getSkillById(skillId)` - 根据ID获取技能
- `getSkillsByClass(classId, specId)` - 获取职业/专精的技能

### 物品查询
- `getAllItems()` - 获取所有物品
- `getItemById(itemId)` - 根据ID获取物品
- `getItemsByQuality(quality)` - 按品质筛选
- `getItemsByType(type)` - 按类型筛选
- `getItemsByLevelRange(min, max)` - 按物品等级范围筛选

### 导出功能
- `exportToESModule(path)` - 导出为ES6模块
- `exportToJson(path)` - 导出为合并JSON文件

## 🎨 图标资源

图标来自官方WowHead CDN，包含：
- 10个职业图标
- 13个技能图标
- 4个天赋图标
- 12个物品图标
- 总计39个高清图标

自动生成`icons/index.json`索引文件，方便快速查找对应图标。

## 📝 使用示例

### 示例1：创建角色选择界面
```javascript
const dataLoader = require('./shared/DataLoader');
const classes = dataLoader.getAllClasses();

// 渲染职业列表
classes.forEach(cls => {
  console.log(`职业: ${cls.name} (${cls.nameEn})`);
  console.log(`颜色: ${cls.color}`);
  console.log(`图标: ${dataLoader.getClassIcon(cls.id)}`);
  console.log('专精:');
  cls.availableSpecs.forEach(spec => {
    console.log(`  - ${spec.name} (${spec.role})`);
  });
  console.log('---');
});
```

### 示例2：计算技能伤害
```javascript
const fireball = dataLoader.getSkillById('mage_fireball');
const mageIntellect = 1000; // 法师智力属性

// 计算实际伤害
const baseDamage = fireball.damage.base;
const scaling = fireball.damage.scaling.multiplier;
const totalDamage = baseDamage + (mageIntellect * scaling);

console.log(`火球术伤害: ${Math.round(totalDamage)}`);
```

### 示例3：筛选战士可用装备
```javascript
const allItems = dataLoader.getAllItems();
const warriorItems = allItems.filter(item => {
  // 战士可穿板甲，使用力量系武器
  return (item.type === 'armor' && item.subType.includes('plate')) ||
         (item.type === 'weapon' && item.stats.strength);
});

console.log('战士可用装备:', warriorItems.length);
```

## 📌 注意事项

1. **版权说明**：所有数据和图标均来自魔兽世界，版权归暴雪娱乐所有，仅供学习交流使用，请勿用于商业用途。
2. **数据扩展**：当前为基础配置，可根据项目需求自由扩展更多职业、技能、天赋和物品。
3. **版本兼容**：数据基于魔兽世界经典旧世版本设计，如需其他版本可自行调整数值。
4. **图标下载**：首次使用请运行下载脚本获取图标资源，脚本会自动跳过已下载的文件。

## 🔄 更新日志

### v1.0.0 (2026-03-28)
- ✅ 完成10大职业基础配置
- ✅ 完成核心技能配置（每个职业1-3个代表技能）
- ✅ 完成天赋树基础结构
- ✅ 完成经典物品配置（12件装备+2个消耗品）
- ✅ 提供Node.js和Shell版图标下载脚本
- ✅ 提供完整的数据加载工具类
- ✅ 支持ES模块和JSON格式导出

## 🤝 贡献

欢迎提交Issue和PR来扩展数据内容，完善技能、天赋和物品配置！

---

**提示**：运行 `node DataLoader.js` 可自动生成合并的ES模块和JSON文件，方便直接导入项目使用。