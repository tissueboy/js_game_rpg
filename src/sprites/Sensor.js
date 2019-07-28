export default class Sensor extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {

    super(config.scene);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);


    
  }
  create(){
  }
  update(keys, time, delta) {
  }
}