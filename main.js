var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ax=0; var ay=0; var intervalCounter=0;
var vx=0; var vy=0;
var keyboard = new Array;
canvas.addEventListener('keydown',onKeyDown,false);
canvas.addEventListener('keyup',onKeyUp,false); //this is how I got to manage multiple key presses
canvas.setAttribute('tabindex','0');
canvas.focus();
var collision = function (discA,discB) {

}

var updater = function () {
	intervalCounter++;
	if (keyboard[37]===1) ax-=0.7; //we should probably change the amount of increment according to the current value of ax and ay because it's weird to control like that
	if (keyboard[39]===1) ax+=0.7;
	if (keyboard[40]===1) ay+=0.7;
	if (keyboard[38]===1) ay-=0.7;
	vx+=ax;	//accelerations
	vy+=ay;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#0000FF";
	ctx.fillRect((vx )% canvas.width,vy % canvas.height,50,50); //not a proper handling of location, temporary
	
	
}

function onKeyDown(event) {
	keyboard[event.keyCode]=1;	
	console.log(keyboard);
}
function onKeyUp(event) {
	keyboard[event.keyCode]=0;	
	console.log(keyboard);
}
var interval= 33;
intervalID = setInterval(updater,interval);