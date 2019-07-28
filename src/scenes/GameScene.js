import Player from '../sprites/Player';
import Enemy from '../sprites/Enemy';

class GameScene extends Phaser.Scene {
  constructor(test) {
      super({
          key: 'GameScene'
      });
  }
  create(){


    /*==============================
    ステージの表示
    ==============================*/
    this.map = this.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('tileset', 'tiles');
    this.groundLayer = this.map.createDynamicLayer('ground', this.tileset, 0, 0);
    this.groundLayer.setCollisionBetween(0, 1);
    this.groundLayer.setCollisionByProperty({ collides: true });

    this.objectLayer = this.map.createDynamicLayer('object', this.tileset, 0, 0);
    this.objectLayer.setCollisionBetween(2, 2);
    this.objectLayer.setCollisionByProperty({ collides: true });


    /*==============================
    HPの表示
    ==============================*/

    this.hp = 100;
    this.hpMAX = 100;

    /*------------------------------
    HPの表示　アクティブ */

    let hp_bar = new Phaser.Geom.Rectangle(10, 10, 150, 1);
    this.hp_bar_graphics = this.add.graphics({ fillStyle: { color: 0xFF0000 } });
    this.hp_bar_graphics.setScrollFactor(0);
    this.hp_bar_graphics.fillRectShape(hp_bar);
    this.hp_bar_graphics.depth = 1001;

    /*------------------------------
    HPの表示　背景 */

    let hp_bar_bg = new Phaser.Geom.Rectangle(10, 10, 150, 1);
    this.hp_bar_bg_graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    this.hp_bar_bg_graphics.setScrollFactor(0);
    this.hp_bar_bg_graphics.alpha = 0.4;
    this.hp_bar_bg_graphics.fillRectShape(hp_bar_bg);
    this.hp_bar_bg_graphics.depth = 1000;


    this.player = new Player({
      scene: this,
      key: 'player',
      x: 60,
      y: 100,
      hp: this.hp,
    });

    this.enemy = new Enemy({
      scene: this,
      key: 'enemy',
      x: 100,
      y: 100
    });

    this.enemyWeaponGroup = this.add.group();

    /*==============================
    衝突判定
    ==============================*/

    this.physics.add.collider(this.player,this.groundLayer);
    this.physics.add.collider(this.enemy,this.groundLayer);
    this.physics.add.collider(this.player,this.enemy,this.enemyCollideCheck);


    this.colliderActivated = true;
    // this.physics.add.collider(this.player.weapon,this.enemy,this.hitCheck);


    /*==============================
    コントローラー
    ==============================*/
    this.circle = new Phaser.Geom.Circle(0, 0, 10);//x,y.size
    this.pointer = this.add.graphics({ fillStyle: { color: 0xFF0000 } });
    this.pointer.fillCircleShape(this.circle);
    this.pointer.setVisible(false);

    this.circle_center = new Phaser.Geom.Circle(0, 0, 4);//x,y.size
    this.pointer_center = this.add.graphics({ fillStyle: { color: 0xFF0000 } });
    this.pointer_center.fillCircleShape(this.circle_center);
    this.pointer_center.setVisible(false);

    /*==============================
    キー入力
    ==============================*/
    this.keys = {
      TOUCH_START_X: 0,
      TOUCH_START_Y: 0,
      TOUCH_MOVE_X: 0,
      TOUCH_MOVE_Y: 0,
      isTOUCH: false,
      DIRECTION_X: 0,
      DIRECTION_Y: 0,
      isRELEASE: false,
      POINTER_X: 0,
      POINTER_Y: 0,
      DIRECTION_NAME: 'LEFT'
    };

    this.input.on('pointerdown', function (pointer) {
      this.keys.TOUCH_START_X = pointer.x;
      this.keys.TOUCH_START_Y = pointer.y;
      this.keys.isTOUCH = true;
      this.keys.isRELEASE = false;
    }, this);

    this.input.on('pointerup', function (pointer) {
      this.keys.isTOUCH = false;
      this.keys.isRELEASE = true;
      this.keys.TOUCH_START_X = 0;
      this.keys.TOUCH_START_Y = 0;
      this.keys.DIRECTION_X = 0;
      this.keys.DIRECTION_Y = 0;
    }, this);



    this.input.on('pointermove', function (pointer) {
      this.keys.POINTER_X = pointer.x;
      this.keys.POINTER_Y = pointer.y;
      if(this.keys.isTOUCH == true){

        this.keys.TOUCH_MOVE_X = pointer.x - this.keys.TOUCH_START_X;
        this.keys.TOUCH_MOVE_Y = pointer.y - this.keys.TOUCH_START_Y;
        
        //右
        if(this.keys.TOUCH_MOVE_X > 20){
          this.keys.DIRECTION_X = 1;
          this.keys.DIRECTION_NAME = 'RIGHT';
        }
        //左
        if(this.keys.TOUCH_MOVE_X < -20){
          this.keys.DIRECTION_X = -1;
          this.keys.DIRECTION_NAME = 'LEFT';
        }
        if(this.keys.TOUCH_MOVE_X <= 20 && this.keys.TOUCH_MOVE_X >= -20){
          this.keys.DIRECTION_X = 0;
        }

        //下
        if(this.keys.TOUCH_MOVE_Y > 20){
          this.keys.DIRECTION_Y = 1;
          this.keys.DIRECTION_NAME = 'BOTTOM';
        }
        //上
        if(this.keys.TOUCH_MOVE_Y < -20){
          this.keys.DIRECTION_Y = -1;
          this.keys.DIRECTION_NAME = 'TOP';
        }
        if(this.keys.TOUCH_MOVE_Y <= 20 && this.keys.TOUCH_MOVE_Y >= -20){
          this.keys.DIRECTION_Y = 0;
        }
      }


    }, this);

    /*==============================
    カメラ
    ==============================*/
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);

  }

  update(time, delta) {

    this.player.update(this.keys, time, delta);

    this.enemy.update(this.keys, time, delta);

    if(this.keys.isTOUCH === true){
      this.pointer.setVisible(true);
      this.pointer_center.setVisible(true);
    }else{
      this.pointer.setVisible(false);
      this.pointer_center.setVisible(false);
    }
    this.pointer.x = this.keys.POINTER_X;
    this.pointer.y = this.keys.POINTER_Y;

    this.pointer_center.x = this.keys.TOUCH_START_X;
    this.pointer_center.y = this.keys.TOUCH_START_Y;

    // this.hp_bar_graphics.scaleX -= 0.1;
  
  }
  enemyCollideCheck(player,enemy){
    console.log("collideCheck");
    // enemy.startAttacking();

  }
  hitCheck() {
    console.log("hitCheck");
    // setting colliderActivated to false, so it will return false in the collision check 
    // and the collision no longer happens.
    this.colliderActivated = false;
  }
}

export default GameScene;
