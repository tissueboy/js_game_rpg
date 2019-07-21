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


    /*==============================
    パラメータ
    ==============================*/
    this.power = 1;
    this.defense = 1;

    this.chasingPlayerTimerEvent = Phaser.Time.TimerEvent;

    this.scene.anims.create({
      key: 'waitEnemy',
      frames: this.scene.anims.generateFrameNumbers(config.key, { start: 1, end: 1 }),
      frameRate: 10,
      repeat: -1
    });

    this.CHASING_DISTANCE = 40;

    this.colliderActivated = true;
    this.hitCheckDirction = "";

    config.scene.physics.add.collider(this,config.scene.player,this.hitCheck,
      function(enemy,player){
        if(this.colliderActivated){
          return this.colliderActivated;
        }
        config.scene.enemy.Attack(enemy,player,this.hitCheckDirction);
      },this
    );
  }
  create(){

  }
  update(keys, time, delta) {
    this.handleChase();
  }
  getOrientationFromTargettedPosition(x,y) {
    // if (Math.abs(y) > Math.abs(x)) {
    //   return y < 0 ? Orientation.Up : Orientation.Down;
    // }

    // return x < 0 ? Orientation.Left : Orientation.Right;
  }
  moveTowardsPlayer() {
    // if (!this.active) {
    //   return;
    // }

    const playerPoint = this.scene.player.getCenter();
    const monsterPoint = this.getCenter();
    const { x, y } = playerPoint.subtract(monsterPoint);

    this.run(x, y);
  }
  run(x,y) {
    // console.log("x/"+x+"..y/"+y);
    if (x === 0 && y === 0) {
      return;
    }
    // if (!this.active) {
    //   return;
    // }


    this.setVelocityX(Math.sign(x) * this.MONSTER_SPEED);
    this.setVelocityY(Math.sign(y) * this.MONSTER_SPEED);

    // const orientation = this.getOrientationFromTargettedPosition(x, y);

    // this.animate(this.WALK_ANIMATION, orientation);
  }
  stopRunning() {
    // if (!this.active) {
    //   return;
    // }

    this.setVelocity(0);
    // this.beIdle();
  }
  shouldChase() {
    const playerPoint = this.scene.player.getCenter();
    const monsterPoint = this.getCenter();
    const distance = monsterPoint.distance(playerPoint);

    if (distance < this.CHASING_DISTANCE) {
      return true;
    }
    return false;
  }
  startChasing() {
    this.chasingPlayerTimerEvent = this.scene.time.addEvent({
      delay: 500,
      callback: this.moveTowardsPlayer,
      callbackScope: this,
      repeat: Infinity,
      startAt: 2000,
    });
  }
  stopChasing() {
    // if (this.active) {
    //   this.stopRunning();
    // }
    // this.chasingPlayerTimerEvent.destroy();
    this.chasingPlayerTimerEvent = null;
  }
  handleChase() {
    if (!this.chasingPlayerTimerEvent && this.shouldChase()) {
      this.startChasing();
      return;
    }

    if (this.chasingPlayerTimerEvent && !this.shouldChase()) {
      this.stopChasing();
    }

    if (!this.shouldChase()) {
      this.wanderAround();
    }
  }
  wanderAround() {

    const direction = this.getRandomDirection();
    this.run(direction.x, direction.y);
    const WANDER_LENGTH = this.WANDER_LENGTH;
    const WANDER_DELAY = this.WANDER_DELAY;
    const isWandering = this.isWandering;

    this.scene.time.addEvent({
      delay: WANDER_LENGTH,
      callbackScope: this,
      callback: () => {
        this.stopRunning();

        // if (!this.active) {
        //   return;
        // }

        this.scene.time.addEvent({
          delay: WANDER_DELAY,
          callbackScope: this,
          callback: () => {
            // this.isWandering = false;
          },
        });
      },
    });
  }
  getRandomDirection() {
    const randomBetweenMinusOneAndOne = () => Math.round(2 * Math.random()) - 1;
    const x = randomBetweenMinusOneAndOne();
    const y = randomBetweenMinusOneAndOne();

    return { x, y };
  }

  Attack(_target,_opponent,_direction){
    var target_x = 0;
    var target_y = 0;
    var _x = _target.x;
    var _y = _target.y;
    var ATTACK_VECTOR = 20;
    switch( _direction ) {
      case 'UP':
        // _target.angle = 0;
        target_x = _x;
        target_y = _y - ATTACK_VECTOR;
        break;
      case 'LEFT':
        // _target.angle = 270;
        target_x = _x - ATTACK_VECTOR;
        target_y = _y;
        break;
      case 'RIGHT':
        // _target.angle = 90;
        target_x = _x + ATTACK_VECTOR;
        target_y = _y;
        break;
      case 'DOWN':
        // _target.angle = 180;
        target_x = _x;
        target_y = _y + ATTACK_VECTOR;
        break;
    }
    function onCom(){
      // _target.setVisible(false); 
    }
    _target.colliderActivated = true;
    // let scene = this.scene;
    var tween = this.scene.tweens.add({
      targets: _target,
      x: target_x,
      y: target_y,
      duration: 120,
      delay: 600,//衝突してから攻撃してくる時間
      // angle: target_angle,
      loop: 0,
      completeDelay: 160,//次の攻撃までの
      onComplete: function () {
        onCom();
        console.log("tween");
        _target.Damage(_target,_opponent);
        // 
        // this.stop();
      },
    });
  }
  Damage(_target,_opponent){


    console.log("Damage");

    var hp_subtract = Number(_target.power - _opponent.defense);

    this.scene.hp = this.scene.hp - hp_subtract;

    this.scene.hp_bar_graphics.scaleX = this.scene.hp / this.scene.hpMAX;

    if((this.scene.hp / this.scene.hpMAX) < 0){
      console.log("die");
    }

  }
  hitCheck() {
    // setting colliderActivated to false, so it will return false in the collision check 
    // and the collision no longer happens.

    this.colliderActivated = false;
    
    
    let direction = "";

    let enemy = this.scene.enemy;


    if(enemy.body.touching.up){
      direction = "UP";
    }
    if(enemy.body.touching.left){
      direction = "LEFT";
    }
    if(enemy.body.touching.right){
      direction = "RIGHT";
    }
    if(enemy.body.touching.down){
      direction = "DOWN";
    }
    this.hitCheckDirction = direction;


  }
}