import Weapon from './Weapon';
import Damage from './Damage';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {

    super(config.scene, config.x, config.y, config.key,config.hp);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    // console.log(this.scene);

    /*==============================
    パラメータ
    ==============================*/
    this.power = 20;
    this.defense = 0;
    
    this.hp = config.hp;

    this.scene.anims.create({
      key: 'waitAnime',
      frames: this.scene.anims.generateFrameNumbers(config.key, { start: 1, end: 1 }),
      frameRate: 10,
      repeat: -1
    });

    this.weapon = new Weapon({
      scene: this.scene,
      key: 'weapon_sword',
      x: this.x+40,
      y: this.y+40,
    });
    this.weapon.setVisible(false);

    this.damage = new Damage({
      scene: this.scene,
    });
    // console.log(this.weapon);
    // config.scene.physics.add.collider(this.weapon,config.scene.enemy,function(){
    //   console.log("attacl");
    // });
  }

  create(){
    // console.log(this.weapon);
    // this.physics.add.collider(this.weapon,this.scene.enemy,function(){
    //   console.log("attacl");
    // });
  }

  update(keys, time, delta) {



    this.anims.play('waitAnime', true);

    this.setVelocityX(keys.DIRECTION_X*50);
    this.setVelocityY(keys.DIRECTION_Y*50);
    // this.y += keys.DIRECTION_Y;

    if(keys.isRELEASE === true){
      this.weapon.setVisible(true);
      this.weapon.x = this.x;
      this.weapon.y = this.y;
      this.weaponMove(keys.DIRECTION_NAME,this.weapon,this.x,this.y)

      keys.isRELEASE = false;
    }
    if(keys.isTOUCH === true){
      this.weapon.x = this.x;
      this.weapon.y = this.y;      
    }

  }
  weaponMove(_direction,_target,_x,_y){
    var target_x = 0;
    var target_y = 0;
    var target_angle = 0;
    switch( _direction ) {
      case 'TOP':
        _target.angle = 0;
        target_x = _x;
        target_y = _y - 16;
        break;
      case 'LEFT':
        _target.angle = 270;
        target_x = _x - 16;
        target_y = _y;
        break;
      case 'RIGHT':
        _target.angle = 90;
        target_x = _x + 16;
        target_y = _y;
        break;
      case 'BOTTOM':
        _target.angle = 180;
        target_x = _x;
        target_y = _y + 16;
        break;
    }
    function onCom(){
      _target.setVisible(false);      
    }
    var tween = this.scene.tweens.add({
      targets: _target,
      x: target_x,
      y: target_y,
      duration: 120,
      // angle: target_angle,
      loop: 0,
      completeDelay: 160,
      onComplete: function () {
        onCom();
      },
    });

  }
  collide_p(){
    console.log("collide");
  }
}
