/**
 * 魔兽世界游戏图标下载脚本
 * 从WoWHead或官方CDN下载所有需要的图标
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// 图标保存目录
const ICON_DIR = path.join(__dirname, 'icons');

// 确保目录存在
if (!fs.existsSync(ICON_DIR)) {
  fs.mkdirSync(ICON_DIR, { recursive: true });
}

// 图标源配置
const ICON_SOURCES = {
  // 职业图标
  classes: [
    'class_warrior.png',
    'class_paladin.png', 
    'class_hunter.png',
    'class_rogue.png',
    'class_priest.png',
    'class_deathknight.png',
    'class_shaman.png',
    'class_mage.png',
    'class_warlock.png',
    'class_monk.png'
  ],
  
  // 技能图标
  skills: [
    'ability_meleedamage.png',
    'inv_shield_06.png',
    'spell_holy_holybolt.png',
    'spell_holy_avenginewrath.png',
    'spell_arcane_shot.png',
    'ability_stealth.png',
    'spell_holy_powerwordshield.png',
    'spell_shadow_mindflay.png',
    'spell_shadow_deathcoil.png',
    'spell_nature_lightning.png',
    'spell_fire_flamebolt.png',
    'spell_shadow_abominationexplosion.png',
    'ability_monk_risingsunkick.png'
  ],
  
  // 天赋图标
  talents: [
    'ability_warrior_warmachine.png',
    'ability_warrior_charge.png',
    'spell_holy_infusionoflight.png',
    'spell_fire_pyroclasm.png'
  ],
  
  // 物品图标
  items: [
    'inv_sword_62.png',
    'inv_sword_39.png',
    'inv_hammer_13.png',
    'inv_axe_12.png',
    'inv_staff_18.png',
    'inv_sword_48.png',
    'inv_shield_06.png',
    'inv_jewel_35.png',
    'inv_jewel_40.png',
    'inv_jewel_29.png',
    'inv_potion_52.png',
    'inv_potion_54.png'
  ]
};

// 所有图标列表
const ALL_ICONS = [
  ...ICON_SOURCES.classes,
  ...ICON_SOURCES.skills,
  ...ICON_SOURCES.talents,
  ...ICON_SOURCES.items
];

/**
 * 下载单个图标
 * @param {string} iconName 图标文件名
 * @param {string} savePath 保存路径
 * @returns {Promise} 下载Promise
 */
function downloadIcon(iconName, savePath) {
  return new Promise((resolve, reject) => {
    // 优先使用WoWHead CDN
    const url = `https://wow.zamimg.com/images/wow/icons/large/${iconName}`;
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(savePath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ 下载成功: ${iconName}`);
          resolve(true);
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(savePath, () => reject(err));
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // 处理重定向
        https.get(response.headers.location, (redirectResponse) => {
          if (redirectResponse.statusCode === 200) {
            const fileStream = fs.createWriteStream(savePath);
            redirectResponse.pipe(fileStream);
            
            fileStream.on('finish', () => {
              fileStream.close();
              console.log(`✅ 下载成功: ${iconName} (重定向)`);
              resolve(true);
            });
          } else {
            reject(new Error(`HTTP状态码: ${redirectResponse.statusCode}`));
          }
        }).on('error', reject);
      } else {
        reject(new Error(`HTTP状态码: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * 下载所有图标
 */
async function downloadAllIcons() {
  console.log(`开始下载 ${ALL_ICONS.length} 个图标...\n`);
  
  const success = [];
  const failed = [];
  
  for (const icon of ALL_ICONS) {
    const savePath = path.join(ICON_DIR, icon);
    
    // 跳过已存在的文件
    if (fs.existsSync(savePath)) {
      console.log(`⏭️  已存在: ${icon}`);
      success.push(icon);
      continue;
    }
    
    try {
      await downloadIcon(icon, savePath);
      success.push(icon);
    } catch (err) {
      console.log(`❌ 下载失败: ${icon} - ${err.message}`);
      failed.push({ name: icon, error: err.message });
    }
  }
  
  // 生成下载报告
  console.log(`\n\n下载完成!`);
  console.log(`成功: ${success.length}/${ALL_ICONS.length}`);
  
  if (failed.length > 0) {
    console.log(`失败: ${failed.length}`);
    console.log('失败列表:');
    failed.forEach(f => console.log(`  - ${f.name}: ${f.error}`));
  }
  
  // 生成图标索引文件
  generateIconIndex();
  
  return { success, failed };
}

/**
 * 生成图标索引文件
 */
function generateIconIndex() {
  const indexPath = path.join(ICON_DIR, 'index.json');
  
  const iconIndex = {
    classes: ICON_SOURCES.classes.reduce((acc, icon) => {
      const className = icon.replace('class_', '').replace('.png', '');
      acc[className] = icon;
      return acc;
    }, {}),
    skills: ICON_SOURCES.skills.reduce((acc, icon) => {
      const skillId = icon.replace('.png', '');
      acc[skillId] = icon;
      return acc;
    }, {}),
    items: ICON_SOURCES.items.reduce((acc, icon) => {
      const itemId = icon.replace('.png', '');
      acc[itemId] = icon;
      return acc;
    }, {})
  };
  
  fs.writeFileSync(indexPath, JSON.stringify(iconIndex, null, 2));
  console.log(`\n📝 图标索引文件已生成: ${indexPath}`);
}

/**
 * 生成占位符图标（下载失败时使用）
 * @param {string} iconName 图标名
 */
function generatePlaceholderIcon(iconName) {
  const svgContent = `
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" fill="#333"/>
  <text x="32" y="32" font-family="Arial" font-size="10" fill="#fff" text-anchor="middle" dominant-baseline="middle">${iconName.replace('.png', '')}</text>
</svg>
  `.trim();
  
  const savePath = path.join(ICON_DIR, iconName.replace('.png', '.svg'));
  fs.writeFileSync(savePath, svgContent);
  console.log(`🖼️  生成占位符: ${iconName.replace('.png', '.svg')}`);
}

// 运行下载
if (require.main === module) {
  downloadAllIcons()
    .then(({ failed }) => {
      // 为失败的图标生成SVG占位符
      if (failed.length > 0) {
        console.log('\n为下载失败的图标生成占位符...');
        failed.forEach(f => generatePlaceholderIcon(f.name));
      }
      
      console.log('\n🎉 图标下载完成!');
      console.log(`图标保存目录: ${ICON_DIR}`);
    })
    .catch(err => {
      console.error('下载过程中发生错误:', err);
      process.exit(1);
    });
}

module.exports = {
  downloadIcon,
  downloadAllIcons,
  ICON_DIR,
  ALL_ICONS
};