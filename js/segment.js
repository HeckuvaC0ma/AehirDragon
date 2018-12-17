"use strict";
app.segment = function(){

	function segment(image, x, y,canvasWidth,canvasHeight,type) {
		// ivars
		this.color = "yellow";
		this.x = x;
		this.y = y;
		this.nx = x+60;
		this.ny = y;
		this.theta = Math.PI;
		this.image = image;
		this.width = 30;
		this.height = 30;
		this.length = 60;
		this.speed = 100;
		this.drawLib = app.drawLib;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.active = true;
		this.age = Math.floor(Math.random() * 128);
		this.type = type;
	};

	var p = segment.prototype;
	//uses the angle to find the next point on the chain of segments
	p.calcNext= function(theta){
			this.nx = this.x+Math.cos(theta)*(this.length-10);
			this.ny = this.y+Math.sin(theta)*(this.length-10);
	};
	//rotate around a point Only secondary chain points directly use this
	p.rotateUp= function(dt,x,y){
		this.x=x;
		this.y=y;
		this.theta += dt;
		this.calcNext(this.theta);
	};
	p.rotateDown= function(dt,x,y){
		this.x=x;
		this.y=y;
		this.theta -= dt;
		this.calcNext(this.theta);
	};
	//moving the points around causes it to tilt up and down
	p.moveUp= function(dt){
		this.y -= this.speed *dt;
		this.theta -= dt/3;
		this.calcNext(this.theta);
	};
	p.moveDown= function(dt){
		this.y += this.speed *dt;
		this.theta += dt/3;p
		this.calcNext(this.theta);
	};
	p.moveLeft= function(dt){
		this.x -= this.speed *dt;
		this.theta -= dt/3;
		this.calcNext(this.theta);
	};
	p.moveRight= function(dt){
		this.x += this.speed *dt;
		this.theta += dt/3;p
		this.calcNext(this.theta);
	};
	//accessors to pass the points along the chain
	p.nextX= function(){
		return this.nx;
	};
	p.nextY= function(){
		return this.ny;
	};
	p.draw= function(ctx){
		this.drawLib.segment(ctx,this.image,this.x,this.y,this.length,this.height,this.type,this.theta,this.nx,this.ny);
	};
	
	return segment;
	
}();
