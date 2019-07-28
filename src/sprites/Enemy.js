// import EnemyWeapon from './EnemyWeapon';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {

    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    console.log(config.scene);


    // this.scene = config.scene;

    this.setImmovable(true);
    this.MONSTER_SPEED = 20;
    this.WANDER_DELAY = (1000 + 1000 * Math.random());
    this.WANDER_LENGTH = (1000 + 5000 * Math.random());
    this.isWandering = false;

    this.ATTACK_CHECK = false;

    this.ATTACK_DISTANCE = this.width/2 + config.scene.player.width/2 * 2;
  
    /*==============================
    パラメータ
    ==============================*/
    this.power = 1;
    this.defense = 1;

    this.chasingPlayerTimerEvent = Phaser.Time.TimerEvent;
    this.attackingPlayerTimerEvent = Phaser.Time.TimerEvent;

    this.scene.anims.create({
      key: 'waitEnemy',
      frames: this.scene.anims.generateFrameNumbers(config.key, { start: 1, end: 1 }),
      frameRate: 10,
      repeat: -1
    });

    // this.weapon = new Weapon({
    //   scene: this.scene,
    //   key: 'weapon_sword',
    //   x: this.x,
    //   y: this.y,
    // });
    // this.weapon.setVisible(false);

    this.CHASING_DISTANCE = 40;

    this.colliderActivated = true;
    this.attackActivated = true;
    this.hitCheckDirction = "";

    this.isTouchPlayer = false;

    config.scene.physics.add.overlap(this.weapon,config.scene.player,this.hitCheck,
      function(weapon,player){
        config.scene.enemy.weaponAttack();
    },this);

    this.collidePlayerActivated = false;

    this.tween = this.scene.tweens.add({
      targets: this.weapon
    });

  }
  create(){





  }
  update(keys, time, delta) {

    if(this.collidePlayerActivated === false){
      console.log("stopAttacking");
      this.stopAttacking();
    }
    if(this.shouldAttack()){
      this.startAttacking();
    }else{
      this.collidePlayerActivated = false;
    }


    // this.handleChase();
  }
  // getOrientationFromTargettedPosition(x,y) {
  // }
  // moveTowardsPlayer() {

  //   const playerPoint = this.scene.player.getCenter();
  //   const monsterPoint = this.getCenter();
  //   const { x, y } = playerPoint.subtract(monsterPoint);

  //   this.run(x, y);
  // }
  // run(x,y) {
  //   if (x === 0 && y === 0) {
  //     return;
  //   }
  //   this.setVelocityX(Math.sign(x) * this.MONSTER_SPEED);
  //   this.setVelocityY(Math.sign(y) * this.MONSTER_SPEED);
  // }
  // stopRunning() {
  //   this.setVelocity(0);
  // }
  shouldAttack() {
    const playerPoint = this.scene.player.getCenter();
    const monsterPoint = this.getCenter();
    const distance = monsterPoint.distance(playerPoint);

    if (distance < this.ATTACK_DISTANCE) {
      return true;
    }
    return false;
  }
  // shouldChase() {
  //   const playerPoint = this.scene.player.getCenter();
  //   const monsterPoint = this.getCenter();
  //   const distance = monsterPoint.distance(playerPoint);

  //   if (distance < this.CHASING_DISTANCE) {
  //     return true;
  //   }
  //   return false;
  // }
  // startChasing() {
  //   this.chasingPlayerTimerEvent = this.scene.time.addEvent({
  //     delay: 500,
  //     callback: this.moveTowardsPlayer,
  //     callbackScope: this,
  //     repeat: Infinity,
  //     startAt: 2000,
  //   });
  // }
  // stopChasing() {
  //   this.chasingPlayerTimerEvent = null;
  // }
  // handleChase() {
  //   if (!this.chasingPlayerTimerEvent && this.shouldChase()) {
  //     this.startChasing();
  //     return;
  //   }

  //   if (this.chasingPlayerTimerEvent && !this.shouldChase()) {
  //     this.stopChasing();
  //   }

  //   if (!this.shouldChase()) {
  //     this.wanderAround();
  //   }
  // }
  // wanderAround() {

  //   const direction = this.getRandomDirection();
  //   this.run(direction.x, direction.y);
  //   const WANDER_LENGTH = this.WANDER_LENGTH;
  //   const WANDER_DELAY = this.WANDER_DELAY;
  //   const isWandering = this.isWandering;

  //   this.scene.time.addEvent({
  //     delay: WANDER_LENGTH,
  //     callbackScope: this,
  //     callback: () => {
  //       this.stopRunning();

  //       this.scene.time.addEvent({
  //         delay: WANDER_DELAY,
  //         callbackScope: this,
  //         callback: () => {
  //         },
  //       });
  //     },
  //   });
  // }
  // getRandomDirection() {
  //   const randomBetweenMinusOneAndOne = () => Math.round(2 * Math.random()) - 1;
  //   const x = randomBetweenMinusOneAndOne();
  //   const y = randomBetweenMinusOneAndOne();

  //   return { x, y };
  // }
  hitCheck(){
    this.isTouchPlayer = true;
  }

  startAttacking() {

    if(this.collidePlayerActivated === true){
      return false;
    }

    this.collidePlayerActivated = true;

    this.setVelocityX(0);
    this.setVelocityY(0);

    this.chasingPlayerTimerEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: this.attackPlayer,
      callbackScope: this,
      repeat: Infinity,
      // startAt: 1000,
    });

    this.tween.stop();

  }
  stopAttacking() {
    this.chasingPlayerTimerEvent = null;
  }

  weaponAttack(){

    // console.log("weaponAttack");

    if (!this.scene.player.canGetHit()) {
      return;
    }
    this.scene.player.loseHp();

  }
  damage(){
    console.log("enemy damage");
  }
  attackPlayer(){

    // var weapon = new EnemyWeapon({
    //   scene: this.scene,
    //   key: 'weapon',
    //   x: this.x,
    //   y: this.y,
    //   parent: this,
    //   target: this.scene.player
    // }); 
    // this.scene.enemyWeaponGroup.add(weapon);     


    // this.tween = this.scene.tweens.add({
    //   targets: _weapon,
    //   x: weapon_x,
    //   y: weapon_y,
    //   // delay: 0,
    //   duration: 400,
    //   loop: 0,
    //   ease: 'Power2',
    //   // repeat: 0, 
    //   // // angle: weapon_angle,
    //   // // loop: 0,
    //   // completeDelay: 0,
    //   onComplete: onCompleteHandler,
    //   // onCompleteParams: [ _weapon ]
    //   // onComplete: function () {
    //   //   _weapon.setVisible(false); 
    //   //   _weapon.x = _monster.x;
    //   //   _weapon.y = _monster.y;
    //   //   console.log(tween);
    //   //   this.stopWeapon();
    //     // this.ATTACK_CHECK = false;
    //   // },
    // });
    // function onCompleteHandler(tween, targets, myImage){
    //   // console.log(tween);
    //   targets.x = this.x;
    //   targets.y = this.y;
    //   tween.stop();
    // }


  }

}