var spaceship;
var asteroids;
var atmosphereLoc;
var atmosphereSize;
var earthLoc;
var earthSize;
var starLocs = [];

var gameScore;
var timeCounter;
var levelCounter;

var spawnRate;
var roidSpeed;

//////////////////////////////////////////////////
function setup() {
  createCanvas(1200,800);
  //timer interval set to 1 second
  setInterval(timer, 1000);
  //Level difficulty interval every 20 seconds
  setInterval(increaseDifficulty, 20000);

  spaceship = new Spaceship();
  asteroids = new AsteroidSystem();

  //location and size of earth and its atmosphere
  atmosphereLoc = new createVector(width/2, height*2.9);
  atmosphereSize = new createVector(width*3, width*3);
  earthLoc = new createVector(width/2, height*3.1);
  earthSize = new createVector(width*3, width*3);

  gameScore = 0;
  timeCounter = 0;
  levelCounter = 1;

  spawnRate = 0.01;
  roidSpeed = 0.1;
}

//////////////////////////////////////////////////
function draw() {
  background(0);
  sky();

  spaceship.run();
  asteroids.run();

  displayStats();

  // score();
  // time();
  // level();

  drawEarth();

  checkCollisions(spaceship, asteroids); // function that checks collision between various elements
}

//////////////////////////////////////////////////
//draws earth and atmosphere
function drawEarth(){
  noStroke();
  //draw atmosphere
  fill(0,0,255, 50);
  ellipse(atmosphereLoc.x, atmosphereLoc.y, atmosphereSize.x,  atmosphereSize.y);
  //draw earth
  fill(100,255);
  ellipse(earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
}

//////////////////////////////////////////////////
//checks collisions between all types of bodies
function checkCollisions(spaceship, asteroids){

  var len = asteroids.locations.length;
  var asteroidsLoc = asteroids.locations;
  var asteroidsDiams = asteroids.diams;
  var shipSize = spaceship.size/2;
  var shipLoc = spaceship.location;


  //spaceship-2-asteroid collisions
    //YOUR CODE HERE (2-3 lines approx)

  for (var i = 0; i < len; i++){
    if (isInside(shipLoc, shipSize,
        asteroidsLoc[i], asteroidsDiams[i]/2) === true){
      gameOver();
    }
  }

    //asteroid-2-earth collisions
    //YOUR CODE HERE (2-3 lines approx)

  for (var i = 0; i < len; i++){
    if (isInside(asteroidsLoc[i], asteroidsDiams[i]/2,
        earthLoc, earthSize.x/2) === true){
      gameOver();
    }
  }

    //spaceship-2-earth
    //YOUR CODE HERE (1-2 lines approx)
  if (isInside(shipLoc, shipSize,
      earthLoc, earthSize.x/2) === true){
    gameOver()
  }

    //spaceship-2-atmosphere
    //YOUR CODE HERE (1-2 lines approx)

  if (isInside(shipLoc, shipSize,
      atmosphereLoc, atmosphereSize.x/2) === true){
    spaceship.setNearEarth();
  }

    //bullet collisions
    //YOUR CODE HERE (3-4 lines approx)

  for (var i = 0; i < spaceship.bulletSys.bullets.length; i++) {
    for (var j = 0; j < asteroids.locations.length; j++) {
      if (isInside(spaceship.bulletSys.bullets[i], spaceship.bulletSys.diam / 2,
          asteroidsLoc[j], asteroidsDiams[j] / 2) === true) {
        asteroids.destroy(j);
        j--;
        gameScore ++;
      }
    }
  }
}

//////////////////////////////////////////////////
//helper function checking if there's collision between object A and object B
function isInside(locA, sizeA, locB, sizeB){
    // YOUR CODE HERE (3-5 lines approx)

  if (dist(locA.x, locA.y, locB.x, locB.y) < sizeA + sizeB){
    return true;
  }
  else{
    return false;
  }
}

//////////////////////////////////////////////////
function keyPressed(){
  if (keyIsPressed && keyCode === 32){ // if spacebar is pressed, fire!
    spaceship.fire();
  }
}

//////////////////////////////////////////////////
// function that ends the game by stopping the loops and displaying "Game Over"
function gameOver(){
  fill(255);
  textSize(80);
  textAlign(CENTER);
  text("GAME OVER", width/2, height/2)
  noLoop();
}

//////////////////////////////////////////////////
// function that creates a star lit sky
function sky(){
  push();
  while (starLocs.length<300){
    starLocs.push(new createVector(random(width), random(height)));
  }
  fill(255);
  for (var i=0; i<starLocs.length; i++){
    rect(starLocs[i].x, starLocs[i].y,2,2);
  }

  if (random(1)<0.3) starLocs.splice(int(random(starLocs.length)),1);
  pop();
}

//increases the timer every second
function timer(){
  if (timeCounter >= 0)
  {
    timeCounter ++;
  }
}

//increases the asteroid spawn rate and speed and level counter every 20 seconds
function increaseDifficulty(){
  spawnRate += 0.01;
  roidSpeed += 0.1;
  levelCounter ++;
}

//draws the timer, amount of asteroids destroyed and level to screen
function displayStats(){
  fill (255);
  noStroke();
  textSize(25);
  text("Score: " + gameScore, 20, 50);
  text("Time: " + timeCounter, 20, 80);
  text("Level: " + levelCounter, width - 120, 50);
}


