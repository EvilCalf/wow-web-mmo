#!/bin/bash

# 魔兽世界图标下载脚本 (Shell版本)
# 无需Node.js，直接使用wget/curl下载

# 配置
ICON_DIR="./icons"
CDN_URL="https://wow.zamimg.com/images/wow/icons/large"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 确保目录存在
mkdir -p "$ICON_DIR"

# 图标列表
ICONS=(
  # 职业图标
  "class_warrior.png"
  "class_paladin.png"
  "class_hunter.png"
  "class_rogue.png"
  "class_priest.png"
  "class_deathknight.png"
  "class_shaman.png"
  "class_mage.png"
  "class_warlock.png"
  "class_monk.png"
  
  # 技能图标
  "ability_meleedamage.png"
  "inv_shield_06.png"
  "spell_holy_holybolt.png"
  "spell_holy_avenginewrath.png"
  "spell_arcane_shot.png"
  "ability_stealth.png"
  "spell_holy_powerwordshield.png"
  "spell_shadow_mindflay.png"
  "spell_shadow_deathcoil.png"
  "spell_nature_lightning.png"
  "spell_fire_flamebolt.png"
  "spell_shadow_abominationexplosion.png"
  "ability_monk_risingsunkick.png"
  
  # 天赋图标
  "ability_warrior_warmachine.png"
  "ability_warrior_charge.png"
  "spell_holy_infusionoflight.png"
  "spell_fire_pyroclasm.png"
  
  # 物品图标
  "inv_sword_62.png"
  "inv_sword_39.png"
  "inv_hammer_13.png"
  "inv_axe_12.png"
  "inv_staff_18.png"
  "inv_sword_48.png"
  "inv_shield_06.png"
  "inv_jewel_35.png"
  "inv_jewel_40.png"
  "inv_jewel_29.png"
  "inv_potion_52.png"
  "inv_potion_54.png"
)

# 统计
TOTAL=${#ICONS[@]}
SUCCESS=0
FAILED=0
SKIPPED=0

echo -e "${YELLOW}开始下载 ${TOTAL} 个魔兽世界图标...${NC}"
echo -e "保存目录: ${ICON_DIR}"
echo "========================================"

# 检查是否有wget或curl
if command -v wget &> /dev/null; then
  DOWNLOAD_CMD="wget -q -c -O"
elif command -v curl &> /dev/null; then
  DOWNLOAD_CMD="curl -s -f -o"
else
  echo -e "${RED}错误: 未找到wget或curl，请先安装其中一个工具。${NC}"
  exit 1
fi

# 下载函数
download_icon() {
  local icon=$1
  local save_path="${ICON_DIR}/${icon}"
  local url="${CDN_URL}/${icon}"
  
  # 跳过已存在的文件
  if [ -f "$save_path" ]; then
    echo -e "${YELLOW}⏭️  已存在: ${icon}${NC}"
    SKIPPED=$((SKIPPED + 1))
    return 0
  fi
  
  # 执行下载
  if $DOWNLOAD_CMD "$save_path" "$url"; then
    echo -e "${GREEN}✅ 下载成功: ${icon}${NC}"
    SUCCESS=$((SUCCESS + 1))
    return 0
  else
    # 删除可能下载失败的空文件
    [ -f "$save_path" ] && rm "$save_path"
    echo -e "${RED}❌ 下载失败: ${icon}${NC}"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# 遍历下载所有图标
for icon in "${ICONS[@]}"; do
  download_icon "$icon"
done

# 生成索引文件
echo "========================================"
echo -e "${YELLOW}生成图标索引文件...${NC}"

cat > "${ICON_DIR}/index.json" << EOF
{
  "generatedAt": "$(date -Iseconds)",
  "baseUrl": "./icons/",
  "classes": {
EOF

# 职业图标索引
first=true
for icon in "${ICONS[@]}"; do
  if [[ $icon == class_* ]]; then
    if [ "$first" = true ]; then
      first=false
    else
      echo "," >> "${ICON_DIR}/index.json"
    fi
    class_name=$(echo "$icon" | sed 's/class_\(.*\)\.png/\1/')
    echo "    \"$class_name\": \"$icon\"" >> "${ICON_DIR}/index.json"
  fi
done

cat >> "${ICON_DIR}/index.json" << EOF
  },
  "skills": {
EOF

# 技能图标索引
first=true
skill_icons=(
  "ability_meleedamage.png"
  "inv_shield_06.png"
  "spell_holy_holybolt.png"
  "spell_holy_avenginewrath.png"
  "spell_arcane_shot.png"
  "ability_stealth.png"
  "spell_holy_powerwordshield.png"
  "spell_shadow_mindflay.png"
  "spell_shadow_deathcoil.png"
  "spell_nature_lightning.png"
  "spell_fire_flamebolt.png"
  "spell_shadow_abominationexplosion.png"
  "ability_monk_risingsunkick.png"
  "ability_warrior_warmachine.png"
  "ability_warrior_charge.png"
  "spell_holy_infusionoflight.png"
  "spell_fire_pyroclasm.png"
)

for icon in "${skill_icons[@]}"; do
  if [ "$first" = true ]; then
    first=false
  else
    echo "," >> "${ICON_DIR}/index.json"
  fi
  skill_id=$(echo "$icon" | sed 's/\(.*\)\.png/\1/')
  echo "    \"$skill_id\": \"$icon\"" >> "${ICON_DIR}/index.json"
done

cat >> "${ICON_DIR}/index.json" << EOF
  },
  "items": {
EOF

# 物品图标索引
first=true
item_icons=(
  "inv_sword_62.png"
  "inv_sword_39.png"
  "inv_hammer_13.png"
  "inv_axe_12.png"
  "inv_staff_18.png"
  "inv_sword_48.png"
  "inv_shield_06.png"
  "inv_jewel_35.png"
  "inv_jewel_40.png"
  "inv_jewel_29.png"
  "inv_potion_52.png"
  "inv_potion_54.png"
)

for icon in "${item_icons[@]}"; do
  if [ "$first" = true ]; then
    first=false
  else
    echo "," >> "${ICON_DIR}/index.json"
  fi
  item_id=$(echo "$icon" | sed 's/\(.*\)\.png/\1/')
  echo "    \"$item_id\": \"$icon\"" >> "${ICON_DIR}/index.json"
done

cat >> "${ICON_DIR}/index.json" << EOF
  }
}
EOF

echo -e "${GREEN}📝 图标索引文件已生成: ${ICON_DIR}/index.json${NC}"

# 输出统计
echo "========================================"
echo -e "${GREEN}下载完成!${NC}"
echo -e "总计: ${TOTAL} 个"
echo -e "成功: ${GREEN}${SUCCESS}${NC} 个"
echo -e "跳过: ${YELLOW}${SKIPPED}${NC} 个"
if [ $FAILED -gt 0 ]; then
  echo -e "失败: ${RED}${FAILED}${NC} 个"
fi
echo "========================================"

# 生成README
cat > "${ICON_DIR}/README.md" << EOF
# 魔兽世界图标资源

本目录包含魔兽世界Web MMO游戏所需的所有图标资源。

## 下载方法

### 方法一：使用Shell脚本（推荐）
\`\`\`bash
cd shared
chmod +x download-icons.sh
./download-icons.sh
\`\`\`

### 方法二：使用Node.js脚本
\`\`\`bash
cd shared
node download-icons.js
\`\`\`

## 图标来源

所有图标来自WowHead CDN，仅供学习交流使用。
- 官方网站: https://www.wowhead.com/
- CDN地址: https://wow.zamimg.com/

## 图标索引

查看 \`index.json\` 获取所有图标的映射关系。

## 注意事项

1. 图标版权归暴雪娱乐所有
2. 请勿用于商业用途
3. 如有侵权请联系删除
EOF

echo -e "${GREEN}📖 说明文件已生成: ${ICON_DIR}/README.md${NC}"
echo -e "\n${YELLOW}使用说明:${NC}"
echo "1. 运行 ./download-icons.sh 下载所有图标"
echo "2. 图标将保存到 ${ICON_DIR} 目录"
echo "3. 查看 index.json 获取图标索引"

exit 0