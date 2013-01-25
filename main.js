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
    this.a = 0.5;
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
    var angle=Math.atan((discA.y-discB.y)/(discA.x-discB.x));
    var discAtan=discA.vX*Math.sin(angle)-discA.vY*Math.cos(angle);
    var discAper=discA.vX*Math.cos(angle)+discA.vY*Math.sin(angle);
    var discBtan=discB.vX*Math.sin(angle)-discB.vY*Math.cos(angle);
    var discBper=discB.vX*Math.cos(angle)+discB.vY*Math.sin(angle);
    var temp=discAper;
    discAper=discBper;
    discBper=temp;
    discA.vX=discAper*Math.cos(angle)+discAtan*Math.sin(angle);
    discA.vY=discAper*Math.sin(angle)-discAtan*Math.cos(angle);
    discB.vX=discBper*Math.cos(angle)+discBtan*Math.sin(angle);
    discB.vY=discBper*Math.sin(angle)-discBtan*Math.cos(angle);
}

var checkCollision = function (discA,discB) {
    var d=Math.sqrt(Math.pow(discA.x-discB.x,2)+Math.pow(discA.y-discB.y,2));
    if (d<=(discA.radius+discB.radius)) doCollision(discA,discB);
}

var checkWallCollision = function (disc) {
	if (disc.x-disc.radius <= 0) {disc.vX=-disc.vX; }
	if (disc.x+disc.radius >= 3000) {disc.vX=-disc.vX; }
	if (disc.y-disc.radius <= 0) {disc.vY=-disc.vY; }
	if (disc.y+disc.radius >= 3000) {disc.vY=-disc.vY; }
}

var drawArrow = function (x,y) {
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x + 40,y+25);
    ctx.lineTo(x + 15,y + 25);
    ctx.lineTo(x + 15,y + 75);
    ctx.lineTo(x - 15,y + 75);
    ctx.lineTo(x - 15,y + 25);
    ctx.lineTo(x - 40,y + 25);
    ctx.closePath();
    ctx.strokeStyle="#FF0000"
    ctx.stroke();
    ctx.fillStyle="#FF0000"
    ctx.fill();
}

var drawPointer = function (cx,cy,x,y,self,enemy) {
    dbPrint("Drawing " + self.ID + "'s Pointer")
    var dx = self.x - enemy.x;
    var dy = self.y - enemy.y;
    var angle = Math.atan2(dx,-dy);
    dbPrint(angle);
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(angle);
    drawArrow(x,y);
    ctx.rotate(-angle);
    ctx.translate(-cx,-cy);
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
    dbPrint(keys);
    // Caution, key checks use falsy checking of relevnt keys!

    // A's movement
    if (keys[65]) {A.vX -= A.a} // A Key
    if (keys[68]) {A.vX += A.a} // D Key
    if (keys[83]) {A.vY += A.a} // S Key
    if (keys[87]) {A.vY -= A.a} // W Key

    // B's movement
    if (keys[37]) {B.vX -= B.a} // Left Arrow
    if (keys[38]) {B.vY -= B.a} // Up Arrow
    if (keys[39]) {B.vX += B.a} // Right Arrow
    if (keys[40]) {B.vY += B.a} // Down Arrow

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

    // Draw borders and cover any enemy overlap
    ctx.strokeRect(50, 50, 500, 500);
    ctx.strokeRect(650, 50, 500, 500);
    
    checkCollision(A,B);
    checkWallCollision(A);
    checkWallCollision(B);
    
    drawPointer(900,300,0,-200,A,B);
    drawPointer(300,300,0,-200,B,A);
}

function onKeyDown(event) {
    keys[event.keyCode] = 1;	
    dbPrint(keys);
}

function onKeyUp(event) {
    keys[event.keyCode] = 0;
    dbPrint(keys);
}


function main() {
    debugMode = true;
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    intervalCounter = 0;

    keys = new Object;

    canvas.addEventListener('keydown',onKeyDown,false);
    canvas.addEventListener('keyup',onKeyUp,false);
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