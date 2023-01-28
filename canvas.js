window.onload = function() {

var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function Rocket() {
  this.radius = 3;
  this.x = randomIntFromRange(50,canvas.width-50);
  this.y = canvas.height-100;
  this.dx = randomIntFromRange(-1,1);
  this.dy = randomIntFromRange(8,12); // moyen de faire mieux
  this.timeToExplode = randomIntFromRange(this.dy*3,this.dy*6);
  this.color = colors[Math.floor(Math.random()*colors.length)];

  this.update = function() {
    this.x += this.dx;
    this.y += -this.dy;
    this.timeToExplode--;

    if(this.timeToExplode == 0) {
      explosions.push(new Explosion(this));
    }

    this.draw();
  }

  this.draw = function() {
    c.fillStyle = 'rgb('+this.color[0]+','+this.color[1]+','+this.color[2]+')';
    //c.fillStyle = 'rgb(153, 0, 0)';
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.fill();
  }
}

function Particle(x,y,color) {
  this.radius = 2;
  this.x = x;
  this.y = y;
  this.angle = randomIntFromRange(0,360);
  this.dx = randomIntFromRange(-3,3)*Math.cos(this.angle);
  this.dy = randomIntFromRange(-3,3)*Math.sin(this.angle);
  this.timeToLive = 0.5 ;
  this.opacity = 1;
  this.color = color;

  this.update = function() {
    this.x += this.dx;
    this.y += this.dy;

    this.draw();

    this.timeToLive -= 0.01;
    this.opacity -= 1 / (this.timeToLive / 0.01);
  }

  this.draw = function() {
    c.fillStyle = 'rgba('+this.color[0]+','+this.color[1]+','+this.color[2]+','+this.opacity+')';
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.fill();
  }
}

function Explosion(rocket) {
  this.particles = [];

  this.init = function(parent) {
    for(var i = 0; i < 30; i++) {
      this.particles.push(new Particle(parent.x,parent.y,parent.color));
    }
  }
  this.init(rocket);

  this.update = function() {
    for(var i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      if(this.particles[i].timeToLive <= 0) {
        this.particles.splice(i,1);
      }
    }
  }
}

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

function createMountainRange(mountainAmount, height,  color) {
  for (var i = 0; i < mountainAmount; i++) {
    var mountainWidth = canvas.width / mountainAmount;

    // Draw triangle
    c.beginPath();
    c.moveTo(i * mountainWidth, canvas.height);
    c.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height);

    // Triangle peak
    c.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height);
    c.lineTo(i * mountainWidth - 325, canvas.height);
    c.fillStyle = color;
    c.fill();
    c.closePath();
  }
}

function MiniStar() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.radius = Math.random() * 3;

  this.draw = function() {
    c.save();
    c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

      c.shadowColor = '#E3EAEF';
    c.shadowBlur = (Math.random() * 10) + 10;
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;

      c.fillStyle = "white";
      c.fill();

      c.closePath();
      c.restore();
  }
}

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

var timer = 0;
var randomSpawnRate = 10;
var rockets = [];
var explosions = [];

//var colors = ["purple","blue","green","yellow","orange","red","white","grey"];
var colors = [
  [151,39,179],
  [39,67,179],
  [67,179,39],
  [229,238,56],
  [238,123,56],
  [208,10,37],
  [255,255,255],
  [143,131,133]
];

var groundHeight = canvas.height * 0.15;
var backgroundGradient = c.createLinearGradient(0,0,0, canvas.height);
backgroundGradient.addColorStop(0,"#171e26");
backgroundGradient.addColorStop(1,"#3f586b");
var miniStars = [];
for (var i = 0; i < 150; i++) {
  miniStars.push(new MiniStar());
}

/////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = backgroundGradient;
  c.fillRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < miniStars.length; i++) {
    miniStars[i].draw();
  }
  createMountainRange(1, canvas.height - 50, "#384551");
  createMountainRange(2, canvas.height - 100,  "#2B3843");
  createMountainRange(3, canvas.height - 300 , "#26333E");

  c.fillStyle = "#182028";
  c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

  timer++;

  for(var i = 0; i < rockets.length; i++) {
    rockets[i].update();
    if(rockets[i].timeToExplode <= 0) {
      rockets.splice(i,1);
    }
  }

  for(var i = 0; i < explosions.length; i++) {
    explosions[i].update();
    if (explosions[i].particles.length <= 0) {
      explosions.splice(i, 1);
    }
  }

  timer ++;
  if (timer % randomSpawnRate == 0) {
    rockets.push(new Rocket());
    randomSpawnRate = Math.floor((Math.random() * 10) + 10);
  }
}
animate();

}























////
