
// https://blogs.love2d.org/content/circle-collisions
function circleResolution(circleA, circleB) {
  if (ballsColliding(circleA, circleB)) {
      // Find the new velocities
      let xVelTotal = circleA.xvel - circleB.xvel;
      let yVelTotal = circleA.yvel - circleB.yvel;

      let newVelX1 = (circleA.xvel * (circleA.mass - circleB.mass) + (2 * circleB.mass * circleB.xvel)) / (circleA.mass + circleB.mass);
      let newVelY1 = (circleA.yvel * (circleA.mass - circleB.mass) + (2 * circleB.mass * circleB.yvel)) / (circleA.mass + circleB.mass);

      let newVelX2 = xVelTotal + newVelX1;
      let newVelY2 = yVelTotal + newVelY1;

      // Move the circles so that they don't overlap
      let midpointX = (circleA.x + circleB.x) / 2;
      let midpointY = (circleA.y + circleB.y) / 2;
      let dist = Math.sqrt((circleA.x - circleB.x) ** 2 + (circleA.y - circleB.y) ** 2);

      circleA.x = midpointX + circleA.radius * (circleA.x - circleB.x) / dist;
      circleA.y = midpointY + circleA.radius * (circleA.y - circleB.y) / dist;

      circleB.x = midpointX + circleB.radius * (circleB.x - circleA.x) / dist;
      circleB.y = midpointY + circleB.radius * (circleB.y - circleA.y) / dist;

      // Update the velocities
      circleA.xvel = newVelX1;
      circleA.yvel = newVelY1;

      circleB.xvel = newVelX2;
      circleB.yvel = newVelY2;
  }
}

function ballsColliding(ball1, ball2) {
  return dist(ball1.x, ball1.y, ball2.x, ball2.y) <= ball1.radius + ball2.radius;
}



class Ball {
  constructor(
     x,
     y,
     xvel,
     yvel,
     radius,
     img=heartimg
  ) {
       this.x = x;
       this.y = y;
       this.radius = radius;
       this.xvel = xvel;
       this.yvel = yvel;
       this.ACC = 1;
       this.mass = 1;
       this.angle = 0;
       this.angularvelocity = 0;
       this.img = img;
     }
  
  update() {
    if (this.x < 0 + this.radius) {
      this.x = this.radius;
      this.xvel = abs(this.xvel) * 0.9;
      this.angularvelocity = this.yvel;
    }
    
    if (this.x > width - this.radius) {
      this.x = width - this.radius;
      this.xvel = -abs(this.xvel) * 0.9;
      this.angularvelocity = -this.yvel;
    }
    
    if(this.y > height - this.radius) {
      this.angularvelocity = this.xvel;
      this.y = height - this.radius;
      this.yvel = -abs(this.yvel) * 0.9;
      this.xvel *= 0.9;
    }
    
    if(this.y < this.radius) {
      this.y = this.radius;
      this.yvel = abs(this.yvel) * 0.9;
      this.xvel *= 0.9;
    }
    
    this.angularvelocity *= 0.99;
    this.yvel += this.ACC;
    this.x += this.xvel;
    this.y += this.yvel;
    this.angle += this.angularvelocity;
  }
  
  draw() {
    angleMode(DEGREES);
    fill("green");
    imageMode(CENTER);
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    image(this.img, 0, 0, this.radius * 2, this.radius * 2);
    pop();
  }
  
}

class MouseObj{
  constructor() {
    this.x = mouseX;
    this.y = mouseY;
    this.prevx = mouseX;
    this.prevy = mouseY;
    this.dummyball = new Ball(this.x, this.y, 0, 0, 3);
    this.dummyball.mass = 1000000;
  }
  
  getXVel() {
    return this.x - this.prevx;
  }
  
  getYVel(){
    return this.y - this.prevy;
  }
  
  isTouching(ball) {
    
    return dist(ball.x, ball.y, this.x, this.y) <= ball.radius
  }
  
  throwBall(ball) {
    if ( ! this.isTouching(ball)) { return; }
    
    this.dummyball.x = this.x;
    this.dummyball.y = this.y;
    this.xvel = this.getXVel();
    this.yvel = this.getYVel();
    
    circleResolution(this.dummyball, ball);
    ball.xvel = this.getXVel();
    ball.yvel = this.getYVel();
  }
   
  update() {
    this.prevx = this.x;
    this.prevy = this.y;
    this.x = mouseX;
    this.y = mouseY;
  }
}

class TextObj {
  constructor() {
    this.x = random(50, windowWidth-50, phrases);
    this.y = -40;
    this.killable = false;
    textSize(32);
    let choice = Math.floor(random(0, phrases.length));
    this.text = phrases[choice];
  }
  update() {
    this.y += 5;
    this.killable = this.y > height + 100;
  }

  draw() {
    fill("white");
    textAlign(CENTER, CENTER);
    text(this.text, this.x, this.y);
  }
}

let ball1;
let ball2;
let ball3;
let mouse;
let heartimg; 
let mikeimg; 
let charimg;
let t;

let visiblephrases;

function preload() {
  heartimg = loadImage('./images/heart.png');
  charimg = loadImage('./images/char.png');
  mikeimg = loadImage('./images/mike.png');
}

let phrases;

function setup() {
  ball1 = new Ball(random(0, windowWidth), random(0, windowHeight), 3, 0, 100);
  ball2 = new Ball(random(0, windowWidth), random(0, windowHeight), -3, 0, 100, mikeimg);
  ball3 = new Ball(random(0, windowWidth), random(0, windowHeight), -3, 0, 100, charimg);
  mouse = new MouseObj();
  createCanvas(windowWidth, windowHeight);
  phrases = [
    "miss her? hardly even know her",
    "missyoumissyoumissyou",
    "xorv vleep gloop vloppo glip\n👽👽👽👽👽👽",
    "RAAAAAAAAAAH",
    "❤️❤️❤️",
    "❤️‍🔥❤️‍🔥❤️‍🔥",
    "AYE BOSS, WHATS DA PLAN",
    "🦝🦝🦝",
    "🐿🐿🐿",
    "🦆🦆🦆",
    "🐈🐈🐈",
    "🐥🐥🐥",
    "💤💤💤",
    "🐊🐊🐊",
    "🐴🐴🐴",
    "🦋🦋🦋",
    "🐌🐌🐌",
    "🐌🐌🐌",
    "🐌🐌🐌",
    "🐌🐌🐌",
    "🐌🐌🐌",
    "🐜🐜🐜",
    "🦗🦗🦗",
    "🦂🦂🦂",
    "🐢🐢🐢",
    "🐍🐍🐍",
    "🦎🦎🦎",
    "🦖🦖🦖",
    "🐊🐊🐊",
    "🐠🐠🐠",
    "🐡🐡🐡",
    "🐳🐳🐳",
    "🐛🐛🐛"
    ]
  visiblephrases = [];
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background("black");

  if (random(0, 1) < 0.005) {
    visiblephrases.push(new TextObj());
  }
  for( let i = 0; i < visiblephrases.length; i++) {
    visiblephrases[i].update();
    visiblephrases[i].draw();
  }
  if (visiblephrases.length > 0 && visiblephrases[0].killable) {
    visiblephrases.shift();
  }

  mouse.update();
  mouse.throwBall(ball1);
  mouse.throwBall(ball2);
  mouse.throwBall(ball3);
  circleResolution(ball1, ball2);
  circleResolution(ball2, ball3);
  circleResolution(ball3, ball1);
  ball1.update();
  ball2.update();
  ball3.update();
  ball1.draw();
  ball2.draw();
  ball3.draw();
}