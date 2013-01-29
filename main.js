function dbPrint(msg) {
    if (debugMode) {
	console.log(msg);
    }
}
var massDensity=1;
var screen=0;
var flag = function(initX,initY,player,enemy,color) {
    this.homeX = initX;
    this.homeY = initY;
	this.x = initX;
	this.y = initY;
    this.player = player;
    this.color = color;
    this.enemy = enemy;
	this.radius = 10;
    this.stolen = false;
    this.drawFlag = function(viewer) { //flag rendering works, do not attempt to improve! 1 hour spent fixing
		var x;
		var y;
		if (this.stolen === true) {
			x = this.enemy.x;
			y = this.enemy.y;
			
		}
		else {
	    x = this.homeX;
	    y = this.homeY;
		
		}
		
		var distX = x - viewer.x;
		var distY = y - viewer.y;
		//console.log("distX= ",distX," ; distY=",distY);
		if (((distX)-this.radius<=250) && ((distY)-this.radius<=250) && ((distX)+this.radius>=-250) && ((distY)+this.radius>=-250)) {
	    drawDisc(distX+viewer.viewX,distY+viewer.viewY,this.radius,this.color);
		
		}
	
    }
}

var player = function(initX,initY,viewX,viewY,size,player) {
	this.name="Anon";
    this.score=0;
    this.x = initX;
    this.y = initY;
    this.homeX=initX;
    this.homeY=initY;
    this.vX = 0;
    this.vY = 0;
    this.a = 0.5;
    this.aX = 0;
    this.aY = 0;
    this.radius=size;
    this.mass = massDensity*Math.PI*Math.pow(this.radius,2);
    this.ID=player;
    if (this.ID === "A") { this.color = "rgb(255,0,0)"; }
    else { this.color = "rgb(0,0,255)"; }
    this.viewX = viewX;
    this.viewY = viewY;

    /* torch works as follows: there are four frames in the animation. Each plays for the same length of time. The first two are assigned to negative counter values so that the latter two can repeat using modular arithmetic. Turning off the engines resets the torch counter to torchCounterStart, i.e. -2 * torchFactor. */

    this.torchFactor = 3; // units of 33 milliseconds
    this.torchCounterStart = -2 * this.torchFactor;
    this.torchCounter = this.torchCounterStart;
    dbPrint(this);
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
	    drawDisc(distX+centerX,distY+centerY,eShip.radius,eShip.color);
		}
}

//doCollision is physically correct and returns the ID of the collision winner
var doCollision = function (discA,discB) { 
    var angle=Math.atan((discA.y-discB.y)/(discA.x-discB.x));
	if ((discA.x-discB.x)===0) angle=Math.PI/2; //if denominator is zero
    var discAtan=discA.vX*Math.sin(angle)-discA.vY*Math.cos(angle);
    var discAper=discA.vX*Math.cos(angle)+discA.vY*Math.sin(angle);
    var discBtan=discB.vX*Math.sin(angle)-discB.vY*Math.cos(angle);
    var discBper=discB.vX*Math.cos(angle)+discB.vY*Math.sin(angle);
    var u1=discAper;
    var u2=discBper;
    discAper=(u1*(discA.mass-discB.mass)+2*discB.mass*u2)/(discA.mass+discB.mass);
	discBper=(u2*(discB.mass-discA.mass)+2*discA.mass*u1)/(discA.mass+discB.mass);
    discA.vX=discAper*Math.cos(angle)+discAtan*Math.sin(angle);
    discA.vY=discAper*Math.sin(angle)-discAtan*Math.cos(angle);
    discB.vX=discBper*Math.cos(angle)+discBtan*Math.sin(angle);
    discB.vY=discBper*Math.sin(angle)-discBtan*Math.cos(angle);
	//console.log(discA.ID+ " momentum: " + Math.abs(discA.mass*u1) + " ,"+discB.ID+" momentum: ", +Math.abs(discB.mass*u2));
	if (Math.abs(discA.mass*u1)>Math.abs(discB.mass*u2)) return discA.ID;
	if (Math.abs(discA.mass*u1)<Math.abs(discB.mass*u2)) return discB.ID;
	
	
}

var checkCollision = function (discA,discB) {
    var d=Math.sqrt(Math.pow(discA.x-discB.x,2)+Math.pow(discA.y-discB.y,2));
    if (d<=(discA.radius+discB.radius)) return doCollision(discA,discB);
	else return "no collision";
}

var checkWallCollision = function (disc) {
	if (disc.x-disc.radius <= 0) {disc.vX=-disc.vX; }
	if (disc.x+disc.radius >= 3000) {disc.vX=-disc.vX; }
	if (disc.y-disc.radius <= 0) {disc.vY=-disc.vY; }
	if (disc.y+disc.radius >= 3000) {disc.vY=-disc.vY; }
}

var drawArrow = function (x,y,color,scale) {
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x + 40,y+25);
    ctx.lineTo(x + 15,y + 25);
    ctx.lineTo(x + 15,y + 75);
    ctx.lineTo(x - 15,y + 75);
    ctx.lineTo(x - 15,y + 25);
    ctx.lineTo(x - 40,y + 25);
    ctx.closePath();
    ctx.fillStyle = color;
    //ctx.scale(scale,scale)
    ctx.fill();
    //ctx.scale(1/scale,1/scale);
}

var drawPointer = function (x,y,self,enemy) {
    dbPrint("Drawing " + self.ID + "'s Pointer");
    var dx = self.x - enemy.x;
    var dy = self.y - enemy.y;
    var angle = Math.atan2(-dx,dy);
    var distanceWeight = 100;
    var rawDisp = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
    var cookedDisp = Math.floor(rawDisp / distanceWeight);
    dbPrint(angle);
    ctx.translate(self.viewX,self.viewY);
    ctx.rotate(angle);
    drawArrow(x,y, "rgba(255, 0, 0, 0.5)", 1,1);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.translate(x,(y-20));
    ctx.rotate(-angle);
    ctx.fillText(cookedDisp,0,0);
    ctx.rotate(angle);
    ctx.translate(-x,-(y-20));
    ctx.rotate(-angle);
    ctx.translate(-self.viewX,-self.viewY);
}

var drawHeading = function (x,y,self) {
    dbPrint("Drawing " + self.ID + "'s Heading");
    var angle = Math.atan2(self.vX,-self.vY);
    var speedWeight = 30; // empirical, basically magic
    var rawSpeed = Math.sqrt(Math.pow(self.vX,2) + Math.pow(self.vY,2))
    var magnitude = rawSpeed / speedWeight;
    var displaySpeedWeight = 3.3;
    var cookedSpeed = Math.floor(rawSpeed / displaySpeedWeight);
    dbPrint("vX = " + self.vX + ", vY = " + self.vY + ", angle = " + angle);
    ctx.translate(self.viewX,self.viewY);
    ctx.rotate(angle);
    drawArrow(x,y,"rgba(0, 255, 0, 0.5)",magnitude);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.translate(x,(y-20));
    ctx.rotate(-angle);
    ctx.fillText(cookedSpeed,0,0);
    ctx.rotate(angle);
    ctx.translate(-x,-(y-20));
    ctx.rotate(-angle);
    ctx.translate(-self.viewX,-self.viewY);
}

var drawAcceleration = function(x,y,self) {
    dbPrint("Drawing " + self.ID + "'s Thrust");
    var angle = Math.atan2(self.aX,-self.aY);
    ctx.translate(self.viewX,self.viewY);
    ctx.rotate(angle);
    dbPrint(self.ID + "'s torch cycle at " + self.torchCounter);
    if (self.torchCounter < self.torchCounterStart)
    {
	// should never get here
	self.torchCounter = self.torchCounterStart - 1; // added back at end
    }
    else if (self.torchCounter < -self.torchFactor)
    {
	ctx.drawImage(burner,0,0,20,50,x-10,y,20,50);
    }
    else if (self.torchCounter < 0) 
    {
	ctx.drawImage(burner,20,0,20,50,x-10,y,20,50);
    }
    else if (self.torchCounter < self.torchFactor) 
    {
	ctx.drawImage(burner,40,0,20,50,x-10,y,20,50);
    }
    else if (self.torchCounter < 2 * self.torchFactor) 
    {
	ctx.drawImage(burner,60,0,20,50,x-10,y,20,50);
    }
    else {
	// should never get here 
	self.torchCounter = self.torchCounterStart - 1; // added back at end
    }
    self.torchCounter = (self.torchCounter + 1) % (2 * self.torchFactor);
    ctx.rotate(-angle);
    ctx.translate(-self.viewX,-self.viewY);
    
}
var circle = function(cx,cy,radius) {
	ctx.arc(cx,cy,radius,0,2*Math.PI, true);
}

var drawDisc = function(locX,locY,radius,color) {
    ctx.beginPath();
//    ctx.fillRect(locX,locY,radius,radius)
    ctx.arc(locX,locY,radius,0,2*Math.PI, true);
    ctx.fillStyle = color;
    ctx.fill();
}

var checkFlagPickUp=function(picker,pickee) {
	var d=Math.sqrt(Math.pow(picker.x-pickee.x,2)+Math.pow(picker.y-pickee.y,2));
	if (d<picker.radius) pickUpFlag(picker,pickee);
}

var pickUpFlag=function(picker,pickee) {
	pickee.stolen=true;
}

var knockFlag=function(knockee) {
	knockee.stolen=false;
}

var Base=function(player,baseEdge) {
	this.edge=baseEdge;
	this.x=player.homeX;
	this.y=player.homeY;
	this.color=player.color;
	
}
var drawBase=function(onPlayer,drawnBase) {
	//no idea why it works, thought I'm only 10% through finishing it and it works
	ctx.fillStyle=drawnBase.color;
	ctx.globalAlpha=0.5;
	if ((Math.abs(onPlayer.x-drawnBase.x)<=(drawnBase.edge/2+250))&&(Math.abs(onPlayer.y-drawnBase.y)<=(drawnBase.edge/2+250))) { 
					ctx.fillRect(onPlayer.viewX-drawnBase.edge/2-onPlayer.x+drawnBase.x,onPlayer.viewY-drawnBase.edge/2-onPlayer.y+drawnBase.y,drawnBase.edge,drawnBase.edge);
	
		}
	ctx.globalAlpha=1;
}

var checkFlagDropOff=function(dropper,dropee,dropsite) { //can't get the range right, too sleepy to fix
	if (((Math.abs(dropper.x-dropsite.x))<(dropsite.edge-dropper.radius))&&((Math.abs(dropper.y-dropsite.y))<(dropsite.edge-dropper.radius))&&(dropee.stolen)) FlagDropOff(dropper,dropee);
}
var FlagDropOff = function(dropper,dropee) {
	dropee.stolen=false;
	dropper.score++;
}
var drawEdge= function(player) {
    var size = edgeSize; //50 pixels
    var displayRange = 250;
    var displaySize = 2*displayRange;
    var mapWidth = 3000; // a fact -> should be stored less locally and derived
    var mapHeight = 3000; // similarly
    var x;
    var y;
    var debugString = player.ID + " is near the ";
    ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
    ctx.translate(player.viewX,player.viewY);
    // left or right edges
    if (player.x < (displayRange + size)) {
	ctx.fillRect(-player.x, -displayRange, size, displaySize);
	dbPrint(debugString + "left.");
    }
    else if (player.x > (mapWidth - (displayRange + size))) {
	ctx.fillRect(mapWidth - player.x - size, -displayRange, size, displaySize);
	dbPrint(debugString + "right.");
    }
    // top or bottom edges
    if (player.y < (displayRange + size)) {
	ctx.fillRect(-displayRange, -player.y, displaySize, size);
	dbPrint(debugString + "top.");
    }
    else if (player.y > (mapHeight - (displayRange + size))) {
	ctx.fillRect(-displayRange, mapHeight - player.y - size, displaySize, size);
	dbPrint(debugString + "bottom.");
    }
    ctx.translate(-player.viewX,-player.viewY);
}
var edgeSlow = function(player) {
    var size = edgeSize;
    var mapWidth = 3000;
    var mapHeight = 3000;
    if ( (player.x < size) || (player.x > (mapWidth - size)) || 
	 (player.y < size) || (player.y > (mapHeight - size)) ) {
	player.vX *= (3/4);
	player.vY *= (3/4);
    }
}

var updater = function() {
    dbPrint("Elapsed Time: " + (gameTime/1000));
    if (isGameOver()) {
	gameOver();
	return 0;
    }
    dbPrint(intervalCounter++);
    dbPrint(keys);
 
    // Flush acceleration
    A.aX = 0;
    A.aY = 0;
    B.aX = 0;
    B.aY = 0;

    // Caution, key checks use the default, falsy evaluation! 

    // A's movement
    if (keys[65]) {A.aX -= A.a} // A Key
    if (keys[68]) {A.aX += A.a} // D Key
    if (keys[83]) {A.aY += A.a} // S Key
    if (keys[87]) {A.aY -= A.a} // W Key

    // B's movement
    if (keys[37]) {B.aX -= B.a} // Left Arrow
    if (keys[38]) {B.aY -= B.a} // Up Arrow
    if (keys[39]) {B.aX += B.a} // Right Arrow
    if (keys[40]) {B.aY += B.a} // Down Arrow
    
    // Resolve acceleration to new velocity
    A.vX += A.aX;
    A.vY += A.aY;
    B.vX += B.aX;
    B.vY += B.aY;

    // Resolve velocity to new position
    A.x+=A.vX;
    A.y+=A.vY;
    B.x+=B.vX;
    B.y+=B.vY;

    edgeSlow(A);
    edgeSlow(B);

    dbPrint(A);
    dbPrint(aF);
    dbPrint(B);
    dbPrint(bF);

    //*********calculations before clearing the picture********
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //**********start drawing after this************
    
    ctx.fillStyle = "#0000FF";

    // Backgrounds
    drawBG(A.x,A.y,50,50);
    drawBG(B.x,B.y,650,50);
	
    //Bases
    drawBase(A,BBase);
    drawBase(B,ABase);
    drawBase(A,ABase);
    drawBase(B,BBase);
    
    // Speed-limiting edge around map
    drawEdge(A);
    drawEdge(B);
    
    // Players
    drawDisc(A.viewX, A.viewY , A.radius, A.color);
    drawDisc(B.viewX, B.viewY , B.radius, B.color);

    // Enemies if they should be visible
    drawEnemy(A,B,300,300);
    drawEnemy(B,A,900,300);
    
    // draws flags on top of players if applicable
    aF.drawFlag(A);
    aF.drawFlag(B);
    bF.drawFlag(A);
    bF.drawFlag(B);

    // Draw borders and cover any enemy overlap
    ctx.strokeRect(50, 50, 500, 500);
    ctx.strokeRect(650, 50, 500, 500);
	
    checkFlagPickUp(A,bF);
    checkFlagPickUp(B,aF);
    
    checkFlagDropOff(A,bF,ABase);
    checkFlagDropOff(B,aF,BBase);
	
    var collision=checkCollision(A,B);
    if (collision!="no collision") { 
	if ((collision===A.ID)&&(aF.stolen)) knockFlag(aF);
	if ((collision===B.ID)&&(bF.stolen)) knockFlag(bF);
    }
    
    checkWallCollision(A);
    checkWallCollision(B);
    
    drawPointer(0,-200,A,B);
    drawPointer(0,-200,B,A);

    var epsilon = 10;

    if (Math.sqrt(Math.pow(A.vX,2) + Math.pow(A.vY,2)) >= epsilon) {
	drawHeading(0,-100,A);
    }
    if (Math.sqrt(Math.pow(B.vX,2) + Math.pow(B.vY,2)) >= epsilon) {
        drawHeading(0,-100,B);
    }

    dbPrint("A.aX = " + A.aX + ", A.aY = " + A.aY);
    dbPrint("B.aX = " + B.aX + ", B.aY = " + B.aY);
    
    dbPrint("A's torch shutoff: " + A.torchShutoffCounter + "/" + A.torchShutoffLimit);
    dbPrint("B's torch shutoff: " + B.torchShutoffCounter + "/" + B.torchShutoffLimit);

    if (Math.sqrt(Math.pow(A.aX,2) + Math.pow(A.aY,2)) !== 0) {
	drawAcceleration(0,20,A);
    }
    else {
	A.torchCounter = A.torchCounterStart;
    }
    if (Math.sqrt(Math.pow(B.aX,2) + Math.pow(B.aY,2)) !== 0) {
        drawAcceleration(0,20,B);
    }
    else {
	B.torchCounter = B.torchCounterStart;
    }

	
    //covering leaks
    ctx.drawImage(border,0,0,1200,600);
    ctx.fillStyle = "rgb(50, 60, 70)";
    ctx.fillRect(525,10,70,30);
    drawScore(A,560,35);
    ctx.fillStyle = "rgb(50, 60, 70)";
    ctx.fillRect(605,10,70,30);
    drawScore(B,640,35);
    ctx.fillStyle = "rgb(50, 60, 70)";
    ctx.fillRect(550,559,100,30);
    displayTime();
    gameTime += interval;
}

function drawScore(player,x,y) {
    score = player.score;
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = player.color;
    dbPrint(player.ID + "'s score is" + score);
    ctx.fillText(score,x,y);
}

function onKeyDown(event) {
    keys[event.keyCode] = 1;	
    dbPrint(keys);
}

function onKeyUp(event) {
    keys[event.keyCode] = 0;
    dbPrint(keys);
}
function displayTime() {
    var timeRemaining;
    var timeString;
    ctx.font = "30px Arial"; // use 8-bit-y font
    ctx.textAlign = "center";
    ctx.fillStyle = "green";
    ctx.strokeStyle = "black";
    timeRemaining = timeLimit - gameTime;
    minRemaining = Math.floor(timeRemaining / 60000);
    if (minRemaining === 0) minRemaining = "";
    secRemaining = Math.floor((timeRemaining % 60000) / 1000);
    if (secRemaining < 10) secRemaining = "0" + secRemaining;
    timeString = minRemaining + ":" + secRemaining;
    dbPrint("Timer should read " + timeString);
    ctx.fillText(timeString,595,585);
    ctx.strokeText(timeString,595,585);
}

function isGameOver() {
    return (gameTime >= timeLimit);
}

/* from: 
   https://developer.mozilla.org/en-US/docs/Canvas_tutorial/Drawing_shapes */
function roundedRect(x,y,width,height,radius){
    ctx.beginPath();
    ctx.moveTo(x,y+radius);
    ctx.lineTo(x,y+height-radius);
    ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
    ctx.lineTo(x+width-radius,y+height);
    ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
    ctx.lineTo(x+width,y+radius);
    ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
    ctx.lineTo(x+radius,y);
    ctx.quadraticCurveTo(x,y,x,y+radius);
    ctx.stroke();
    ctx.fill();
}

function gameOver() {
    dbPrint("Game over!");
    var winner;
    var winnerColor;
    if (A.score > B.score) {
	winner = A.name;
	winnerColor = A.color;
	dbPrint("Winner's name is " + winner);
    }
    else if (B.score > A.score) {
	winner = B.name;
	winnerColor = B.color;
	dbPrint("Winner's name is " + winner);
    }
    else {
	winner = "Nobody";
	winnerColor = "rgb(20, 30, 40)";
	dbPrint("Winner's name is "+ winner);
    }
    winner = winner + " wins!";
    ctx.font = "60px Arial"; // use 8-bit-y font
    ctx.textAlign = "center";
    ctx.strokeStyle = "white";
    dbPrint("Winner is " + winner + ", " + A.score + " to " + B.score);
    dbPrint("Winner is supposed to be printed as " + winner);
    ctx.fillStyle = "rgb(20, 30, 40)";
    ctx.fillRect(0,0,screenWidth,screenHeight);
    ctx.fillStyle = "rgb(180,180,200)"
    roundedRect(150,75,900,450,30);
    ctx.fillStyle = winnerColor;
    roundedRect(175,100,850,400,30);
    ctx.strokeText(winner, screenWidth/2, screenHeight/2);
}
var updaterLoadScreen=function(){
		ctx.drawImage(loadscreen,0,0);
}
var loadOff=function() {
    ctx.fillRect(0,0,1200,600);
    screen=1;
    textPlayer1 = document.getElementById("player1");
    textPlayer1.style.visibility="hidden";
    textPlayer2 = document.getElementById("player2");
    textPlayer2.style.visibility="hidden";
    textPlayer1m = document.getElementById("player1mass");
    textPlayer1m.style.visibility="hidden";
    textPlayer2m = document.getElementById("player2mass");
    textPlayer2m.style.visibility="hidden";
    button = document.getElementById("button1");
    button.style.visibility="hidden";
    if (textPlayer1.value === "Insert name") {
	A.name = "Player 1";
    }
    else {
	A.name = textPlayer1.value;
    }
    if (textPlayer2.value === "Insert name") {
        B.name = "Player 2";
    }
    else {
	B.name = textPlayer2.value;
    }
    A.radius=eval(textPlayer1m.value);
    B.radius=eval(textPlayer2m.value);
    A.mass=massDensity*Math.PI*Math.pow(A.radius,2);
    B.mass=massDensity*Math.PI*Math.pow(B.radius,2);
    A.a=500/A.mass;
    B.a=500/B.mass;
    canvas.setAttribute('tabindex','0');
    canvas.focus();
	
}
var screenManager= function(){
	
	switch (screen) {
		case 0: { updaterLoadScreen();
		break;
		}
		case 1: { updater();
		break;
		}
	}
	
}

function main() {
    debugMode = true;
    canvas = document.getElementById("myCanvas");
	
    ctx = canvas.getContext("2d");
    tempctx = canvas.getContext("2d");
    intervalCounter = 0;

    keys = new Object;

    canvas.addEventListener('keydown',onKeyDown,false);
    canvas.addEventListener('keyup',onKeyUp,false);
    

    fieldWidth = 3000;
    fieldHeight = 3000;
    screenWidth = 1200;
    screenHeight = 600;
    fieldOffset = 100;
    drawOffset = 300;
    A = new player(fieldOffset, fieldHeight - fieldOffset,
		   drawOffset, screenHeight - drawOffset, 20, "A");
    B = new player(fieldWidth - fieldOffset, fieldOffset,
		   screenWidth - drawOffset, drawOffset, 20,"B");
    ABase = new Base(A,fieldOffset);
    BBase = new Base(B,fieldOffset);
    aF = new flag(A.x, A.y, A, B, "rgb(100, 0, 0)");
    bF = new flag(B.x, B.y, B, A, "rgb(0, 0, 100)");
    edgeSize = 50;
    dbPrint(aF);
    dbPrint(bF);
    background = new Image();
    background.src = "./assets/starmap.jpg";
    burner = new Image();
    burner.src = "./assets/burner.png";
    border = new Image();
    border.src = "./assets/border.png";
    loadscreen= new Image();
    loadscreen.src= "./assets/loadscreen.png";
    dbPrint(background);
    gameTime = 0;
    /* millisecnds * seconds/minute * minutes */
    timeLimit = (1000) * (60) * (2);
    interval= 33;
    intervalID = setInterval(screenManager,interval);
    
    
}

main();