var canvasWidth = 500;
var canvasHeight = 720;
var enemyRadius = 50;
var fireRate = 1;
var fireRateCounter = 0;
var gravity = 10;
var enemies = [];
var bullets = [];

/* var bullet = {
  pos: { x: 5, y: canvasHeight - 5 },
  vel: { x: 0, y: 0 },
  accel: { x: 0, y: 0 },
  ang: 0,
  velAng: 0,
  accAng: 0,
  radius: 5,
  mass: 1,
  loaded: false
}; */

var cannon =
{
  pos: { x: canvasWidth / 2, y: canvasHeight },
  vel: { x: 0, y: 0 },
  accel: { x: 0, y: 0 },
  length: 50,
  ang: -90,
  velAng: 180,
  accAng: 0
};

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  angleMode(DEGREES)

  CreateEnemy({ x: width / 2, y: 0 }, { x: 0, y: 0 }, 10, 1);
  console.log(enemies);
}
//DRAW
function draw() {
  background(220);

  //Fisicas
  var dt = deltaTime / 1000;

  fireRateCounter += dt;
  //Aplicar Peso
  //ApplyForce(enemy,force = {x: 0, y:2});
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].isActive) ApplyGravity(enemies[i]);
  }
  for (var i = 0; i < bullets.length; i++) {
    if (bullets[i].isActive) ApplyGravity(bullets[i]);
  }


  //Detectar Input

  RotateCannon(dt);

  var cannonWidth = cos(cannon.ang) * cannon.length;
  var cannonHeight = sin(cannon.ang) * cannon.length;
  Shoot(cannonWidth, cannonHeight);
  //Calculo de fisicas
  for (var i = 0; i < bullets.length; i++) {
    if (bullets[i].isActive) {
      PhysicsCal(bullets[i], dt);
      ResolveCircleCollision(bullets[i]);
      CheckBounds(bullets[i]);
    }
  }


  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].isActive) {
      PhysicsCal(enemies[i], dt);
      MapBounds(enemies[i]);
    }
  }
  //console.log(cannon.ang);

  //Calculo Colisiones
  //MapBounds(enemy);
  //Dibujado
  //console.log(bullet.pos);

  for (var i = 0; i < bullets.length; i++) {
    if (bullets[i].isActive) circle(bullets[i].pos.x, bullets[i].pos.y, bullets[i].radius * 2);
  }
  //circle(enemy.pos.x,enemy.pos.y,enemy.radius * 2);
  line(cannon.pos.x, cannon.pos.y, cannon.pos.x + cannonWidth, cannon.pos.y + cannonHeight);

  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].isActive) circle(enemies[i].pos.x, enemies[i].pos.y, enemies[i].radius * 2);
  }
}

function ResolveCircleCollision(bullet) {


  for (var i = 0; i < enemies.length; i++) {
    if (!enemies[i].isActive) continue
    var dif = restar(bullet.pos, enemies[i].pos);
    var dist = magnitud(dif);
    if (dist < bullet.radius + enemies[i].radius) {
      enemies[i].isActive = false;
      bullet.isActive = false;
      console.log("Destruir enemigo");
    }
  }
}

function CreateEnemy(pos, vel, radius, mass) {
  for (var i = 0; i < enemies.length; i++) {
    if (!enemies[i].isActive) {
      enemies[i].pos = pos;
      enemies[i].vel = vel;
      enemies[i].mass = mass
      enemies[i].radius = radius;
      enemies[i].isActive = true;
      return // return enemies[i]
    }
  }
  var newEnemy = {
    pos: pos,
    vel: vel,
    accel: { x: 0, y: 0 },
    mass: mass,
    radius: radius,
    isActive: true
  }
  enemies.push(newEnemy);
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
  if (keyIsDown(32) && fireRateCounter > 1/fireRate) {
    var bullet = CreateBullet({ x: cannon.pos.x + a, y: cannon.pos.y + b })
    //bullet.loaded = true;
    var dif = restar(bullet.pos, cannon.pos);
    var dir = normalizado(dif);
    //bullet.vel.x = cannonDirX * 500;
    //bullet.vel.y = cannonDirY * 500;
    ApplyImpulse(bullet, mul(dir, 400));
    fireRateCounter = 0;
    console.log(bullets);
  }
}

function CheckBounds(object){
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

function magnitude(vector) {
  return sqrt(vector.x * vector.x + vector.y * vector.y)
}

function PhysicsCal(object, dt) {

  object.vel = sumar(object.vel, mul(object.accel, dt))

  object.pos = sumar3(object.pos, mul(object.vel, dt), mul(object.accel, dt * dt * 0.5));

  object.ax = 0;
  object.ay = 0;

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

function MapBounds(object) {
  if (object.pos.x < object.radius) {
    object.vel.x = abs(object.vel.x);
  }

  if (object.pos.x > height - object.radius) {
    object.vel.x = -abs(object.vel.x)
  }

  if (object.pos.y > height - object.radius) {
    console.log("limite inferior");
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
