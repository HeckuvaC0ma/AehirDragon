//fireball.js
"use strict";
var app = app || {};
app.fireball=function(){
	function fireball(x, y, speed){
		//ivars - unique for every instance
		this.x = x;
		this.y = y;
		this.active = true;
		this.xVelocity = speed;
		this.yVelocity= 0;
		this.width= 5;
		this.height= 5;
		this.color= "#FFF";
		this.embers = new app.Emitter();//oops-global
		this.drawLib = app.drawLib;
		this.embers.numParticles = 100;
		this.embers.red = 255;
		this.embers.green = 150;
		this.embers.minXspeed = this.embers.minYspeed = - 0.25;
		this.embers.maxXspeed = this.embers.maxYspeed = 0.25;
		this.embers.createParticles(this.emitterPoints());
	}//end fireball Constructor
	var p = fireball.prototype;
	p.update = function(dt){
		this.x += this.xVelocity * dt;
		this.y += this.yVelocity * dt;
		this.active = this.active && inBounds(this.x);
	};
	p.emitterPoints= function(){
		//at the point where the cube is drawn
		return{
			x:this.x,
			y:this.y
		};
	};
	//draw flame particles
	p.draw= function(ctx){
		this.embers.updateAndDraw(ctx, this.emitterPoints());
	};
	//private methods
	function inBounds(x){
		
		return x <= 700;
	}
	return fireball;
}();