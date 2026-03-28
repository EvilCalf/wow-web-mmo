#!/bin/bash

# 魔兽世界图标下载脚本 (国内镜像版)
# 使用网易暴雪镜像站，国内访问更快

# 配置
ICON_DIR="./icons"
CDN_URL="https://wow.163.com/wow/icons/large"

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
  "class_druid.png"
  
  # 技能图标
  "ability_warrior_charge.png"
  "ability_warrior_bloodthirst.png"
  "ability_warrior_shieldblock.png"
  "spell_holy_holybolt.png"
  "spell_holy_avengingwrath.png"
  "spell_holy_shieldofrighteousness.png"
  "ability_hunter_arcaneShot.png"
  "ability_hunter_steadyshot.png"
  "ability_rogue_backstab.png"
  "ability_rogue_stealth.png"
  "spell_holy_powerwordshield.png"
  "spell_shadow_mindflay.png"
  "spell_deathknight_deathcoil.png"
  "spell_deathknight_froststrike.png"
  "spell_shaman_lightningbolt.png"
  "spell_shaman_chainheal.png"
  "spell_mage_fireball.png"
  "spell_mage_frostbolt.png"
  "spell_warlock_immolate.png"
  "spell_warlock_shadowbolt.png"
  
  # 物品图标
  "inv_sword_62.png"       # 灰烬使者
  "inv_sword_39.png"       # 风剑
  "inv_hammer_13.png"      # 橙锤
  "inv_staff_18.png"       # 橙杖
  "inv_jewel_35.png"        # 宝石
  "inv_potion_52.png"       # 红药
  "inv_potion_54.png"       # 蓝药
)

echo -e "${YELLOW}开始下载 ${#ICONS[@]} 个魔兽世界图标...${NC}"
echo "保存目录: $ICON_DIR"
echo "========================================"

SUCCESS=0
FAILED=0
SKIPPED=0

for icon in "${ICONS[@]}"; do
  if [ -f "$ICON_DIR/$icon" ]; then
    echo -e "${YELLOW}⏭️ 已存在: $icon${NC}"
    SKIPPED=$((SKIPPED+1))
    continue
  fi
  
  echo -n "下载 $icon... "
  
  curl -s -f -m 5 -o "$ICON_DIR/$icon" "$CDN_URL/$icon"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 成功${NC}"
    SUCCESS=$((SUCCESS+1))
  else
    echo -e "${RED}❌ 失败${NC}"
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
  "skipped": $SKIPPED,
  "icons": {
EOF

FIRST=true
for icon in "${ICONS[@]}"; do
  if [ -f "$ICON_DIR/$icon" ]; then
    if [ "$FIRST" = true ]; then
      FIRST=false
    else
      echo "," >> "$ICON_DIR/index.json"
    fi
    echo -n "    \"${icon%.png}\": \"$icon\"" >> "$ICON_DIR/index.json"
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
echo "跳过: ${YELLOW}$SKIPPED${NC} 个"
echo "失败: ${RED}$FAILED${NC} 个"
echo "========================================"

# 复制到前端目录
echo -e "${YELLOW}复制图标到前端资源目录...${NC}"
mkdir -p /root/.openclaw/workspace/wow-web-mmo/frontend/public/assets/icons/
cp -r "$ICON_DIR"/* /root/.openclaw/workspace/wow-web-mmo/frontend/public/assets/icons/
echo -e "${GREEN}✅ 图标已复制到前端目录${NC}"

echo
echo -e "${GREEN}📖 所有图标已经可以在前端通过 /assets/icons/xxx.png 访问${NC}"
