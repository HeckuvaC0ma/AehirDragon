/*
loader.js
variable 'app' is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};
app.KEYBOARD = {
	"KEY_Q": 81,
	"KEY_W": 87,
	"KEY_E": 69,
	"KEY_R": 82,
	"KEY_A": 65,
	"KEY_S": 83,
	"KEY_D": 68,
	"KEY_F": 70,
	"KEY_LEFT": 37,
	"KEY_UP": 38,
	"KEY_RIGHT": 39,
	"KEY_DOWN": 40,
	"KEY_SPACE": 32,
};
app.IMAGES = {
	segmentImage: "images/Dragon.png",
	golemImage: "images/Golem.png",
	cloudImage: "images/Cloud.png",
	mtnImage: "images/Mountain.png",
	loadScreen: "images/Start.png",
	deathScreen: "images/Dead.png",
	explosionImage: "images/explosion.png"
};
//app.keydown array to keep track of which keys are down
//key daemon
//game.js will "poll"this array every frame
app.keydown = [];
window.onload = function(){
	//console.log("window.onload called");
	//this is the "sandbox" where we hook our module up
	//so that we don't have any hard coded dependencies in
	//the modules themselves
	app.game.app = app;
	//app.segment.drawLib = app.drawLib;
	app.game.drawLib = app.drawLib;
	app.game.utils = app.utils;
	app.Emitter.utils = app.utils;
	app.game.ExplosionSprite = app.ExplosionSprite;
	window.addEventListener("keydown",function(e){
		app.keydown[e.keyCode] = true;
	});
	
	window.addEventListener("keyup",function(e){
		//console.log("keyup=" + e.keyCode);
		app.keydown[e.keyCode] = false; 
		//x toggles the ambience
		if(e.keyCode==88) app.game.toggleSoundtrack();
		//p is play key from both the start and upon death
		if(e.keyCode==80 && app.game.play==false) {
			//start the game
			app.game.init();
			//game is playing
			app.game.play=true;
			//this will only create the sound when the game loads(not every init) 
			if(!app.game.died){
				app.game.soundtrack = createjs.Sound.play("soundtrack",{loop:-1,volume:0.6});//60% volume
			}
			//make sure the sound is playing
			app.game.soundtrack.resume();
		}
	});
	window.addEventListener('touchstart',function(e){
		e.preventDefault();
		app.keydown[app.KEYBOARD.KEY_SPACE] = true;
	},false);
	window.addEventListener('touchend',function(e){
		e.preventDefault();
		app.keydown[app.KEYBOARD.KEY_SPACE] = false;
	},false);
	//Preload Images and Soundcx
	app.queue = new createjs.LoadQueue(false);
	app.queue.installPlugin(createjs.Sound);
	app.queue.on("complete", function(){
		//console.log("images loaded called");
		app.game.init();
	});
	//load image and sound files
	app.queue.loadManifest([
		{id: "segmentImage", src:"images/Dragon.png"},
		{id: "golemImage", src:"images/Golem.png"},
		{id: "cloudImage", src:"images/Cloud.png"},
		{id: "mtnImage", src:"images/Mountain.png"},
		{id: "loadScreen", src:"images/Start.png"},
		{id: "deathScreen", src:"images/Dead.png"},
		{id: "explosionImage", src:"images/explosion.png"},
		{id: "fireball", src:"sounds/FireballSoundEffect.mp3"},
		{id: "explosion", src:"sounds/BreakingRocks.mp3"},
		{id: "soundtrack", src:"sounds/AmbientWind.mp3"}
	]);
}