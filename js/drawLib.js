//drawLib.js
"use strict"
var app = app || {};
app.drawLib = {
	clear : function(ctx, x, y, w, h){
		ctx.clearRect(x, y, w, h);
	},
	rect : function(ctx, x, y, w, h, col){
		ctx.save();
		ctx.fillStyle = col;
		ctx.fillRect(x, y, w, h);
		//ctx.restore();
	},
	
	segment : function(ctx,image, x, y, w, h,type,theta,nx,ny){
		//we're doing these calculations so we are drawing the 
		//segment from the center x,y of the object(used on the rotated canvas)
		var halfW = w/2;
		var halfH = h/2;
		//find the middle position between the two points on the segment(used on the normal canvas)
		var midX = (x+nx)/2;
		var midY = (y+ny)/2;
		//move the canvas to the middle point
		ctx.save();
		ctx.translate(midX,midY);
		//rotate it arround to match the angle between the points
		ctx.rotate(theta-Math.PI)
		if(!image){
			rect(ctx,  x - halfW, y - halfH, w, h, ctx.color);
		}
		else{
			ctx.drawImage(image, 300*type, 0, 300, 150, - halfW, - halfH, w, h);
		}
		ctx.restore();
	},
	//a generalized linear gradiant function
	backgroundGradient: function(ctx, width, height){
		ctx.save;
		//Create gradient - top to bottom
		var grad = ctx.createLinearGradient(0,0,0,height);
		grad.addColorStop(0, "#81F7F3");//top
		grad.addColorStop(1, "#58D3F7");//bottom
		
		//change this to fill entire ctx with gradient
		ctx.fillStyle=grad;
		ctx.fillRect(0,0,width,height);
		ctx.restore();
	},
	text : function(ctx, string, x, y, size, col){
		ctx.save();
		ctx.font = 'bold ' + size + 'px Monospace';
		ctx.fillStyle = col;
		ctx.fillText(string, x, y);
		ctx.restore
	}
}