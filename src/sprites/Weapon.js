export default class Weapon extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {

    super(
      config.scene,
      config.key,
      config.x,
      config.y
    );

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);



  }

  create(){
  }

  update(keys, time, delta) {


  }

}
