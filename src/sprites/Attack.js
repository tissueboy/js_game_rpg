export default class Attack extends Phaser.GameObjects.Sprite {
  constructor(config) {

    super(config.scene, config.x, config.y, config.key,config.hp);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

  }

  create(){
  }

  update(keys, time, delta) {



  }

}
