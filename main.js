function dbPrint(msg) {
    if (debugMode) {
	console.log(msg);
    }
}

var player = function(initX,initY,size,playerID) {
    this.x = initX;
    this.y = initY;
    this.vX = 0;
    this.vY = 0;
    this.a = 0.7;
    this.radius=size;
    this.ID=playerID;
	//console.log(this);
}
var drawBG = function(locX,locY,baseX,baseY) {
	if (locX<0) locX=0;
	if (locX>3000) locX=3000;
	if (locY<0) locY=0;
	if (locY>3000) locY=3000;
	ctx.drawImage(background,locX,locY,500,500,baseX,baseY,500,500);
}

var drawEnemy = function(myShip,eShip,centerX,centerY) {
	var distX=eShip.x-myShip.x;
	var distY=eShip.y-myShip.y;
	if (((distX)-eShip.radius<=250) && ((distY)-eShip.radius<=250) && ((distX)+eShip.radius>=-250) && ((distY)+eShip.radius>=-250)) {
	    drawDisc(distX+centerX,distY+centerY,eShip.radius);
		}
}

var doCollision = function (discA,discB) {

}

var checkCollision = function (discA,discB) {

}

var checkWallCollision = function (disc) {
	if (disc.x-disc.radius <= 0) {disc.vX=-disc.vX; }
	if (disc.x+disc.radius >= 3000) {disc.vX=-disc.vX; }
	if (disc.y-disc.radius <= 0) {disc.vY=-disc.vY; }
	if (disc.y+disc.radius >= 3000) {disc.vY=-disc.vY; }
}

var drawPointer = function (locX,locY,discA,discB) {

}
var circle = function(cx,cy,radius) {
	ctx.arc(cx,cy,radius,0,2*Math.PI, true);
}

var drawDisc = function(locX,locY,radius) {
    ctx.beginPath();
//    ctx.fillRect(locX,locY,radius,radius)
    ctx.arc(locX,locY,radius,0,2*Math.PI, true);
    ctx.fill();
}

var updater = function() {
    dbPrint(intervalCounter++);
    var len = keys.length;
    dbPrint(len);
    var key;
    for(var i = 0; i < len; i++) {
	dbPrint(i);
	key = keys.pop();
	dbPrint(key);
	switch (key) {
	case 37: // Left Arrow
	    B.vX -= B.a;
	    break;
	case 38: // Up Arrow
	    B.vY -= B.a;
	    break;
	case 39: // Right Arrow
	    B.vX += B.a;
	    break;
	case 40: // Down Arrow
	    B.vY += B.a;
	    break;
	case 65: // A Key
	    A.vX -= A.a;
	    break;
	case 68: // D Key
	    A.vX += A.a;
	    break;
	case 83: // S Key
	    A.vY += A.a;
	    break;
	case 87: // W Key
	    A.vY -= A.a;
	}
    }
    A.x+=A.vX;
    A.y+=A.vY;
    B.x+=B.vX;
    B.y+=B.vY;

    dbPrint(A);
    dbPrint(B);

    //*********calculations before clearing the picture********
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //**********start drawing after this************
    
    ctx.fillStyle = "#0000FF";

    // Backgrounds
    drawBG(A.x,A.y,50,50);
    drawBG(B.x,B.y,650,50);

    // Players
    drawDisc(300,300,A.radius);
    drawDisc(900,300,B.radius);

    // Enemies if they should be visible
    drawEnemy(A,B,300,300);
    drawEnemy(B,A,900,300);

    // Draw borders
    ctx.strokeRect(50, 50, 500, 500);
    ctx.strokeRect(650, 50, 500, 500);
    
    checkWallCollision(A);
    checkWallCollision(B);
    
    
}

function onKeyDown(event) {
    keys.push(event.keyCode);	
    console.log(keys);
}
/*
function onKeyUp(event) {
	keys[event.keyCode]=0;	
	//console.log(keys);
}*/


function main() {
    debugMode = true;
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    intervalCounter = 0;

    keys = new Array;

    canvas.addEventListener('keydown',onKeyDown,false);
    canvas.setAttribute('tabindex','0');
    canvas.focus();

    A = new player(2900,100,10,1);
    B = new player(100,2900,20,2);
    background = new Image();
    background.src = "./assets/starmap.jpg";
    dbPrint(background);
    interval= 33;
    intervalID = setInterval(updater, interval);
}

main()