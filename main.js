var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var i=0;
//canvas.addEventListener('keydown',onKeyDown,false);

var updater = function () {
	ctx.clear;
	i++;
	ctx.fillStyle = "#0000FF";
	ctx.fillRect(50+(i % 50),150,50,100);
	console.log((i % 50));
	console.log("updater");
	
}

//var onKeyDown(event) {
//	console.log('keyCode: '+event.keyCode);
//}
var interval= 33;
intervalID = setInterval(updater,interval);