"use strict";
app.mtnPoint = function(){

	function mtnPoint(image,canvasWidth,canvasHeight,type) {
		
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.active = true;
		
		this.color = "#A2B";
		
		this.x = canvasWidth+100;

		//choose if it is a bloating mountain or a regular one with type boolean
		if(type){
			this.y = 0-100*Math.random();
		}
		else{
			this.y = canvasHeight+100*Math.random();
		}
		this.amplitude = app.utils.getRandom(1.5,7.0); // oops, app global
		this.image = image;
		this.xVelocity = 100
		this.yVelocity = 0;
		this.width = 200;
		this.height = 200;
	};
		

	var p = mtnPoint.prototype;
	
	//draws the mountain if the images loaded(a rectangle if not)
	  p.draw = function(ctx) {
			var halfW = this.width/2;
			var halfH = this.height/2;
			
			if(!this.image){
				ctx.fillStyle = this.color;
				ctx.fillRect(this.x - halfW, this.y - halfH, this.width, this.height);
			//slight modification because of the images used for the mountains	
			} else{
				ctx.drawImage(this.image,this.x - (halfW+20), this.y - (halfH+20), this.width+40, this.height+40);
			}
			
	  };
	//make sure the mountain is on screen
	p.update = function(dt) {
		this.x -= this.xVelocity *dt;
		this.active = this.active && inBounds(this);
		
	  };
	  
	 //remove this mountain 
	 p.remove  = function() {
		this.active = false;
	  };
	  
	  // private
	  //find the objects that can still appear on screen
	  function inBounds(obj) {
		return obj.x >= 0 - obj.width * 0.5;
	  };
	
	return mtnPoint;
	
}();
