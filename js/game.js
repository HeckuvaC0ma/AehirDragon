"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.game = {
	// CONSTANT properties
	color: "yellow",
    WIDTH : 640, 
    HEIGHT: 480,
    FIRE_RATE : 1,
	MTN_PROBABILITY_PER_SECOND : 1.0,
	CLOUD_PROBABILITY_PER_SECOND : 0.4,
	//this is updated constantly to ramp up difficulty
	GOLEM_PROBABILITY_PER_SECOND : 0.0,
	//game objects
	app: undefined,
    canvas: undefined,
    ctx: undefined,
	utils: undefined,
    headsegment: undefined,
    midsegment1: undefined,
    midsegment2: undefined,
    tailsegment: undefined,
	drawLib: undefined,
	//object arrays
	playerfireballs: [],
	mtnParts: [],
	clouds: [],
	golems: [],
	explosions : [],
	//images and sounds
	golemImage: undefined,
	mtnImage: undefined,
	cloudImage: undefined,
	explosionImage : undefined,
	ExplostionSprite: undefined,
	soundtrack: undefined,
	soundtrackPaused: false,
	//game variables
	score: 0,
	highScore: 0,
	cooldown: 0,
	play: false,
	died: false,
    dt: 1/60.0, //"delta time"
    // methods
	init : function() {
			//console.log("app.game.init() called");
			// declare properties
			this.canvas = document.querySelector('#mainCanvas');
			this.canvas.width = this.WIDTH;
			this.canvas.height = this.HEIGHT;
			this.ctx = this.canvas.getContext('2d');
			
			//create an image object
			var image = new Image();

			//get the segment PNG - it was allways loaded for us
			image.src = this.app.IMAGES['segmentImage'];
			
			// set up player segments
			//set segment.image property
			this.headsegment = new app.segment(image,this.WIDTH/2,this.HEIGHT/2,this.WIDTH,this.HEIGHT,2);
			this.midsegment1 = new app.segment(image,this.WIDTH/2-40,this.HEIGHT/2,this.WIDTH,this.HEIGHT,1);
			this.midsegment2 = new app.segment(image,this.WIDTH/2-80,this.HEIGHT/2,this.WIDTH,this.HEIGHT,1);
			this.tailsegment = new app.segment(image,this.WIDTH/2-120,this.HEIGHT/2,this.WIDTH,this.HEIGHT,0);
			
			//prepare golem image
			var image = new Image();
			image.src = this.app.IMAGES['golemImage'];
			this.golemImage = image;
			//prepare mountain image
			var image = new Image();
			image.src = this.app.IMAGES['mtnImage'];
			this.mtnImage = image;
			//prepare cloud image
			var image = new Image();
			image.src = this.app.IMAGES['cloudImage'];
			this.cloudImage = image;
			//prepare golem explosion spritesheet
			var image = new Image();
			image.src = this.app.IMAGES['explosionImage'];
			this.explosionImage = image;
			//makes sure update is only called once(can only bind the animation frame to it once)
			if(!this.died){ 
				this.update();
			}
			//reset these values every time the game runs
			this.score = 0;
			this.GOLEM_PROBABILITY_PER_SECOND = 0.0;
	},
	update:function(){
		//LOOP
		requestAnimationFrame(this.update.bind(this));
		//clear screen
		this.ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);
		//controls elements while the game is playing(the actual game update)
		if(this.play){
			//UPDATE
			this.moveSprites();
		
			//CHECK FOR COLLISIONS
			this.checkForCollisions();
		
			//DRAW
			this.drawSprites();
			//increment the golem probability as the game persists on
			this.GOLEM_PROBABILITY_PER_SECOND += 0.00001;
		}
		//handle elements while the game is not running
		else{
			//start screen
			if(!this.died){
				var image = new Image();
				image.src = this.app.IMAGES['loadScreen'];
				this.ctx.drawImage(image,0,0,this.WIDTH,this.HEIGHT);
			}
			//deathscreen and unload all objects from arrays
			else{
				var image = new Image();
				image.src = this.app.IMAGES['deathScreen'];
				this.ctx.drawImage(image,0,0,this.WIDTH,this.HEIGHT);
				//manage score
				this.drawLib.text(this.ctx, "Score: " + this.score, 20, 120, 20, "#FF0000");
				if(this.score>this.highScore){
					this.highScore=this.score;
				}
				this.drawLib.text(this.ctx, "BestScore: " + this.highScore, 20, 150, 20, "#FF0000");
				//unload objects
				for(var i=0; i<this.golems.length; i++){
					this.golems.pop();
				};
				for(var i=0; i<this.playerfireballs.length; i++){
					this.playerfireballs.pop();
				};
				for(var i=0; i<this.explosions.length; i++){
					this.explosions.pop();
				};
				for(var i=0; i<this.mtnParts.length; i++){
					this.mtnParts.pop();
				};
				for(var i=0; i<this.clouds.length; i++){
					this.clouds.pop();
				};
			}
		}
	},drawSprites:function(){
		//draw background
		this.drawLib.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
		//draw sprites
		this.headsegment.draw(this.ctx);
		this.midsegment1.draw(this.ctx);
		this.midsegment2.draw(this.ctx);
		this.tailsegment.draw(this.ctx);
		//draw fireballs
		for(var i = 0; i < this.playerfireballs.length; i++){
			this.playerfireballs[i].draw(this.ctx);
		};
		//draw golems
		for(var i = 0; i < this.golems.length; i++){
			this.golems[i].draw(this.ctx);
		};
		//draw mountainRange
		for(var i = 0; i < this.mtnParts.length; i++){
			this.mtnParts[i].draw(this.ctx);
		};
		this.drawLib.text(this.ctx, "Score: " + this.score, 500, 30, 15, "#FF0000");
		//draw clouds
		for(var i = 0; i < this.clouds.length; i++){
			this.clouds[i].draw(this.ctx);
		};
		//draw explosions
		this.explosions.forEach(function(exp){
			exp.draw(this.ctx);
		},this);
	},
    moveSprites:function(){
		this.score++;
    	//fire fireballs
    	this.cooldown --;
    	//poll keyboard
    	if (this.cooldown<=0&& app.keydown[app.KEYBOARD.KEY_SPACE]){
    		this.shoot(this.headsegment.x,this.headsegment.y);
    		this.cooldown = 60/this.FIRE_RATE;//assuming 60fps
    	}
		//move golems
		for(var i=0; i<this.golems.length; i++){
			this.golems[i].update(this.dt);
		};
		//move clouds
		for(var i=0; i<this.clouds.length; i++){
			this.clouds[i].update(this.dt);
		};
		//move mountains
		for(var i=0; i<this.mtnParts.length; i++){
			this.mtnParts[i].update(this.dt);
		};
    	//move fireballs
    	for(var i = 0; i < this.playerfireballs.length; i++){
			this.playerfireballs[i].update(this.dt);
		}
		//returns a new array with only active fireballs
		this.playerfireballs = this.playerfireballs.filter(function(fireball){
			return fireball.active;
		});
		//returns a new array with only active golems
		this.golems = this.golems.filter(function(golem){
			return golem.active;
		});
		//returns a new array with only active clouds
		this.clouds = this.clouds.filter(function(cloud){
			return cloud.active;
		});
		//returns a new array with only active mountain Parts
		this.mtnParts = this.mtnParts.filter(function(mtnPoint){
			return mtnPoint.active;
		});
		//make objects for the arrays based on their probability
		//ground mountains
		if(Math.random() < this.MTN_PROBABILITY_PER_SECOND/60){
			this.mtnParts.push(new app.mtnPoint(this.mtnImage, this.WIDTH, this.HEIGHT,false));
		}
		//floating mountians
		if(Math.random() < this.MTN_PROBABILITY_PER_SECOND/60/3){
			this.mtnParts.push(new app.mtnPoint(this.mtnImage, this.WIDTH, this.HEIGHT,true));
		}
		//golems
		if(Math.random() < this.GOLEM_PROBABILITY_PER_SECOND/60){
			this.golems.push(new app.golem(this.golemImage, this.WIDTH, this.HEIGHT));
		}
		//clouds
		if(Math.random() < this.CLOUD_PROBABILITY_PER_SECOND/60){
			this.clouds.push(new app.cloud(this.cloudImage, this.WIDTH, this.HEIGHT));
		}
		//SEGMENT MOVEMENT (the dragon is a chain so each movement affects the components down the chain)
		//GRAVITY
		this.headsegment.moveDown(this.dt/10);
		this.midsegment1.rotateDown(this.dt/20, this.headsegment.nextX(), this.headsegment.nextY());
		this.midsegment2.rotateDown(this.dt/40, this.midsegment1.nextX(), this.midsegment1.nextY());
		this.tailsegment.rotateDown(this.dt/80, this.midsegment2.nextX(), this.midsegment2.nextY());
		//CONTROL 
		if(this.app.keydown[this.app.KEYBOARD.KEY_LEFT]){
			this.headsegment.moveLeft(this.dt);
			this.midsegment1.rotateUp(this.dt/2, this.headsegment.nextX(), this.headsegment.nextY());
			this.midsegment2.rotateUp(this.dt/4, this.midsegment1.nextX(), this.midsegment1.nextY());
			this.tailsegment.rotateUp(this.dt/8, this.midsegment2.nextX(), this.midsegment2.nextY());
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_RIGHT]){
			this.headsegment.moveRight(this.dt);
			this.midsegment1.rotateDown(this.dt/2, this.headsegment.nextX(), this.headsegment.nextY());
			this.midsegment2.rotateDown(this.dt/4, this.midsegment1.nextX(), this.midsegment1.nextY());
			this.tailsegment.rotateDown(this.dt/8, this.midsegment2.nextX(), this.midsegment2.nextY());
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_R]){
			this.headsegment.moveUp(this.dt/2);
			this.midsegment1.rotateDown(this.dt/2, this.headsegment.nextX(), this.headsegment.nextY());
			this.midsegment2.rotateDown(this.dt/4, this.midsegment1.nextX(), this.midsegment1.nextY());
			this.tailsegment.rotateDown(this.dt/8, this.midsegment2.nextX(), this.midsegment2.nextY());
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_F]){
			this.headsegment.moveDown(this.dt);
			this.midsegment1.rotateUp(this.dt/2, this.headsegment.nextX(), this.headsegment.nextY());
			this.midsegment2.rotateUp(this.dt/4, this.midsegment1.nextX(), this.midsegment1.nextY());
			this.tailsegment.rotateUp(this.dt/8, this.midsegment2.nextX(), this.midsegment2.nextY());
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_E]){
			this.midsegment1.rotateUp(this.dt, this.headsegment.nextX(), this.headsegment.nextY());
			this.midsegment2.rotateUp(this.dt/2, this.midsegment1.nextX(), this.midsegment1.nextY());
			this.tailsegment.rotateUp(this.dt/4, this.midsegment2.nextX(), this.midsegment2.nextY());
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_D]){
			this.midsegment1.rotateDown(this.dt, this.headsegment.nextX(), this.headsegment.nextY());
			this.midsegment2.rotateDown(this.dt/2, this.midsegment1.nextX(), this.midsegment1.nextY());
			this.tailsegment.rotateDown(this.dt/4, this.midsegment2.nextX(), this.midsegment2.nextY());
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_W]){
			this.midsegment2.rotateUp(this.dt, this.midsegment1.nextX(), this.midsegment1.nextY());
			this.tailsegment.rotateUp(this.dt/2, this.midsegment2.nextX(), this.midsegment2.nextY());
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_S]){
			this.midsegment2.rotateDown(this.dt, this.midsegment1.nextX(), this.midsegment1.nextY());
			this.tailsegment.rotateDown(this.dt/2, this.midsegment2.nextX(), this.midsegment2.nextY());
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_Q]){
			this.tailsegment.rotateUp(this.dt, this.midsegment2.nextX(), this.midsegment2.nextY());
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_A]){
			this.tailsegment.rotateDown(this.dt, this.midsegment2.nextX(), this.midsegment2.nextY());
		}
		//Explosions
		this.explosions.forEach(function(exp){
			exp.update(this.dt);
		},this);
		this.explosions = this.explosions.filter(function(exp) {
			return exp.active;
		});
    },
    //create a fireball in front of the dragon's mouth
    shoot: function(x,y){
    	this.playerfireballs.push(new app.fireball(x+this.headsegment.width/2,y,100));
		createjs.Sound.play("fireball");
    },
    //
	checkForCollisions: function(){
		//nest the forEach loops
		//"this" becomes undefined in forEach loop
		//"self" will preserve "this" i.e. app.game
		var self = this;
		//fireball vs golems
		this.playerfireballs.forEach(function(fireball){
			self.golems.forEach(function(golem){
				if(self.collides(fireball,golem)){
					self.createExplosion(golem.x, golem.y, -golem.xVelocity/4, -golem.yVelocity/4);
					golem.active = false;
					fireball.active = false;
					self.score +=100;
				}//end if
			});//end forEach golem
		});//end forEach fireball
		//golems vs segment
		this.golems.forEach(function(golem){
			if(self.collides(golem, self.headsegment)||self.collides(golem, self.midsegment1)||self.collides(golem, self.midsegment2)||self.collides(golem, self.tailsegment)){
				golem.explode();
				self.createExplosion(golem.x, golem.y, -golem.xVelocity/4, -golem.yVelocity/4);
				self.play=false;
				self.died=true;
				self.soundtrack.pause();
			}
		});
		this.mtnParts.forEach(function(mtnPoint){
			if(self.collides(mtnPoint, self.headsegment)||self.collides(mtnPoint, self.midsegment1)||self.collides(mtnPoint, self.midsegment2)||self.collides(mtnPoint, self.tailsegment)){
				mtnPoint.remove();
				self.createExplosion(mtnPoint.x, mtnPoint.y, -mtnPoint.xVelocity/4, -mtnPoint.yVelocity/4);
				self.play=false;
				self.died=true;
				self.soundtrack.pause();
			}
		});
		//Screen Clipping
		if(self.headsegment.y>this.HEIGHT||self.headsegment.y<0||self.headsegment.x>this.WIDTH||self.headsegment.x<0){
				self.play=false;
				self.died=true;
		}
		if(self.midsegment1.y>this.HEIGHT||self.midsegment1.y<0||self.midsegment1.x>this.WIDTH||self.midsegment1.x<0){
				self.play=false;
				self.died=true;
		}
		if(self.midsegment2.y>this.HEIGHT||self.midsegment2.y<0||self.midsegment2.x>this.WIDTH||self.midsegment2.x<0){
				self.play=false;
				self.died=true;
		}
		if(self.tailsegment.y>this.HEIGHT||self.tailsegment.y<0||self.tailsegment.x>this.WIDTH||self.tailsegment.x<0){
				self.play=false;
				self.died=true;
		}
	},
	collides: function(a, b) {
		//a = sprite1
		//b = sprite2
		//bounding box collision detection
		//https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collisions_detection
		//we're drawing sprites from their center x,y
		
		var ax = a.x - a.width/2;
		var ay = a.y - a.height/2;
		var bx = b.x - b.width/2;
		var by = b.y - b.height/2;
		
		return ax < bx + b.width &&
				ax + a.width > bx &&
				ay < by + b.height &&
				ay + a.height > by;
	},
	//Part F
	createExplosion:function(x, y, xVelocity, yVelocity){
		//ExplostionSprite(image,width,height,frameWidth,frameHeight,frameDelay)
		//create explosion and update values
		var exp = new app.ExplosionSprite(this.explosionImage,40,40,64,64,1/16);
		exp.x=x;
		exp.y=y;
		exp.xVelocity=xVelocity;
		exp.yVelocity=yVelocity;
		//add it to the array
		this.explosions.push(exp);
		//play explosion
		createjs.Sound.play("explosion");
	},
	//ambient sound control
	resumeSoundtrack:function(){
		this.soundtrack.resume();
	},
	pauseSoundtrack:function(){
		this.soundtrack.pause();
	},
	toggleSoundtrack:function(){
		this.soundtrackPaused = !this.soundtrackPaused;
		if(this.soundtrackPaused){
			this.pauseSoundtrack();
		}
		else{
			this.resumeSoundtrack();
		}
	},
}; // end app.game