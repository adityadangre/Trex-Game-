var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var reset,reset_img,gameOver;

var gameOver,gameOver_img;

var PLAY=0;
var END=1;
var gameState=PLAY;
var bgImage,bg,bgsky;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  bgImage=loadImage("bg.png");
  bgsky=loadImage("bgdown.png");

  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOver_img=loadImage("gameOver.png");
  reset_img=loadImage("restart.png");
}

function setup() {
  createCanvas((displayWidth-10)/2, displayHeight/2-20);
  
  
  
  ground = createSprite(200,260,400,20);
  ground.addImage("ground",groundImage);
  //ground.x = ground.width /2;
  ground.velocityX = -4;

  bg=createSprite(100,260,400,20)
  bg.addImage("bgimg",bgImage);
  bg.scale=0.2;
  //bg.x=bg.width/2;
  
  bg.velocityX=-3
   
  trex = createSprite(50,260,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  gameOver=createSprite(300,80);
  gameOver.addImage("over",gameOver_img);
  gameOver.scale=0.8;
  gameOver.visible=false;
  
  reset=createSprite(300,140);
  reset.addImage(reset_img);
  reset.scale=0.6;
  reset.visible=false;

  invisibleGround = createSprite(200,270,400,10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score=0;
}

function draw() {
  camera.x=trex.x;

  gameOver.position.x=reset.position.x=camera.x;

  background(bgsky);
  

  if(gameState===PLAY){
  score = score + Math.round(getFrameRate()/60);
  ground.velocityX=-(6+3*score/100);
  
  if(keyDown("space") && trex.y >= 159 && trex.isTouching(ground)){
    trex.velocityY = -12;
  }
  
  trex.velocityY = trex.velocityY + 0.8
  console.log(bg.x);
  if (ground.x < 0){
    ground.x = 200;
   //bg.x=200;
  }
  if(bg.x<=-350){
    bg.x=-90;
  }
  
  trex.collide(invisibleGround);
  spawnClouds();
  spawnObstacles();
    
    if(trex.isTouching(obstaclesGroup)){
      gameState=END;
    }
  }
  else
  if(gameState===END){
    gameOver.visible=true;
    reset.visible=true;

    ground.velocityX=0;
    trex.velocityY=0;
    bg.velocityX=0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    trex.changeAnimation("collided",trex_collided );

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(reset)){
      r();
    }
  }
  textSize(30);
  stroke("black");
  strokeWeight(3);
  fill("brown");
  text("Score: "+ score, 250,30);
  drawSprites();

}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.x+width/2,200,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.9;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.x+width/2,245,10,40);
    obstacle.velocityX = -(6+3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function r(){
  gameState = PLAY;
  
  gameOver.visible = false;
  reset.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);;
  
  score = 0;
  
  ground.velocityX=-4;
  bg.velocityX=-3;
}