var canvasWidth = 500;
var canvasHeight = 720;

var gravity = 200;
var target = 
{
  x:canvasWidth/2, y:0,
  vx: 0, vy: 0,
  ax: 0, ay: 0,
  mass: 1,
  radius: 30
}

var cannon = 
{
  x: canvasWidth/2, y: canvasHeight,
  angle: -90,
  length: 50,
  angVel: 180,
};

function setup() {
  createCanvas(canvasWidth,canvasHeight);
  angleMode(DEGREES)
}

function draw() {
  background(220);

  //Fisicas
  var dt = deltaTime / 1000;
//Aplicar Peso
  ApplyForce(target,0,gravity * target.mass);


//Detectar Input

  if (keyIsDown(RIGHT_ARROW)) cannon.angle += cannon.angVel * dt;
  if (keyIsDown(LEFT_ARROW)) cannon.angle -= cannon.angVel * dt;

  var cannonWidth = cos (cannon.angle) * cannon.length;
  var cannonHeight = sin(cannon.angle) * cannon.length;


  //Calculo de fisicas
  PhysicsCal(target, dt);
  console.log(cannon.angle);
  //Dibujado
  circle(target.x,target.y,target.radius * 2)
  line(cannon.x, cannon.y, cannon.x + cannonWidth, cannon.y + cannonHeight);
}

function PhysicsCal(object,dt) {
  object.vx += object.ax * dt;
  object.vy += object.ay * dt;
  object.x += object.vx * dt;
  object.y += object.vy * dt;

  object.ax = 0;
  object.ay = 0;
}

function ApplyForce(object, fx, fy)
{
  object.ax += fx /  object.mass;
  object.ay += fy /  object.mass;
}
