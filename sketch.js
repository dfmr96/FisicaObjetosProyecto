var canvasWidth = 500;
var canvasHeight = 720;
var enemyRadius = 50;
var fireRate = 2;
var fireRateCounter = 0;
var enemySpawnRate = 0.5;
var enemySpawnCounter = 0;
var gravity = 10;
var enemies = [];
var bullets = [];
var points = 0;
var lives = 3;
var blinkTimer = 0;
var blinkRate = 0.5;
var blankString = false;
var pressStartText = "";

var cannon =
{
  pos: { x: canvasWidth / 2, y: canvasHeight },
  vel: { x: 0, y: 0 },
  accel: { x: 0, y: 0 },
  length: 50,
  ang: -90,
  velAng: 60,
  accAng: 0
};

var _state;
const State = {
  PressStart: 0,
  Gameplay: 1,
  GameOver: 2,
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  angleMode(DEGREES)
  _state = State.PressStart;
}

function draw() {
  background(220);
  var dt = deltaTime / 1000;

  switch (_state) {
    case State.PressStart:
      blinkTimer += dt;
      PressStartBlinker();
      DrawMainScreen();
      if (keyIsDown(ENTER)) _state = State.Gameplay;
      break;

    case State.Gameplay:
      //Counters
      fireRateCounter += dt;
      enemySpawnCounter += dt;

      //Spawner
      EnemySpawner();

      //Gravity
      ApplyGravityToAllBodies();

      //Input Detection
      RotateCannon(dt);
      var cannonWidth = cos(cannon.ang) * cannon.length;
      var cannonHeight = sin(cannon.ang) * cannon.length;
      Shoot(cannonWidth, cannonHeight);

      //Physics Calc
      PhysicsCalToAllBodies(dt);

      //DRAW
      DrawUI();
      DrawBullets();
      DrawLaser(cannonWidth, cannonHeight);
      DrawCannon(cannonWidth, cannonHeight);
      DrawEnemies();
      break;

    case State.GameOver:
      DrawGameOverUI();
      break;
  }
}

function DrawGameOverUI() {
  textAlign(CENTER);
  textSize(58);
  text("GAME OVER", width / 2, height / 4);
  textSize(48);
  text("Total Points: " + points, width / 2, height * 3 / 4);
}

function PhysicsCalToAllBodies(dt) {
  for (var i = 0; i < bullets.length; i++) {
    if (bullets[i].isActive) {
      PhysicsCal(bullets[i], dt);
      ResolveCircleCollision(bullets[i]);
      CheckOffBounds(bullets[i]);
    }
  }

  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].isActive) {
      PhysicsCal(enemies[i], dt);
      CheckEnemyOffBounds(enemies[i]);
    }
  }
}

function ApplyGravityToAllBodies() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].isActive) ApplyGravity(enemies[i]);
  }
  for (var i = 0; i < bullets.length; i++) {
    if (bullets[i].isActive) ApplyGravity(bullets[i]);
  }
}

function EnemySpawner() {
  if (enemySpawnCounter > 1 / enemySpawnRate) {
    CreateEnemy(RandomPos(), random(15, 30), random(10, 20), random(0, 250));
    //console.log(enemies);
  }
}

function DrawMainScreen() {
  textAlign(CENTER);
  textSize(58);
  text("Cannon Defender", width / 2, height / 4);
  textSize(48);
  text(pressStartText, width / 2, height * 3 / 4);
}

function PressStartBlinker() {
  if (blinkTimer > blinkRate) {
    blankString = !blankString;
    blinkTimer = 0;
  }

  if (blankString) {
    pressStartText = ""
  } else {
    pressStartText = "Press Start"
  }
}
function DrawUI() {
  textAlign(LEFT, BOTTOM);
  textSize(15);
  text("Lives " + lives, 0, height)
  text("Points: " + points, 0, height - 20);
}

function DrawBullets() {
  strokeWeight(1);
  for (var i = 0; i < bullets.length; i++) {
    if (bullets[i].isActive) circle(bullets[i].pos.x, bullets[i].pos.y, bullets[i].radius * 2);
  }
}
function DrawEnemies() {
  strokeWeight(1);
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].isActive) circle(enemies[i].pos.x, enemies[i].pos.y, enemies[i].radius * 2);
  }
}

function DrawCannon(cannonWidth, cannonHeight) {
  strokeWeight(20);
  stroke(0, 0, 0);
  line(cannon.pos.x, cannon.pos.y, cannon.pos.x + cannonWidth, cannon.pos.y + cannonHeight);
}

function DrawLaser(cannonWidth, cannonHeight) {
  strokeWeight(1);
  stroke(255, 0, 0);
  line(cannon.pos.x, cannon.pos.y, cannon.pos.x + cannonWidth * 100, cannon.pos.y + cannonHeight * 100);
}

function RandomPos() {
  var offSet = 20;
  var randomPos = { x: random(offSet, width - offSet), y: -offSet }
  return randomPos;
}

function ResolveCircleCollision(bullet) {

  for (var i = 0; i < enemies.length; i++) {
    if (!enemies[i].isActive) continue
    var dif = restar(bullet.pos, enemies[i].pos);
    var dist = magnitud(dif);
    if (dist < bullet.radius + enemies[i].radius) {
      enemies[i].isActive = false;
      bullet.isActive = false;
      points++;
    }
  }
}

function CreateEnemy(pos, radius, mass, velY) {
  enemySpawnCounter = 0;
  for (var i = 0; i < enemies.length; i++) {
    if (!enemies[i].isActive) {
      enemies[i].pos = pos;
      enemies[i].vel = { x: 0, y: velY };
      enemies[i].mass = mass
      enemies[i].radius = radius;
      enemies[i].isActive = true;

      return // return enemies[i]
    }
  }
  var newEnemy = {
    pos: pos,
    vel: { x: 0, y: velY },
    accel: { x: 0, y: 0 },
    mass: mass,
    radius: radius,
    isActive: true
  }
  enemies.push(newEnemy);
  return newEnemy;
}

function CreateBullet(pos) {
  for (var i = 0; i < bullets.length; i++) {
    if (!bullets[i].isActive) {
      bullets[i].pos = pos;
      bullets[i].vel = { x: 0, y: 0 };
      bullets[i].accel = { x: 0, y: 0 };
      bullets[i].mass = 1;
      bullets[i].radius = 5;
      bullets[i].isLoaded = false;
      bullets[i].isActive = true;
      return bullets[i];
    }
  }
  var newBullet = {
    pos: pos,
    vel: { x: 0, y: 0 },
    accel: { x: 0, y: 0 },
    ang: 0,
    velAng: 0,
    accAng: 0,
    radius: 5,
    mass: 1,
    isLoaded: false,
    isActive: true
  }
  bullets.push(newBullet);
  return newBullet;
}
function RotateCannon(dt) {
  if (keyIsDown(RIGHT_ARROW))
    cannon.ang += cannon.velAng * dt;
  if (keyIsDown(LEFT_ARROW))
    cannon.ang -= cannon.velAng * dt;
}

function Shoot(a, b) {
  if (keyIsDown(32) && fireRateCounter > 1 / fireRate) {
    var bullet = CreateBullet({ x: cannon.pos.x + a, y: cannon.pos.y + b })
    var dif = restar(bullet.pos, cannon.pos);
    var dir = normalizado(dif);
    ApplyImpulse(bullet, mul(dir, 400));
    fireRateCounter = 0;
    console.log(bullets);
  }
}

function CheckOffBounds(object) {
  if (object.pos.x > width - object.radius) {
    object.isActive = false;
  }
  if (object.pos.x < object.radius) {
    object.isActive = false;
  }
  if (object.pos.y < - object.radius) {
    object.isActive = false;
  }
  if (object.pos.y > height + object.radius) {
    object.isActive = false;
  }
}

function PhysicsCal(object, dt) {

  object.vel = sumar(object.vel, mul(object.accel, dt))
  object.pos = sumar3(object.pos, mul(object.vel, dt), mul(object.accel, dt * dt * 0.5));

  object.accel.x = 0;
  object.accel.y = 0;

  object.velAng += object.accAng * dt;
  object.ang += object.velAng * dt;
  object.accAng = 0;
}

function ApplyForce(object, force) {
  object.accel = sumar(object.accel, division(force, object.mass));
}

function ApplyGravity(object) {
  object.accel.y = object.mass * gravity;
}

function ApplyImpulse(object, impulse) {
  object.vel = sumar(object.vel, division(impulse, object.mass))
}

function CheckEnemyOffBounds(object) {
  if (object.pos.y > height + object.radius) {
    object.isActive = false;
    lives--;
    if (lives <= 0) {
      _state = State.GameOver;
      console.log("GAMEOVER");
    }
    //console.log(enemies);
  }
  if (object.pos.x < object.radius) {
    object.vel.x = abs(object.vel.x);
  }
  if (object.pos.x > height - object.radius) {
    object.vel.x = -abs(object.vel.x)
  }
  if (object.pos.y > height - object.radius) {
    //console.log("limite inferior");
    object.accel.y = 0;
    object.vel.y = 0;
    object.vel.y = height - object.radius;
  }
}

//Propiedades vectores
function sumar(vector1, vector2) {
  var resultado = {
    x: vector1.x + vector2.x,
    y: vector1.y + vector2.y
  }
  return resultado
}

function sumar3(vector1, vector2, vector3) {
  var resultado = {
    x: vector1.x + vector2.x + vector3.x,
    y: vector1.y + vector2.y + vector3.y,
  }
  return resultado
}

function restar(vector1, vector2) {
  var resultado = {
    x: vector1.x - vector2.x,
    y: vector1.y - vector2.y
  }
  return resultado
}

function mul(vector, escalar) {
  var resultado = {
    x: vector.x * escalar,
    y: vector.y * escalar
  }
  return resultado
}

function division(vector, escalar) {
  var resultado = {
    x: vector.x / escalar,
    y: vector.y / escalar
  }
  return resultado
}


function magnitud(vector) {
  return sqrt(vector.x * vector.x + vector.y * vector.y)
}

function normalizado(vector) {
  var magni = magnitud(vector)
  var resultado = {
    x: vector.x / magni,
    y: vector.y / magni
  }
  return resultado
}
