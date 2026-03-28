import Phaser from 'phaser'
import { Character } from '@/types'

class GameEngine {
  private game: Phaser.Game | null = null
  private character: Character | null = null
  private scene: Phaser.Scene | null = null

  constructor() {
    this.game = null
    this.character = null
    this.scene = null
  }

  init(container: HTMLElement, character: Character) {
    this.character = character

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: container,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: import.meta.env.DEV,
        },
      },
      scene: {
        preload: this.preload.bind(this),
        create: this.create.bind(this),
        update: this.update.bind(this),
      },
    }

    this.game = new Phaser.Game(config)

    window.addEventListener('resize', this.handleResize.bind(this))
  }

  private preload() {
    // 加载游戏资源
    this.scene = this.game?.scene.scenes[0] || null
    if (!this.scene) return

    // 加载地图瓦片
    this.scene.load.tilemapTiledJSON('map', '/assets/maps/world.json')
    this.scene.load.image('tiles', '/assets/tiles/terrain.png')
    
    // 加载角色精灵
    this.scene.load.spritesheet('player', '/assets/sprites/player.png', {
      frameWidth: 32,
      frameHeight: 48,
    })

    // 加载UI资源
    this.scene.load.image('ui_health', '/assets/ui/health.png')
    this.scene.load.image('ui_mana', '/assets/ui/mana.png')
  }

  private create() {
    if (!this.scene) return

    // 创建地图
    const map = this.scene.make.tilemap({ key: 'map' })
    const tileset = map.addTilesetImage('terrain', 'tiles')
    
    if (tileset) {
      const groundLayer = map.createLayer('Ground', tileset, 0, 0)
      const collisionLayer = map.createLayer('Collision', tileset, 0, 0)
      
      if (collisionLayer) {
        collisionLayer.setCollisionByProperty({ collides: true })
      }
    }

    // 创建玩家角色
    if (this.character) {
      const player = this.scene.physics.add.sprite(
        this.character.position.x,
        this.character.position.y,
        'player'
      )
      
      player.setCollideWorldBounds(true)
      
      // 创建角色动画
      this.scene.anims.create({
        key: 'left',
        frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      })
      
      this.scene.anims.create({
        key: 'right',
        frames: this.scene.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1,
      })
      
      this.scene.anims.create({
        key: 'up',
        frames: this.scene.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1,
      })
      
      this.scene.anims.create({
        key: 'down',
        frames: this.scene.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
        frameRate: 10,
        repeat: -1,
      })
    }

    // 创建UI
    this.createUI()
  }

  private createUI() {
    if (!this.scene || !this.character) return

    // 血条
    this.scene.add.image(100, 30, 'ui_health').setScrollFactor(0)
    const healthBar = this.scene.add.rectangle(
      100,
      30,
      (this.character.health / this.character.maxHealth) * 150,
      20,
      0xff0000
    ).setScrollFactor(0)

    // 蓝条
    this.scene.add.image(100, 60, 'ui_mana').setScrollFactor(0)
    const manaBar = this.scene.add.rectangle(
      100,
      60,
      (this.character.mana / this.character.maxMana) * 150,
      20,
      0x0000ff
    ).setScrollFactor(0)
  }

  private update() {
    if (!this.scene) return

    const cursors = this.scene.input.keyboard?.createCursorKeys()
    if (!cursors) return

    const player = this.scene.physics.world.bodies.getArray().find(
      (body) => body.gameObject?.name === 'player'
    )?.gameObject as Phaser.Physics.Arcade.Sprite

    if (!player) return

    const speed = 160
    player.setVelocity(0)

    if (cursors.left.isDown) {
      player.setVelocityX(-speed)
      player.anims.play('left', true)
    } else if (cursors.right.isDown) {
      player.setVelocityX(speed)
      player.anims.play('right', true)
    } else if (cursors.up.isDown) {
      player.setVelocityY(-speed)
      player.anims.play('up', true)
    } else if (cursors.down.isDown) {
      player.setVelocityY(speed)
      player.anims.play('down', true)
    } else {
      player.anims.stop()
    }

    // 更新角色位置
    if (this.character) {
      this.character.position.x = player.x
      this.character.position.y = player.y
    }
  }

  private handleResize() {
    if (this.game) {
      this.game.scale.resize(window.innerWidth, window.innerHeight)
    }
  }

  destroy() {
    if (this.game) {
      this.game.destroy(true)
      this.game = null
    }
    window.removeEventListener('resize', this.handleResize)
  }
}

export default new GameEngine()
