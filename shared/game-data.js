/**
 * 魔兽世界游戏数据
 * 自动生成，请勿直接修改
 * 生成时间: 2026-03-28T01:12:25.806Z
 */

export const classes = {
  "classes": [
    {
      "id": "warrior",
      "name": "战士",
      "nameEn": "Warrior",
      "color": "#C79C6E",
      "icon": "class_warrior.png",
      "description": "战士是近身格斗专家，使用重甲和近战武器，能够承受大量伤害并造成可观的输出。",
      "role": [
        "tank",
        "melee"
      ],
      "stats": {
        "strength": 90,
        "agility": 50,
        "stamina": 100,
        "intellect": 30,
        "spirit": 40
      },
      "availableSpecs": [
        {
          "id": "arms",
          "name": "武器",
          "role": "melee",
          "primaryStat": "strength"
        },
        {
          "id": "fury",
          "name": "狂怒",
          "role": "melee",
          "primaryStat": "strength"
        },
        {
          "id": "protection",
          "name": "防护",
          "role": "tank",
          "primaryStat": "stamina"
        }
      ]
    },
    {
      "id": "paladin",
      "name": "圣骑士",
      "nameEn": "Paladin",
      "color": "#F58CBA",
      "icon": "class_paladin.png",
      "description": "圣骑士是圣光的战士，能够治疗盟友、承受伤害或作为近战输出。",
      "role": [
        "tank",
        "healer",
        "melee"
      ],
      "stats": {
        "strength": 70,
        "agility": 40,
        "stamina": 85,
        "intellect": 60,
        "spirit": 70
      },
      "availableSpecs": [
        {
          "id": "holy",
          "name": "神圣",
          "role": "healer",
          "primaryStat": "intellect"
        },
        {
          "id": "protection",
          "name": "防护",
          "role": "tank",
          "primaryStat": "stamina"
        },
        {
          "id": "retribution",
          "name": "惩戒",
          "role": "melee",
          "primaryStat": "strength"
        }
      ]
    },
    {
      "id": "hunter",
      "name": "猎人",
      "nameEn": "Hunter",
      "color": "#ABD473",
      "icon": "class_hunter.png",
      "description": "猎人是远程物理输出，擅长使用弓箭或枪械，还能驯服野兽作为宠物。",
      "role": [
        "ranged"
      ],
      "stats": {
        "strength": 40,
        "agility": 95,
        "stamina": 75,
        "intellect": 45,
        "spirit": 50
      },
      "availableSpecs": [
        {
          "id": "beast_mastery",
          "name": "野兽控制",
          "role": "ranged",
          "primaryStat": "agility"
        },
        {
          "id": "marksmanship",
          "name": "射击",
          "role": "ranged",
          "primaryStat": "agility"
        },
        {
          "id": "survival",
          "name": "生存",
          "role": "melee",
          "primaryStat": "agility"
        }
      ]
    },
    {
      "id": "rogue",
      "name": "潜行者",
      "nameEn": "Rogue",
      "color": "#FFF569",
      "icon": "class_rogue.png",
      "description": "潜行者是潜行专家，擅长使用匕首和毒药，在近距离造成爆发伤害。",
      "role": [
        "melee"
      ],
      "stats": {
        "strength": 50,
        "agility": 100,
        "stamina": 70,
        "intellect": 25,
        "spirit": 35
      },
      "availableSpecs": [
        {
          "id": "assassination",
          "name": "奇袭",
          "role": "melee",
          "primaryStat": "agility"
        },
        {
          "id": "outlaw",
          "name": "狂徒",
          "role": "melee",
          "primaryStat": "agility"
        },
        {
          "id": "subtlety",
          "name": "敏锐",
          "role": "melee",
          "primaryStat": "agility"
        }
      ]
    },
    {
      "id": "priest",
      "name": "牧师",
      "nameEn": "Priest",
      "color": "#FFFFFF",
      "icon": "class_priest.png",
      "description": "牧师是神圣魔法的使用者，能够治疗盟友或使用暗影魔法伤害敌人。",
      "role": [
        "healer",
        "ranged"
      ],
      "stats": {
        "strength": 30,
        "agility": 40,
        "stamina": 65,
        "intellect": 100,
        "spirit": 90
      },
      "availableSpecs": [
        {
          "id": "discipline",
          "name": "戒律",
          "role": "healer",
          "primaryStat": "intellect"
        },
        {
          "id": "holy",
          "name": "神圣",
          "role": "healer",
          "primaryStat": "intellect"
        },
        {
          "id": "shadow",
          "name": "暗影",
          "role": "ranged",
          "primaryStat": "intellect"
        }
      ]
    },
    {
      "id": "death_knight",
      "name": "死亡骑士",
      "nameEn": "Death Knight",
      "color": "#C41F3B",
      "icon": "class_deathknight.png",
      "description": "死亡骑士是符文魔法使用者，作为黑暗的战士能够承受伤害或输出。",
      "role": [
        "tank",
        "melee"
      ],
      "stats": {
        "strength": 85,
        "agility": 55,
        "stamina": 95,
        "intellect": 40,
        "spirit": 30
      },
      "availableSpecs": [
        {
          "id": "blood",
          "name": "鲜血",
          "role": "tank",
          "primaryStat": "stamina"
        },
        {
          "id": "frost",
          "name": "冰霜",
          "role": "melee",
          "primaryStat": "strength"
        },
        {
          "id": "unholy",
          "name": "邪恶",
          "role": "melee",
          "primaryStat": "strength"
        }
      ]
    },
    {
      "id": "shaman",
      "name": "萨满祭司",
      "nameEn": "Shaman",
      "color": "#0070DE",
      "icon": "class_shaman.png",
      "description": "萨满祭司是元素的掌控者，能够使用元素魔法伤害敌人，治疗盟友，或作为近战输出。",
      "role": [
        "healer",
        "ranged",
        "melee"
      ],
      "stats": {
        "strength": 60,
        "agility": 50,
        "stamina": 75,
        "intellect": 85,
        "spirit": 70
      },
      "availableSpecs": [
        {
          "id": "elemental",
          "name": "元素",
          "role": "ranged",
          "primaryStat": "intellect"
        },
        {
          "id": "enhancement",
          "name": "增强",
          "role": "melee",
          "primaryStat": "agility"
        },
        {
          "id": "restoration",
          "name": "恢复",
          "role": "healer",
          "primaryStat": "intellect"
        }
      ]
    },
    {
      "id": "mage",
      "name": "法师",
      "nameEn": "Mage",
      "color": "#69CCF0",
      "icon": "class_mage.png",
      "description": "法师是奥术魔法大师，使用强大的火焰、冰霜和奥术魔法造成远距离伤害。",
      "role": [
        "ranged"
      ],
      "stats": {
        "strength": 25,
        "agility": 35,
        "stamina": 60,
        "intellect": 105,
        "spirit": 65
      },
      "availableSpecs": [
        {
          "id": "arcane",
          "name": "奥术",
          "role": "ranged",
          "primaryStat": "intellect"
        },
        {
          "id": "fire",
          "name": "火焰",
          "role": "ranged",
          "primaryStat": "intellect"
        },
        {
          "id": "frost",
          "name": "冰霜",
          "role": "ranged",
          "primaryStat": "intellect"
        }
      ]
    },
    {
      "id": "warlock",
      "name": "术士",
      "nameEn": "Warlock",
      "color": "#9482C9",
      "icon": "class_warlock.png",
      "description": "术士是恶魔魔法使用者，能够召唤恶魔仆从，使用黑暗魔法造成伤害。",
      "role": [
        "ranged"
      ],
      "stats": {
        "strength": 30,
        "agility": 35,
        "stamina": 65,
        "intellect": 100,
        "spirit": 60
      },
      "availableSpecs": [
        {
          "id": "affliction",
          "name": "痛苦",
          "role": "ranged",
          "primaryStat": "intellect"
        },
        {
          "id": "demonology",
          "name": "恶魔学识",
          "role": "ranged",
          "primaryStat": "intellect"
        },
        {
          "id": "destruction",
          "name": "毁灭",
          "role": "ranged",
          "primaryStat": "intellect"
        }
      ]
    },
    {
      "id": "monk",
      "name": "武僧",
      "nameEn": "Monk",
      "color": "#00FF96",
      "icon": "class_monk.png",
      "description": "武僧是武术大师，能够使用真气治疗盟友、承受伤害或作为近战输出。",
      "role": [
        "tank",
        "healer",
        "melee"
      ],
      "stats": {
        "strength": 65,
        "agility": 85,
        "stamina": 80,
        "intellect": 50,
        "spirit": 60
      },
      "availableSpecs": [
        {
          "id": "brewmaster",
          "name": "酒仙",
          "role": "tank",
          "primaryStat": "stamina"
        },
        {
          "id": "mistweaver",
          "name": "织雾",
          "role": "healer",
          "primaryStat": "intellect"
        },
        {
          "id": "windwalker",
          "name": "踏风",
          "role": "melee",
          "primaryStat": "agility"
        }
      ]
    }
  ]
};
export const skills = {
  "skills": [
    {
      "id": "warrior_heroic_strike",
      "name": "英勇打击",
      "nameEn": "Heroic Strike",
      "icon": "ability_meleedamage.png",
      "class": "warrior",
      "specs": [
        "arms",
        "fury",
        "protection"
      ],
      "type": "melee",
      "cost": {
        "resource": "rage",
        "amount": 15
      },
      "castTime": 0,
      "cooldown": 3,
      "range": 5,
      "damage": {
        "type": "physical",
        "base": 120,
        "scaling": {
          "stat": "strength",
          "multiplier": 0.8
        }
      },
      "description": "强力的近战攻击，对目标造成额外伤害。"
    },
    {
      "id": "warrior_shield_slam",
      "name": "盾牌猛击",
      "nameEn": "Shield Slam",
      "icon": "inv_shield_06.png",
      "class": "warrior",
      "specs": [
        "protection"
      ],
      "type": "melee",
      "cost": {
        "resource": "rage",
        "amount": 20
      },
      "castTime": 0,
      "cooldown": 6,
      "range": 5,
      "damage": {
        "type": "physical",
        "base": 150,
        "scaling": {
          "stat": "stamina",
          "multiplier": 0.5
        }
      },
      "effects": [
        {
          "type": "threat",
          "multiplier": 2
        }
      ],
      "description": "用盾牌猛击目标，造成大量伤害并产生高威胁值。"
    },
    {
      "id": "paladin_holy_light",
      "name": "圣光术",
      "nameEn": "Holy Light",
      "icon": "spell_holy_holybolt.png",
      "class": "paladin",
      "specs": [
        "holy"
      ],
      "type": "heal",
      "cost": {
        "resource": "mana",
        "amount": 120
      },
      "castTime": 2.5,
      "cooldown": 0,
      "range": 40,
      "heal": {
        "base": 300,
        "scaling": {
          "stat": "intellect",
          "multiplier": 1.2
        }
      },
      "description": "召唤神圣之光治疗友方目标。"
    },
    {
      "id": "paladin_avenging_wrath",
      "name": "复仇之怒",
      "nameEn": "Avenging Wrath",
      "icon": "spell_holy_avenginewrath.png",
      "class": "paladin",
      "specs": [
        "retribution"
      ],
      "type": "buff",
      "cost": {
        "resource": "mana",
        "amount": 50
      },
      "castTime": 0,
      "cooldown": 120,
      "range": 0,
      "duration": 20,
      "effects": [
        {
          "type": "damage_bonus",
          "multiplier": 1.2,
          "school": "all"
        }
      ],
      "description": "激活时，你造成的所有伤害提高20%，持续20秒。"
    },
    {
      "id": "hunter_arcane_shot",
      "name": "奥术射击",
      "nameEn": "Arcane Shot",
      "icon": "spell_arcane_shot.png",
      "class": "hunter",
      "specs": [
        "beast_mastery",
        "marksmanship"
      ],
      "type": "ranged",
      "cost": {
        "resource": "focus",
        "amount": 15
      },
      "castTime": 0,
      "cooldown": 5,
      "range": 40,
      "damage": {
        "type": "arcane",
        "base": 180,
        "scaling": {
          "stat": "agility",
          "multiplier": 0.7
        }
      },
      "description": "射出奥术能量之箭，对目标造成奥术伤害。"
    },
    {
      "id": "rogue_backstab",
      "name": "背刺",
      "nameEn": "Backstab",
      "icon": "ability_stealth.png",
      "class": "rogue",
      "specs": [
        "assassination",
        "subtlety"
      ],
      "type": "melee",
      "cost": {
        "resource": "energy",
        "amount": 35
      },
      "castTime": 0,
      "cooldown": 0,
      "range": 5,
      "requirements": [
        "behind_target"
      ],
      "damage": {
        "type": "physical",
        "base": 200,
        "scaling": {
          "stat": "agility",
          "multiplier": 0.9
        },
        "critBonus": 1.5
      },
      "description": "从背后袭击目标，造成大量伤害，爆击几率提高。"
    },
    {
      "id": "priest_power_word_shield",
      "name": "真言术：盾",
      "nameEn": "Power Word: Shield",
      "icon": "spell_holy_powerwordshield.png",
      "class": "priest",
      "specs": [
        "discipline"
      ],
      "type": "shield",
      "cost": {
        "resource": "mana",
        "amount": 80
      },
      "castTime": 0,
      "cooldown": 7.5,
      "range": 40,
      "absorb": {
        "base": 250,
        "scaling": {
          "stat": "intellect",
          "multiplier": 0.8
        }
      },
      "duration": 15,
      "description": "为友方目标施加护盾，吸收伤害，持续15秒。"
    },
    {
      "id": "priest_mind_flay",
      "name": "精神鞭笞",
      "nameEn": "Mind Flay",
      "icon": "spell_shadow_mindflay.png",
      "class": "priest",
      "specs": [
        "shadow"
      ],
      "type": "channeled",
      "cost": {
        "resource": "mana",
        "amount": 40
      },
      "castTime": 3,
      "channeled": true,
      "ticks": 3,
      "cooldown": 0,
      "range": 40,
      "damage": {
        "type": "shadow",
        "base": 60,
        "perTick": true,
        "scaling": {
          "stat": "intellect",
          "multiplier": 0.3
        }
      },
      "effects": [
        {
          "type": "slow",
          "amount": 0.5,
          "duration": 3
        }
      ],
      "description": "用暗影能量攻击目标的精神，在3秒内造成暗影伤害并减速目标50%。"
    },
    {
      "id": "deathknight_death_coil",
      "name": "死亡缠绕",
      "nameEn": "Death Coil",
      "icon": "spell_shadow_deathcoil.png",
      "class": "death_knight",
      "specs": [
        "frost",
        "unholy"
      ],
      "type": "ranged",
      "cost": {
        "resource": "runic_power",
        "amount": 40
      },
      "castTime": 0,
      "cooldown": 0,
      "range": 30,
      "damage": {
        "type": "shadow",
        "base": 220,
        "scaling": {
          "stat": "strength",
          "multiplier": 0.7
        }
      },
      "description": "释放黑暗能量攻击目标，造成暗影伤害。"
    },
    {
      "id": "shaman_lightning_bolt",
      "name": "闪电箭",
      "nameEn": "Lightning Bolt",
      "icon": "spell_nature_lightning.png",
      "class": "shaman",
      "specs": [
        "elemental"
      ],
      "type": "ranged",
      "cost": {
        "resource": "mana",
        "amount": 100
      },
      "castTime": 2,
      "cooldown": 0,
      "range": 40,
      "damage": {
        "type": "nature",
        "base": 250,
        "scaling": {
          "stat": "intellect",
          "multiplier": 0.9
        }
      },
      "description": "向目标射出闪电箭，造成自然伤害。"
    },
    {
      "id": "mage_fireball",
      "name": "火球术",
      "nameEn": "Fireball",
      "icon": "spell_fire_flamebolt.png",
      "class": "mage",
      "specs": [
        "fire"
      ],
      "type": "ranged",
      "cost": {
        "resource": "mana",
        "amount": 90
      },
      "castTime": 2.5,
      "cooldown": 0,
      "range": 40,
      "damage": {
        "type": "fire",
        "base": 280,
        "scaling": {
          "stat": "intellect",
          "multiplier": 1
        }
      },
      "effects": [
        {
          "type": "dot",
          "name": "点燃",
          "duration": 4,
          "damage": 0.2,
          "tickRate": 2
        }
      ],
      "description": "发射火球攻击目标，造成火焰伤害并点燃目标。"
    },
    {
      "id": "warlock_corruption",
      "name": "腐蚀术",
      "nameEn": "Corruption",
      "icon": "spell_shadow_abominationexplosion.png",
      "class": "warlock",
      "specs": [
        "affliction"
      ],
      "type": "dot",
      "cost": {
        "resource": "mana",
        "amount": 70
      },
      "castTime": 1.5,
      "cooldown": 0,
      "range": 40,
      "duration": 18,
      "ticks": 6,
      "damage": {
        "type": "shadow",
        "base": 65,
        "perTick": true,
        "scaling": {
          "stat": "intellect",
          "multiplier": 0.35
        }
      },
      "description": "腐蚀目标，在18秒内造成持续暗影伤害。"
    },
    {
      "id": "monk_rising_sun_kick",
      "name": "旭日东升踢",
      "nameEn": "Rising Sun Kick",
      "icon": "ability_monk_risingsunkick.png",
      "class": "monk",
      "specs": [
        "windwalker"
      ],
      "type": "melee",
      "cost": {
        "resource": "chi",
        "amount": 2
      },
      "castTime": 0,
      "cooldown": 8,
      "range": 5,
      "damage": {
        "type": "physical",
        "base": 240,
        "scaling": {
          "stat": "agility",
          "multiplier": 0.85
        }
      },
      "effects": [
        {
          "type": "debuff",
          "name": "物理易伤",
          "duration": 10,
          "effect": {
            "damage_taken": 1.1
          }
        }
      ],
      "description": "强力踢击，造成物理伤害并使目标受到的物理伤害提高10%。"
    }
  ]
};
export const talents = {
  "talents": {
    "warrior": {
      "arms": [
        {
          "tier": 1,
          "column": 1,
          "id": "warrior_arms_t1_c1",
          "name": "战争机器",
          "nameEn": "War Machine",
          "icon": "ability_warrior_warmachine.png",
          "maxPoints": 1,
          "description": "你的移动速度提高15%，近战自动攻击有10%几率产生额外5点怒气。",
          "effects": [
            {
              "type": "movement_speed",
              "multiplier": 1.15
            },
            {
              "type": "proc",
              "chance": 0.1,
              "effect": {
                "resource": "rage",
                "amount": 5
              }
            }
          ]
        },
        {
          "tier": 1,
          "column": 2,
          "id": "warrior_arms_t1_c2",
          "name": "冲锋",
          "nameEn": "Charge",
          "icon": "ability_warrior_charge.png",
          "maxPoints": 1,
          "description": "向目标冲锋，使其昏迷1.5秒，并产生20点怒气。",
          "cooldown": 20,
          "range": "8-25",
          "effects": [
            {
              "type": "stun",
              "duration": 1.5
            },
            {
              "type": "resource",
              "resource": "rage",
              "amount": 20
            }
          ]
        }
      ]
    },
    "paladin": {
      "holy": [
        {
          "tier": 1,
          "column": 1,
          "id": "paladin_holy_t1_c1",
          "name": "圣光灌注",
          "nameEn": "Infusion of Light",
          "icon": "spell_holy_infusionoflight.png",
          "maxPoints": 2,
          "description": "你的圣光闪现和圣光术有15%/30%几率使你的下一个圣光闪现的施法时间减少100%。",
          "effects": [
            {
              "type": "proc",
              "chance": 0.15,
              "perPoint": 0.15,
              "effect": {
                "buff": "圣光灌注",
                "duration": 15,
                "effect": {
                  "cast_time_reduction": 1,
                  "spells": [
                    "flash_of_light"
                  ]
                }
              }
            }
          ]
        }
      ]
    },
    "mage": {
      "fire": [
        {
          "tier": 1,
          "column": 1,
          "id": "mage_fire_t1_c1",
          "name": "火焰连击",
          "nameEn": "Pyroclasm",
          "icon": "spell_fire_pyroclasm.png",
          "maxPoints": 2,
          "description": "你的火焰冲击暴击时有50%/100%几率使你的下一个炎爆术的施法时间减少100%。",
          "effects": [
            {
              "type": "proc",
              "chance": 0.5,
              "perPoint": 0.5,
              "trigger": "crit",
              "spells": [
                "fire_blast"
              ],
              "effect": {
                "buff": "火焰连击",
                "duration": 10,
                "effect": {
                  "cast_time_reduction": 1,
                  "spells": [
                    "pyroblast"
                  ]
                }
              }
            }
          ]
        }
      ]
    }
  }
};
export const items = {
  "items": [
    {
      "id": "item_1",
      "name": "灰烬使者",
      "nameEn": "Ashbringer",
      "icon": "inv_sword_62.png",
      "type": "weapon",
      "subType": "two_hand_sword",
      "quality": "legendary",
      "level": 60,
      "itemLevel": 85,
      "bindType": "pickup",
      "slot": "two_hand",
      "stats": {
        "strength": 38,
        "stamina": 20,
        "crit_chance": 0.02
      },
      "damage": {
        "min": 285,
        "max": 430,
        "speed": 3.6,
        "dps": 99.3
      },
      "effects": [
        {
          "type": "passive",
          "description": "对亡灵造成的伤害提高200点。"
        }
      ],
      "description": "圣光的正义之力在剑身中涌动。",
      "sellPrice": 1000000
    },
    {
      "id": "item_2",
      "name": "雷霆之怒，逐风者的祝福之剑",
      "nameEn": "Thunderfury, Blessed Blade of the Windseeker",
      "icon": "inv_sword_39.png",
      "type": "weapon",
      "subType": "one_hand_sword",
      "quality": "legendary",
      "level": 60,
      "itemLevel": 80,
      "bindType": "pickup",
      "slot": "main_hand",
      "stats": {
        "strength": 19,
        "agility": 15,
        "stamina": 17,
        "nature_resistance": 9
      },
      "damage": {
        "min": 44,
        "max": 115,
        "speed": 1.9,
        "dps": 53.9
      },
      "effects": [
        {
          "type": "proc",
          "chance": 0.2,
          "description": "攻击时对目标造成自然伤害，并降低其自然抗性25点，持续30秒。"
        }
      ],
      "description": "风王子桑德兰的佩剑，蕴含着风元素的强大力量。",
      "sellPrice": 950000
    },
    {
      "id": "item_3",
      "name": "萨弗拉斯，炎魔拉格纳罗斯之手",
      "nameEn": "Sulfuras, Hand of Ragnaros",
      "icon": "inv_hammer_13.png",
      "type": "weapon",
      "subType": "two_hand_mace",
      "quality": "legendary",
      "level": 60,
      "itemLevel": 80,
      "bindType": "pickup",
      "slot": "two_hand",
      "stats": {
        "strength": 12,
        "stamina": 24
      },
      "damage": {
        "min": 223,
        "max": 372,
        "speed": 3.7,
        "dps": 80.4
      },
      "effects": [
        {
          "type": "proc",
          "chance": 0.05,
          "description": "对目标造成273到333点火焰伤害。"
        }
      ],
      "description": "炎魔拉格纳罗斯的专属武器，蕴含着火焰的毁灭之力。",
      "sellPrice": 900000
    },
    {
      "id": "item_4",
      "name": "巨龙复仇者",
      "nameEn": "Dragonslayer",
      "icon": "inv_axe_12.png",
      "type": "weapon",
      "subType": "two_hand_axe",
      "quality": "epic",
      "level": 60,
      "itemLevel": 75,
      "bindType": "pickup",
      "slot": "two_hand",
      "stats": {
        "strength": 22,
        "stamina": 18
      },
      "damage": {
        "min": 198,
        "max": 298,
        "speed": 3.4,
        "dps": 72.9
      },
      "effects": [
        {
          "type": "passive",
          "description": "对龙类造成的伤害提高60点。"
        }
      ],
      "description": "屠龙勇士的象征，对龙族有额外伤害加成。",
      "sellPrice": 500000
    },
    {
      "id": "item_5",
      "name": "暗影烈焰法杖",
      "nameEn": "Shadowflame Staff",
      "icon": "inv_staff_18.png",
      "type": "weapon",
      "subType": "staff",
      "quality": "epic",
      "level": 60,
      "itemLevel": 78,
      "bindType": "pickup",
      "slot": "two_hand",
      "stats": {
        "intellect": 42,
        "stamina": 26,
        "spell_power": 84,
        "crit_chance": 0.02
      },
      "description": "蕴含着暗影和火焰能量的强大法杖，是法系输出的极品。",
      "sellPrice": 600000
    },
    {
      "id": "item_6",
      "name": "奎尔塞拉",
      "nameEn": "Quel'Serrar",
      "icon": "inv_sword_48.png",
      "type": "weapon",
      "subType": "one_hand_sword",
      "quality": "epic",
      "level": 60,
      "itemLevel": 71,
      "bindType": "equip",
      "slot": "main_hand",
      "stats": {
        "strength": 13,
        "stamina": 12
      },
      "damage": {
        "min": 84,
        "max": 157,
        "speed": 2,
        "dps": 60.3
      },
      "effects": [
        {
          "type": "proc",
          "chance": 0.02,
          "description": "防御等级提高30点，持续10秒。"
        }
      ],
      "description": "战士的象征之剑，拥有卓越的防御属性。",
      "sellPrice": 400000
    },
    {
      "id": "item_7",
      "name": "红龙防护者",
      "nameEn": "Red Dragonscale Protector",
      "icon": "inv_shield_06.png",
      "type": "armor",
      "subType": "shield",
      "quality": "epic",
      "level": 60,
      "itemLevel": 77,
      "bindType": "pickup",
      "slot": "off_hand",
      "armor": 2958,
      "block": 68,
      "stats": {
        "stamina": 19,
        "fire_resistance": 24
      },
      "description": "用红龙鳞片制作的盾牌，拥有极强的火焰抗性。",
      "sellPrice": 450000
    },
    {
      "id": "item_8",
      "name": "恢复宝石",
      "nameEn": "Restoration Gem",
      "icon": "inv_jewel_35.png",
      "type": "armor",
      "subType": "trinket",
      "quality": "epic",
      "level": 60,
      "itemLevel": 76,
      "bindType": "pickup",
      "slot": "trinket",
      "stats": {
        "healing_power": 66,
        "mana_regen": 5
      },
      "description": "牧师和圣骑士的极品治疗饰品。",
      "sellPrice": 350000
    },
    {
      "id": "item_9",
      "name": "奈萨里奥之泪",
      "nameEn": "Neltharion's Tear",
      "icon": "inv_jewel_40.png",
      "type": "armor",
      "subType": "trinket",
      "quality": "epic",
      "level": 60,
      "itemLevel": 78,
      "bindType": "pickup",
      "slot": "trinket",
      "stats": {
        "spell_power": 44,
        "spell_hit": 0.02
      },
      "description": "死亡之翼的精华凝聚，法系输出的极品饰品。",
      "sellPrice": 550000
    },
    {
      "id": "item_10",
      "name": "屠龙者的纹章",
      "nameEn": "Dragonslayer's Signet",
      "icon": "inv_jewel_29.png",
      "type": "armor",
      "subType": "ring",
      "quality": "epic",
      "level": 60,
      "itemLevel": 74,
      "bindType": "pickup",
      "slot": "finger",
      "stats": {
        "strength": 14,
        "agility": 12,
        "stamina": 16,
        "hit_chance": 0.01
      },
      "description": "屠龙勇士的荣耀象征，近战输出的极品戒指。",
      "sellPrice": 300000
    },
    {
      "id": "potion_1",
      "name": "超级治疗药水",
      "nameEn": "Super Healing Potion",
      "icon": "inv_potion_52.png",
      "type": "consumable",
      "subType": "potion",
      "quality": "uncommon",
      "level": 55,
      "bindType": "none",
      "slot": "consumable",
      "stackSize": 20,
      "effects": [
        {
          "type": "heal",
          "min": 1050,
          "max": 1750,
          "cooldown": 120
        }
      ],
      "description": "使用：恢复1050到1750点生命值。",
      "sellPrice": 5000
    },
    {
      "id": "potion_2",
      "name": "超级法力药水",
      "nameEn": "Super Mana Potion",
      "icon": "inv_potion_54.png",
      "type": "consumable",
      "subType": "potion",
      "quality": "uncommon",
      "level": 55,
      "bindType": "none",
      "slot": "consumable",
      "stackSize": 20,
      "effects": [
        {
          "type": "resource",
          "resource": "mana",
          "min": 1350,
          "max": 2250,
          "cooldown": 120
        }
      ],
      "description": "使用：恢复1350到2250点法力值。",
      "sellPrice": 6000
    }
  ]
};
export const icons = null;

export default {
  classes,
  skills,
  talents,
  items,
  icons
};
