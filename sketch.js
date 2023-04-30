var canvasWidth = 500;
var canvasHeight = 720;

var gravity = 200;
var enemy = 
{
  pos: {x: canvasWidth/2, y:0},
  vel: {x: 0, y: 0},
  accel: {x: 0, y: 0},
  mass: 1,
  radius: 30
}

var bullet = {
  pos: {x: 5, y: canvasHeight - 5},
  vel: {x: 0, y: 0},
  accel: {x: 0, y: 0},
  ang: 0,
  velAng: 0,
  accAng: 0,
  radius: 5,
}

var cannon = 
{
  pos: {x: canvasWidth/2, y: canvasHeight},
  vel: {x: 0, y: 0},
  accel: {x: 0, y: 0},
  length: 50,
  ang: -90,
  velAng: 180,
  accAng: 0
};

function setup() {
  createCanvas(canvasWidth,canvasHeight);
  angleMode(DEGREES)
}
//DRAW
function draw() {
  background(220);

  //Fisicas
  var dt = deltaTime / 1000;
  //Aplicar Peso
  ApplyForce(enemy,force = {x: 0, y:2});


  //Detectar Input

  RotateCannon(dt);

var cannonWidth = cos(cannon.ang) * cannon.length;
var cannonHeight = sin(cannon.ang) * cannon.length;
  Shoot(cannonWidth,cannonHeight);
  //Calculo de fisicas
  PhysicsCal(enemy, dt);
  PhysicsCal(bullet,dt);
  console.log(cannon.ang);

  //Calculo Colisiones
  MapBounds(enemy);
  //Dibujado
  circle(bullet.pos.x,bullet.pos.y, bullet.radius * 2);
  circle(enemy.pos.x,enemy.pos.y,enemy.radius * 2);
  line(cannon.pos.x, cannon.pos.y, cannon.pos.x + cannonWidth, cannon.pos.y + cannonHeight);
}

function RotateCannon(dt) {
  if (keyIsDown(RIGHT_ARROW))
    cannon.ang += cannon.velAng * dt;
  if (keyIsDown(LEFT_ARROW))
    cannon.ang -= cannon.velAng * dt;
}

function Shoot(a,b) {
  if (keyIsDown(32)){
    bullet.pos.x = cannon.pos.x + a;
    bullet.pos.y = cannon.pos.y + b;

    cannonDirX = cos(cannon.ang);
    cannonDirY = sin(cannon.ang);
    bullet.vel.x = cannonDirX * 500;
    bullet.vel.y = cannonDirY * 500;
  }
  
}

function magnitude(vector) {
  return sqrt(vector.x * vector.x + vector.y * vector.y)
}

function PhysicsCal(object,dt) {
  
  object.vel = sumar(object.vel, mul(object.accel, dt))
  
  object.pos = sumar3(object.pos, mul(object.vel,dt), mul(object.accel, dt * dt * 0.5));

  object.ax = 0;
  object.ay = 0;

  object.velAng += object.accAng * dt;
  object.ang += object.velAng * dt;

  object.accAng = 0;
  
}

function ApplyForce(object, force)
{
  object.accel = sumar(object.accel, division(force, object.mass));
}

function ApplyImpulse(cuerpo, impulso) {
  cuerpo.vel = sumar(cuerpo.vel,division(impulso, cuerpo.masa))
}

function MapBounds(object) {
  if (object.x < object.radius) {
    object.vx = abs(object.vx);
  }
  
  if (object.x > height - object.radius) {
    object.vx = -abs(object.vx)
  }
  
  if (object.y > height - object.radius) {
    object.vy = 0;
    object.y = height - object.radius;
  }
}

//Propiedades vectores
function sumar(vector1, vector2){
  var resultado = {
  x:vector1.x +vector2.x,
  y:vector1.y +vector2.y
  }
  return resultado
}
 
function sumar3(vector1, vector2, vector3){
  var resultado = {
  x:vector1.x +vector2.x+vector3.x,
  y:vector1.y +vector2.y+vector3.y,
  }
  return resultado
}

function restar(vector1, vector2){
  var resultado = {
  x:vector1.x - vector2.x,
  y:vector1.y - vector2.y
  }
  return resultado
}

function mul(vector, escalar){
  var resultado = {
  x:vector.x * escalar,
  y:vector.y * escalar  
  }
  return resultado
}
 
function division(vector, escalar){
  var resultado = {
  x:vector.x /escalar,
  y:vector.y /escalar  
  }
  return resultado
}
 

function magnitud(vector) {
  return sqrt(vector.x*vector.x + vector.y*vector.y)
}

function normalizado(vector) {
  var magni = magnitud(vector)
  var resultado = {
    x: vector.x / magni,
    y: vector.y / magni
  }
  return resultado
}
