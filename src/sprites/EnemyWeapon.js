export default class EnemyWeapon extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {

    super(
      config.scene,
      config.key,
      config.x,
      config.y,
      config.parent,
      config.target
    );

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    // this.parent = config.parent;
    // this.target = config.target;

    // // this.setImmovable(true); 

    // let _monster = this.parent;
    // let _weapon = this;
    // let _player = this.target;
    // _weapon.x = _monster.x;
    // _weapon.y = _monster.y;
    // _weapon.setVisible(true);
    // var _x = _monster.x;
    // var _y = _monster.y;
    // var weapon_x = _x;
    // var weapon_y = _y;
    // var weapon_angle = 0;
    // var distance_x = _monster.x - _player.x; 
    // var distance_y = _monster.y - _player.y; 

    // var radian = Math.atan2( _player.y - _monster.y, _player.x - _monster.x ) ;
    // var degree = radian /(Math.PI / 180);

    // if(-45 <= degree && degree < 45 ){ //右
    //   console.log("右");
    //   _weapon.angle = 90;
    //   weapon_x = _x + 16;
    //   weapon_y = _y;
    // }else if(45 <= degree && degree < 135 ){ //下
    //   console.log("下");
    //   _weapon.angle = 180;
    //   weapon_x = _x;
    //   weapon_y = _y + 16;
    // }else if(135 <= degree || degree < -135 ){ //左
    //   console.log("左");
    //   _weapon.angle = 270;
    //   weapon_x = _x - 16;
    //   weapon_y = _y;
    // }else if(-135 <= degree && degree < -45 ){ //上
    //   console.log("上");
    //   _weapon.angle = 0;
    //   weapon_x = _x;
    //   weapon_y = _y - 16;
    // }

    // var weapon = new Weapon({
    //   scene: this.scene,
    //   key: 'weapon',
    //   x: this.x,
    //   y: this.y,
    //   target: this.scene.player
    // });   

  }

  create(){
  }

  update(keys, time, delta) {


  }

}
