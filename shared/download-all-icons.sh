#!/bin/bash

# 魔兽世界全图标下载脚本
# 包含WLK版本所有职业技能、物品、buff图标

ICON_DIR="./icons-full"
CDN_URL="https://render.worldofwarcraft.com/us/icons/56"

mkdir -p "$ICON_DIR"

# 职业全技能图标
ICONS=(
  # 战士
  "ability_warrior_bloodthirst"
  "ability_warrior_charge"
  "ability_warrior_shieldblock"
  "ability_warrior_shieldbash"
  "ability_warrior_sunder"
  "ability_warrior_thunderclap"
  "ability_warrior_whirlwind"
  "ability_warrior_executioner"
  "ability_warrior_overpower"
  "ability_warrior_mortalstrike"
  "ability_warrior_slam"
  "ability_warrior_berserkerrage"
  "ability_warrior_battleShout"
  "ability_warrior_commandingShout"
  
  # 圣骑士
  "spell_holy_holylight"
  "spell_holy_flashoflight"
  "spell_holy_avengingwrath"
  "spell_holy_shieldofrighteousness"
  "spell_holy_powerwordshield"
  "spell_holy_hammerofjustice"
  "spell_holy_consecration"
  "spell_holy_divineshield"
  "spell_holy_divinestorm"
  "spell_holy_crusaderstrike"
  "spell_holy_sealofrighteousness"
  "spell_holy_sealofcommand"
  "spell_holy_sealofvengeance"
  
  # 猎人
  "ability_hunter_arcaneShot"
  "ability_hunter_steadyshot"
  "ability_hunter_aimedshot"
  "ability_hunter_multishot"
  "ability_hunter_serpentsting"
  "ability_hunter_scattershot"
  "ability_hunter_traps_immolation"
  "ability_hunter_traps_freezing"
  "ability_hunter_traps_explosive"
  "ability_hunter_beastwithin"
  "ability_hunter_bestialwrath"
  "ability_hunter_mendpet"
  "ability_hunter_feigndeath"
  "ability_hunter_aspectofthehawk"
  "ability_hunter_aspectoftheviper"
  "ability_hunter_aspectofthecheetah"
  "ability_hunter_aspectofthepack"
  
  # 盗贼
  "ability_rogue_backstab"
  "ability_rogue_stealth"
  "ability_rogue_sinisterstrike"
  "ability_rogue_eviscerate"
  "ability_rogue_sliceanddice"
  "ability_rogue_rupture"
  "ability_rogue_kidneyshot"
  "ability_rogue_gouge"
  "ability_rogue_vanish"
  "ability_rogue_sprint"
  "ability_rogue_evasion"
  "ability_rogue_cloakofshadows"
  "ability_rogue_fanofknives"
  "ability_rogue_mutilate"
  "ability_rogue_shadowstep"
  
  # 牧师
  "spell_holy_powerwordshield"
  "spell_holy_renew"
  "spell_holy_lesserheal"
  "spell_holy_flashheal"
  "spell_holy_greaterheal"
  "spell_holy_prayerofhealing"
  "spell_holy_painSuppression"
  "spell_holy_guardianspirit"
  "spell_shadow_mindflay"
  "spell_shadow_mindblast"
  "spell_shadow_swirlingdeath"
  "spell_shadow_vampirictouch"
  "spell_shadow_devouringplague"
  "spell_shadow_shadowform"
  "spell_shadow_dispersion"
  "spell_shadow_fade"
  
  # 死亡骑士
  "spell_deathknight_deathcoil"
  "spell_deathknight_froststrike"
  "spell_deathknight_obliterate"
  "spell_deathknight_icytouch"
  "spell_deathknight_plaguestrike"
  "spell_deathknight_bloodstrike"
  "spell_deathknight_deathstrike"
  "spell_deathknight_heartstrike"
  "spell_deathknight_rune strike"
  "spell_deathknight_deathanddecay"
  "spell_deathknight_anti_magic_shell"
  "spell_deathknight_icebound_fortitude"
  "spell_deathknight_unholy_frenzy"
  "spell_deathknight_summongargoyle"
  
  # 萨满
  "spell_nature_lightningbolt"
  "spell_nature_chainheal"
  "spell_nature_chainlightning"
  "spell_nature_lava_burst"
  "spell_nature_earthshock"
  "spell_nature_flameshock"
  "spell_nature_frostshock"
  "spell_nature_healingwave"
  "spell_nature_lesserhealingwave"
  "spell_nature_riptide"
  "spell_nature_earthshield"
  "spell_nature_bloodlust"
  "spell_nature_heroism"
  "spell_nature_totem_earthbind"
  "spell_nature_totem_stoneskin"
  "spell_nature_totem_windfury"
  "spell_nature_totem_mana_spring"
  "spell_nature_totem_healing_stream"
  
  # 法师
  "spell_fire_fireball"
  "spell_fire_fireblast"
  "spell_fire_pyroblast"
  "spell_fire_scorch"
  "spell_fire_blastwave"
  "spell_fire_livingbomb"
  "spell_fire_frostfirebolt"
  "spell_frost_frostbolt"
  "spell_frost_frostnova"
  "spell_frost_iceshield"
  "spell_frost_iceblock"
  "spell_frost_coneofcold"
  "spell_frost_summonwater_elemental"
  "spell_frost_deepfreeze"
  "spell_arcane_arcane_missiles"
  "spell_arcane_arcane_blast"
  "spell_arcane_arcane_explosion"
  "spell_nature_polymorph"
  "spell_nature_slowfall"
  "spell_holy_manashield"
  
  # 术士
  "spell_fire_immolate"
  "spell_fire_incinerate"
  "spell_fire_conflagrate"
  "spell_fire_soulfire"
  "spell_fire_chaos_bolt"
  "spell_shadow_shadowbolt"
  "spell_shadow_corruption"
  "spell_shadow_curse_of_agony"
  "spell_shadow_curse_of_doom"
  "spell_shadow_curse_of_the_elements"
  "spell_shadow_curse_of_weakness"
  "spell_shadow_life_tap"
  "spell_shadow_drain_life"
  "spell_shadow_drain_soul"
  "spell_shadow_drain_mana"
  "spell_shadow_hellfire"
  "spell_shadow_rain_of_fire"
  "spell_shadow_summon_imp"
  "spell_shadow_summon_voidwalker"
  "spell_shadow_summon_succubus"
  "spell_shadow_summon_felhunter"
  "spell_shadow_summon_felguard"
  "spell_shadow_metamorphosis"
  
  # 德鲁伊
  "spell_nature_wrath"
  "spell_nature_starfire"
  "spell_nature_starsurge"
  "spell_nature_moonfire"
  "spell_nature_sunfire"
  "spell_nature_entangling_roots"
  "spell_nature_hurricane"
  "spell_nature_rejuvenation"
  "spell_nature_regrowth"
  "spell_nature_wildgrowth"
  "spell_nature_lifebloom"
  "spell_nature_nourish"
  "spell_nature_healing_touch"
  "spell_nature_barkskin"
  "spell_nature_thorns"
  "spell_nature_travel_form"
  "spell_nature_bear_form"
  "spell_nature_cat_form"
  "spell_nature_moonkin_form"
  "spell_nature_tree_of_life"
  "spell_nature_mangle"
  "spell_nature_shred"
  "spell_nature_rake"
  "spell_nature_rip"
  "spell_nature_swipe"
  "spell_nature_lacerate"
  "spell_nature_maul"
  
  # 物品
  "inv_sword_62"   # 灰烬使者
  "inv_sword_39"   # 风剑
  "inv_hammer_13"  # 橙锤
  "inv_staff_18"   # 橙杖
  "inv_jewelcrafting_gem_35"
  "inv_potion_52"  # 红药
  "inv_potion_54"  # 蓝药
  "inv_misc_food_15" # 食物
  "inv_misc_drink_07" # 水
  "inv_ammo_arrow_07" # 箭
  "inv_ammo_bullet_07" # 子弹
)

echo "开始下载 ${#ICONS[@]} 个魔兽世界WLK核心图标..."

SUCCESS=0
FAILED=0

for icon in "${ICONS[@]}"; do
  echo -n "下载 $icon.jpg... "
  curl -s -f -m 10 -o "$ICON_DIR/$icon.jpg" "$CDN_URL/$icon.jpg"
  
  if [ $? -eq 0 ] && [ -s "$ICON_DIR/$icon.jpg" ]; then
    convert "$ICON_DIR/$icon.jpg" "${ICON_DIR}/${icon}.png"
    rm "$ICON_DIR/$icon.jpg"
    echo "✅ 成功"
    SUCCESS=$((SUCCESS+1))
  else
    echo "❌ 失败"
    rm -f "$ICON_DIR/$icon.jpg"
    FAILED=$((FAILED+1))
  fi
done

echo "下载完成！成功 $SUCCESS 个，失败 $FAILED 个"

# 复制到前端
cp -r "$ICON_DIR"/*.png /root/.openclaw/workspace/wow-web-mmo/frontend/public/assets/icons/
echo "已复制到前端资源目录"
