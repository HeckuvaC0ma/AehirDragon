"use strict";
app.golem = function(){

	function golem(image,canvasWidth,canvasHeight) {
		// ivars
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.active = true;
		this.age = Math.floor(Math.random() * 128);
		
		this.color = "#A2B";
		
		this.x = this.canvasWidth;
		this.y = this.canvasHeight / 4 + Math.random() * this.canvasHeight / 2;
		this.xVelocity = 200
		this.yVelocity = 0;
		this.image = image;
		this.width = 40;
		this.height = 40;
	};
		
	
	var p = golem.prototype;
	//draws the golem if the images loaded(a rectangle if not)
	  p.draw = function(ctx) {
			var halfW = this.width/2;
			var halfH = this.height/2;
			
			if(!this.image){
				ctx.fillStyle = this.color;
				ctx.fillRect(this.x - halfW, this.y - halfH, this.width, this.height);
				
			} else{
				ctx.drawImage(this.image,this.x - halfW, this.y - halfH, this.width, this.height);
			}
			
	  };
	//moves the golem across the screen
	//update checks if it is in bounds as well
	p.update = function(dt) {
		this.x -= this.xVelocity *dt;
		this.age++;
		this.active = this.active && inBounds(this);
		
	  };
	 //a golem is no longer in play 
	 p.explode  = function() {
		this.active = false;
	  };
	  
	  // private
	  //find the objects that can still appear on screen
	  function inBounds(obj) {
		return obj.x >= 0 - obj.width * 0.5;
	  };
	
	return golem;
	
}();
