#!/bin/bash

# 魔兽世界图标下载脚本 (官方CDN版)
# 使用暴雪官方亚太CDN，保证图片正确

# 配置
ICON_DIR="./icons"
CDN_URL="https://render.worldofwarcraft.com/us/icons/56"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 清空旧图标
rm -rf "$ICON_DIR"
mkdir -p "$ICON_DIR"

# 图标列表（正确的ID格式）
ICONS=(
  # 职业图标
  "class_warrior.jpg"
  "class_paladin.jpg"
  "class_hunter.jpg"
  "class_rogue.jpg"
  "class_priest.jpg"
  "class_deathknight.jpg"
  "class_shaman.jpg"
  "class_mage.jpg"
  "class_warlock.jpg"
  "class_druid.jpg"
  
  # 技能图标
  "ability_warrior_charge.jpg"
  "ability_warrior_bloodthirst.jpg"
  "ability_warrior_shield_block.jpg"
  "spell_holy_holy_light.jpg"
  "spell_holy_avenging_wrath.jpg"
  "spell_holy_shield_of_the_righteous.jpg"
  "ability_hunter_arcane_shot.jpg"
  "ability_hunter_steady_shot.jpg"
  "ability_rogue_backstab.jpg"
  "ability_rogue_stealth.jpg"
  "spell_holy_power_word_shield.jpg"
  "spell_shadow_mind_flay.jpg"
  "spell_deathknight_death_coil.jpg"
  "spell_deathknight_frost_strike.jpg"
  "spell_nature_lightning_bolt.jpg"
  "spell_nature_chain_heal.jpg"
  "spell_fire_fireball.jpg"
  "spell_frost_frostbolt.jpg"
  "spell_fire_immolate.jpg"
  "spell_shadow_shadow_bolt.jpg"
  
  # 物品图标
  "inv_sword_62.jpg"       # 灰烬使者
  "inv_sword_39.jpg"       # 风剑
  "inv_hammer_13.jpg"      # 橙锤
  "inv_staff_18.jpg"       # 橙杖
  "inv_jewelcrafting_gem_35.jpg" # 宝石
  "inv_potion_52.jpg"      # 红药
  "inv_potion_54.jpg"      # 蓝药
)

echo -e "${YELLOW}开始下载 ${#ICONS[@]} 个魔兽世界图标...${NC}"
echo "保存目录: $ICON_DIR"
echo "========================================"

SUCCESS=0
FAILED=0

for icon in "${ICONS[@]}"; do
  echo -n "下载 $icon... "
  
  # 下载并转为PNG格式
  curl -s -f -m 10 -o "$ICON_DIR/$icon" "$CDN_URL/$icon"
  
  if [ $? -eq 0 ] && [ -s "$ICON_DIR/$icon" ]; then
    # 转为PNG格式
    convert "$ICON_DIR/$icon" "${ICON_DIR}/${icon%.jpg}.png"
    rm "$ICON_DIR/$icon"
    echo -e "${GREEN}✅ 成功${NC}"
    SUCCESS=$((SUCCESS+1))
  else
    echo -e "${RED}❌ 失败${NC}"
    rm -f "$ICON_DIR/$icon"
    FAILED=$((FAILED+1))
  fi
done

echo "========================================"
echo -e "${YELLOW}生成图标索引文件...${NC}"

# 生成索引JSON
cat > "$ICON_DIR/index.json" <<EOF
{
  "generatedAt": "$(date -Iseconds)",
  "total": ${#ICONS[@]},
  "success": $SUCCESS,
  "failed": $FAILED,
  "icons": {
EOF

FIRST=true
for icon in "${ICONS[@]}"; do
  png_file="${icon%.jpg}.png"
  if [ -f "$ICON_DIR/$png_file" ]; then
    if [ "$FIRST" = true ]; then
      FIRST=false
    else
      echo "," >> "$ICON_DIR/index.json"
    fi
    key="${png_file%.png}"
    echo -n "    \"$key\": \"$png_file\"" >> "$ICON_DIR/index.json"
  fi
done

echo >> "$ICON_DIR/index.json"
echo "  }" >> "$ICON_DIR/index.json"
echo "}" >> "$ICON_DIR/index.json"

echo -e "${GREEN}📝 图标索引文件已生成: $ICON_DIR/index.json${NC}"
echo "========================================"
echo -e "${GREEN}下载完成!${NC}"
echo "总计: ${#ICONS[@]} 个"
echo "成功: ${GREEN}$SUCCESS${NC} 个"
echo "失败: ${RED}$FAILED${NC} 个"
echo "========================================"

# 检查图片格式
echo -e "${YELLOW}验证图片格式...${NC}"
for png in "$ICON_DIR"/*.png; do
  if ! file "$png" | grep -q "PNG image data"; then
    echo -e "${RED}❌ 损坏: $(basename "$png")${NC}"
    rm "$png"
  fi
done

# 复制到前端目录
echo -e "${YELLOW}复制图标到前端资源目录...${NC}"
mkdir -p /root/.openclaw/workspace/wow-web-mmo/frontend/public/assets/icons/
cp -r "$ICON_DIR"/*.png /root/.openclaw/workspace/wow-web-mmo/frontend/public/assets/icons/
cp "$ICON_DIR/index.json" /root/.openclaw/workspace/wow-web-mmo/frontend/public/assets/icons/
echo -e "${GREEN}✅ 图标已复制到前端目录${NC}"

echo
echo -e "${GREEN}📖 所有图标已经可以在前端通过 /assets/icons/xxx.png 访问${NC}"
echo -e "示例: /assets/icons/class_warrior.png"
