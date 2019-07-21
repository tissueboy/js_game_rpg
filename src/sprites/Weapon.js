export default class Weapon extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {

    super(config.scene, config.x, config.y, config.key);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.setImmovable(true); 
  }

  create(){
  }

  update(keys, time, delta) {


  }
}
