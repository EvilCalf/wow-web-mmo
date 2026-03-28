/**
 * 游戏数据加载器
 * 统一加载所有配置数据，提供便捷的查询接口
 * 可直接在前后端项目中导入使用
 */

const fs = require('fs');
const path = require('path');

class DataLoader {
  constructor() {
    this.data = {
      classes: null,
      skills: null,
      talents: null,
      items: null,
      icons: null
    };
    
    this.loaded = false;
    this.dataDir = __dirname;
  }

  /**
   * 加载所有数据
   * @param {boolean} reload 是否强制重新加载
   * @returns {Object} 所有数据
   */
  loadAll(reload = false) {
    if (this.loaded && !reload) {
      return this.data;
    }

    try {
      // 加载职业数据
      this.data.classes = this.loadJson('classes.json');
      
      // 加载技能数据
      this.data.skills = this.loadJson('skills.json');
      
      // 加载天赋数据
      this.data.talents = this.loadJson('talents.json');
      
      // 加载物品数据
      this.data.items = this.loadJson('items.json');
      
      // 尝试加载图标索引
      try {
        this.data.icons = this.loadJson('icons/index.json');
      } catch (err) {
        console.warn('图标索引未找到，可运行下载脚本后重新加载');
        this.data.icons = null;
      }

      this.loaded = true;
      console.log('✅ 所有游戏数据加载完成');
      return this.data;
    } catch (err) {
      console.error('❌ 加载游戏数据失败:', err.message);
      throw err;
    }
  }

  /**
   * 加载JSON文件
   * @param {string} filename 文件名
   * @returns {Object} JSON数据
   */
  loadJson(filename) {
    const filePath = path.join(this.dataDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  }

  // ========================================
  // 职业相关查询方法
  // ========================================

  /**
   * 获取所有职业
   * @returns {Array} 职业列表
   */
  getAllClasses() {
    this._ensureLoaded();
    return this.data.classes.classes;
  }

  /**
   * 根据ID获取职业
   * @param {string} classId 职业ID
   * @returns {Object|null} 职业信息
   */
  getClassById(classId) {
    this._ensureLoaded();
    return this.data.classes.classes.find(c => c.id === classId) || null;
  }

  /**
   * 根据角色获取职业
   * @param {string} role 角色类型 (tank/healer/melee/ranged)
   * @returns {Array} 职业列表
   */
  getClassesByRole(role) {
    this._ensureLoaded();
    return this.data.classes.classes.filter(c => c.role.includes(role));
  }

  // ========================================
  // 技能相关查询方法
  // ========================================

  /**
   * 获取所有技能
   * @returns {Array} 技能列表
   */
  getAllSkills() {
    this._ensureLoaded();
    return this.data.skills.skills;
  }

  /**
   * 根据ID获取技能
   * @param {string} skillId 技能ID
   * @returns {Object|null} 技能信息
   */
  getSkillById(skillId) {
    this._ensureLoaded();
    return this.data.skills.skills.find(s => s.id === skillId) || null;
  }

  /**
   * 获取职业的所有技能
   * @param {string} classId 职业ID
   * @param {string} specId 可选专精ID
   * @returns {Array} 技能列表
   */
  getSkillsByClass(classId, specId = null) {
    this._ensureLoaded();
    let skills = this.data.skills.skills.filter(s => s.class === classId);
    
    if (specId) {
      skills = skills.filter(s => s.specs.includes(specId));
    }
    
    return skills;
  }

  // ========================================
  // 天赋相关查询方法
  // ========================================

  /**
   * 获取职业专精的天赋树
   * @param {string} classId 职业ID
   * @param {string} specId 专精ID
   * @returns {Array} 天赋列表
   */
  getTalentTree(classId, specId) {
    this._ensureLoaded();
    return this.data.talents.talents[classId]?.[specId] || [];
  }

  // ========================================
  // 物品相关查询方法
  // ========================================

  /**
   * 获取所有物品
   * @returns {Array} 物品列表
   */
  getAllItems() {
    this._ensureLoaded();
    return this.data.items.items;
  }

  /**
   * 根据ID获取物品
   * @param {string} itemId 物品ID
   * @returns {Object|null} 物品信息
   */
  getItemById(itemId) {
    this._ensureLoaded();
    return this.data.items.items.find(i => i.id === itemId) || null;
  }

  /**
   * 根据品质筛选物品
   * @param {string} quality 品质 (common/uncommon/rare/epic/legendary)
   * @returns {Array} 物品列表
   */
  getItemsByQuality(quality) {
    this._ensureLoaded();
    return this.data.items.items.filter(i => i.quality === quality);
  }

  /**
   * 根据类型筛选物品
   * @param {string} type 类型 (weapon/armor/consumable等)
   * @returns {Array} 物品列表
   */
  getItemsByType(type) {
    this._ensureLoaded();
    return this.data.items.items.filter(i => i.type === type);
  }

  /**
   * 根据物品等级范围筛选
   * @param {number} minLevel 最小物品等级
   * @param {number} maxLevel 最大物品等级
   * @returns {Array} 物品列表
   */
  getItemsByLevelRange(minLevel, maxLevel) {
    this._ensureLoaded();
    return this.data.items.items.filter(i => i.itemLevel >= minLevel && i.itemLevel <= maxLevel);
  }

  // ========================================
  // 图标相关方法
  // ========================================

  /**
   * 获取图标路径
   * @param {string} iconName 图标文件名
   * @param {string} baseUrl 基础URL
   * @returns {string} 完整图标路径
   */
  getIconUrl(iconName, baseUrl = './shared/icons/') {
    if (!iconName) return '';
    return `${baseUrl}${iconName}`;
  }

  /**
   * 获取职业图标
   * @param {string} classId 职业ID
   * @param {string} baseUrl 基础URL
   * @returns {string} 图标路径
   */
  getClassIcon(classId, baseUrl = './shared/icons/') {
    const cls = this.getClassById(classId);
    return cls ? this.getIconUrl(cls.icon, baseUrl) : '';
  }

  // ========================================
  // 工具方法
  // ========================================

  /**
   * 确保数据已加载
   * @private
   */
  _ensureLoaded() {
    if (!this.loaded) {
      this.loadAll();
    }
  }

  /**
   * 导出数据为ES模块
   * @param {string} outputPath 输出路径
   */
  exportToESModule(outputPath = './game-data.js') {
    const data = this.loadAll();
    const content = `/**
 * 魔兽世界游戏数据
 * 自动生成，请勿直接修改
 * 生成时间: ${new Date().toISOString()}
 */

export const classes = ${JSON.stringify(data.classes, null, 2)};
export const skills = ${JSON.stringify(data.skills, null, 2)};
export const talents = ${JSON.stringify(data.talents, null, 2)};
export const items = ${JSON.stringify(data.items, null, 2)};
export const icons = ${JSON.stringify(data.icons, null, 2)};

export default {
  classes,
  skills,
  talents,
  items,
  icons
};
`;
    
    fs.writeFileSync(outputPath, content);
    console.log(`✅ ES模块已导出到: ${outputPath}`);
  }

  /**
   * 导出数据为JSON
   * @param {string} outputPath 输出路径
   * @param {boolean} pretty 是否格式化
   */
  exportToJson(outputPath = './game-data.json', pretty = true) {
    const data = this.loadAll();
    const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    fs.writeFileSync(outputPath, content);
    console.log(`✅ JSON数据已导出到: ${outputPath}`);
  }
}

// 单例实例
const dataLoader = new DataLoader();

// 自动加载数据
if (require.main === module) {
  // 直接运行时加载数据并导出
  dataLoader.loadAll();
  
  // 导出ES模块
  dataLoader.exportToESModule(path.join(__dirname, 'game-data.js'));
  
  // 导出合并的JSON
  dataLoader.exportToJson(path.join(__dirname, 'game-data.json'));
  
  console.log('\n🎉 数据导出完成!');
  console.log('可用文件:');
  console.log('- shared/game-data.js (ES模块)');
  console.log('- shared/game-data.json (JSON格式)');
}

module.exports = dataLoader;