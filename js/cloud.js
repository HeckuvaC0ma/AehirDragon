"use strict";
app.cloud = function(){

	function cloud(image,canvasWidth,canvasHeight) {
		// ivars
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.active = true;
		this.age = Math.floor(Math.random() * 128);
		
		this.color = "#A2B";
		
		this.x = this.canvasWidth+300;
		this.y = Math.random() * this.canvasHeight / 2 +50;
		this.xVelocity = 100
		this.yVelocity = 0;
		this.image = image;
		this.width = Math.random()*200+200;
		this.height = Math.random()*200+200;
	};
		

	var p = cloud.prototype;
	
	//draws the cloud if the images loaded(a rectangle if not)
	  p.draw = function(ctx) {
			var halfW = this.width/2;
			var halfH = this.height/2;
			
			if(!this.image){
				ctx.fillStyle = this.color;
				ctx.fillRect(this.x - halfW, this.y - halfH, this.width, this.height);
				
			} 
			else{
				ctx.drawImage(this.image,this.x - halfW, this.y - halfH, this.width, this.height);
			}
			
	  };
	//this slowly slides the clouds to the left of the screen every frame
	p.update = function(dt) {
		this.x -= this.xVelocity *dt;
		this.age++;
		this.active = this.active && inBounds(this);
		
	  };
	  
	  // private
	  function inBounds(obj) {
		return obj.x >= 0 - obj.width * 0.5;
	  };
	
	return cloud;
	
}();
