var current_running_time, backdrop, viewpoint, model, mainStage, pointLight, ambientLight, modelFrame, modelTexture;
var	ns4, ie4;
var code_path = "";

var trash  = new Array();
var numOfAst, numOfStars, debris_enabled, sound_enabled, lights;
function refreshNetscape()
{
	if (document.layers)
		location.reload();
}

var collision_objects = new Array();
function CreateScene()
{
	ns4 = (document.layers)? true : false;
	ie4 = (document.all)   ? true : false;

	if ( !ie4 && !ns4 ) return; // Go away, we don't work on these

	// LOAD COOKIES!
	numOfAst   	   = GetCookie("Asteroidz_numbers") * 1;
	numOfStars 	   = GetCookie("Asteroidz_density") * 1;
	debris_enabled = (GetCookie("Asteroidz_space_trash") == "true") ? true : false;
	lights 		   = (GetCookie("Asteroidz_lasers_on") == "true") ? true : false;
	sound_enabled  = (GetCookie("Asteroidz_sound_on") == "true") ? true : false;

	// set up variables depending on browser:
	scene = (ie4) ? wtScene : document.posdiv.document.embeds["wtScene"];

	bgColor = document.bgColor;

	ver4012 = ( "1.0.4.12 Beta 2".indexOf(scene.getVersion()) == 0 );
	ver10528 = ( "1.0.5.28".indexOf(scene.getVersion()) == 0);
	
	var hexVal = new hexValueObj( bgColor ); // Used for the bgcolor of scene backdrop.
	

	// Create the main Stage.  The world is but a stage:
	mainStage = scene.createStage();

	// Create the camera:
    viewpoint = mainStage.createCamera();
    viewpoint.setViewRect( 0, 0, 500, 500 );
	scene_width = 500;
	scene_height = 500;
	scene.start();

	// Create the Starfield and ship:
	CreateShip();
	CreateStarfield();
	
	// Create Ka-Boom! (animation that plays when a lazer hits):
	createDirectHit();

	// Set up the camera and run the scene:
	current_running_time = 0;
	
	scene.setNotifyRenderEvent(true);
	scene.setNotifyKeyboardEvent(true);
	if (ns4) {
		scene.setOnRenderEvent("UpdateWorld");
		scene.setOnKeyboardEvent("keyboard");
	}
	scene.focus();
//	setInterval("CheckCollision();", 100);
}

function keyboard(e) {e.getKeyState() ? Key_Down(e) : Key_Up(e);}

var ships = new Array();
function CreateShip()
{
	// Create the model:
	self.status = "Creating Starship . . .";
	ships[0] = new StarWarsShip("Beretta");
	setCurrentShip( 0 );
	if (debris_enabled)
		setInterval("CheckTrash();", 1000);
}

function setCurrentShip( shipNum ) {
	// Set the view in this object:
	current_ship = ships[ shipNum ];
	current_ship.setView();
}


function CreateStarfield()
{
	// Create the surrounding spacefield:
	space = scene.createGroup();
	mainStage.addObject( space );
	spaceGroup  	  = scene.createGroup();
	obj_placement_Pos = scene.createGroup();
	mainStage.addObject( spaceGroup );
	spaceGroup.addObject( obj_placement_Pos );
	
	switch (numOfStars) {
		case 0: // High Density:
			numOfStars = 200; 
			break;
		case 1: // Medium Density:
			numOfStars = 100;
			break;
		case 2: // Low Density:
			numOfStars = 50;
			break;
	}
	for (i = 0; i < numOfStars; i++)
		new star_plotter();

	// Create the debris:
	if ( debris_enabled ) {
		self.status = "Creating Space Debris . . . ";
		var numOfDeb = 10;
		for (i = 0; i < numOfDeb; i++)
			trash[i] = new Debris();
	}

	// Create the asteroid belt:
	self.status = "Creating Asteroid Belt . . .";
	switch (numOfAst) {
		case 0: // Lots:
			numOfAst = 30;
			break;
		case 1: // Some:
			numOfAst = 20;
			break;
		case 2: // Not Lots:
			numOfAst = 10;
			break;
	}

	asteroidz = new Array();
	for (i = 0; i < numOfAst; i++)
		asteroidz[i] = new Asteroid(i);

	// Create lights:
	ambientLight = scene.createLight(0);	//tWTLightAmbient
	pointLight 	 = scene.createLight(1);	//tWTLightPoint
    mainStage.addObject(ambientLight);
    mainStage.addObject(pointLight);
    pointLight.setPosition( 2, 0, -5  );
	ambientLight.setColor ( 192, 192, 192 );
}

/**************************************************************/
function UpdateWorld( event )
{
	newTime = event.getInterval();

//	if (newTime == 0) { // For NETSCAPE:
//		var d = new Date();

//		current_running_time = d.getTime();
//	} else 
		current_running_time += newTime;

	current_ship.update_ship();
	DriftAsteroidz();
}
function CheckTrash()
{
	for (i = 0; i < trash.length; i++)
		trash[i].check_pos();
}

function inBoundingBox( point1, point2 )
{
	if (point2.getX() < point1.x+3 && point2.getX() > point1.x-3 && 
		point2.getY() < point1.y+3 && point2.getY() > point1.y-3 && 
		point2.getZ() < point1.z+3 && point2.getZ() > point1.z-3)
		return true;
	return false;
}

function getDistanceSquared( point1, point2 )
{
		tmpx=point1.x - point2.getX();
		tmpy=point1.y - point2.getY();
		tmpz=point1.z - point2.getZ();
		return ( tmpx*tmpx + tmpy*tmpy + tmpz*tmpz);
}

// This is not used any more
function CheckCollision() {
	// Check ship-to-asteroidz' collision:
	for (i = 0; i < ast_position.length; i++)
		if (inBoundingBox(current_ship.current_position, ast_position[i] )) {
			if ( getDistanceSquared(current_ship.current_position, ast_position[i]) <= current_ship.collision_radius + collision_objects[i+1].collision_radius ) {
				self.status = "BOOM!";
			}
		}
}

var ast_position = new Array();
function DriftAsteroidz()
{
	for (i = 0; i < asteroidz.length; i++) {
		asteroidz[i].drift();
		ast_position[i] = asteroidz[i].ast_frame.getAbsolutePosition();
		
	}
	
}

/**************************************************************/
function Key_Down( e )
{
	var code = e.getKey();
	switch (code) {
		case (ie4) ? 72 : 104: // H: Hit it Chewy!
			current_ship.throttle		= 200;
			current_ship.speed			= 500;
			current_ship.MaxRollAngle 	= 10; 
			current_ship.MaxPitchAngle 	= 10;
//				setInterval("hyperspace.play();", 33);
			break;

		/* BEGIN THROTTLE CONTROLS */
		case 113: // F2: Version info:
			alert("StarWars Space Adventure 1.0\nPresented By WildTangent\n");
			break;
		case 187: // +: Increase throttle by 1:
//				if (throttle < 100)
				current_ship.throttle += 1;
			break;
		case 189: // -: Decrease throttle by 1:
			if (current_ship.throttle > 0)
				current_ship.throttle -= 1;
			break;
		case 65: // A: Increase throttle:
			current_ship.throttleUp = true;
			break;
		case 90: // Z: Decrease throttle:
			current_ship.throttleDown = true;
			break;
		case 219: // [: 1/3 throttle:
			current_ship.throttle = 33;
			break;
		case 221: // ]: 2/3 throttle:
			current_ship.throttle = 66;
			break;
		case 8: // Backspace: Full Throttle:
			current_ship.throttle = 100;
			break;
		case 220: // \: Full Stop:
			current_ship.throttle = 0;
			break;
		/* END THROTTLE CONTROLS */
			
		case 16: // Shift: toggle barrel roll:
			if (!current_ship.barrelRoll)
				current_ship.toggleBarrelRoll(true);
			break;

		case 86: // V : change views.
			current_ship.setView();
			break;

		case 37:	// Left-arrow key:
				current_ship.rollLeft  = true;
			break;
		
		case 39: // Right-arrow key:
				current_ship.rollRight = true;
			break;

		case 38: // Up-arrow key:
				current_ship.pitchUp = true;
			break;
		
		case 40: // Down-arrow key:
				current_ship.pitchDown = true;
			break;
		
		case 88: // "X" -- toggle link cannons.
			current_ship.linkedCannons = !current_ship.linkedCannons;
			break;
		
		case 32: // Spacebar-- "FIRE AWAY!":
			if (!current_ship.fire) 
				current_ship.fire = true;
			break;
		case 81: // Q: Quit.
			if (confirm("Are You Sure You Want To End The Mission?"))
				self.close();
			break;
	}
}

function Key_Up( e )
{
	var code = e.getKey();
	switch (code) {
		case 65: // A: Increase throttle:
			current_ship.throttleUp = false;
			break;
		case 90: // Z: Decrease throttle:
			current_ship.throttleDown = false;
			break;

		case 37: // Left-arrow key.
		current_ship.rollLeft 		  = false;
		current_ship.rollLeftMomentuum = true;
		break;

		case 39: // Right-arrow key.
		current_ship.rollRight 			= false;
		current_ship.rollRightMomentuum 	= true;
		break;
		
		case 38: // Up-arrow key.
		current_ship.pitchUp = false;
		current_ship.pitchUpMomentuum = true;
		break;
		
		case 40:// Down-arrow key.
		current_ship.pitchDown = false;
		current_ship.pitchDownMomentuum = true;
		break;

		case 16: // Shift: toggle barrel roll:
		current_ship.toggleBarrelRoll(false);
		break;

		case 32:// Spacebar -- Stop Firing!
		current_ship.fire = false;		
		break;
	}
}
/******************************************************************************************
 * UTILITY FUNCTIONS:
 *****************************************************************************************/
function degreetorad(d) {return (Math.PI * d) / 180;}
function radtodegree(r) {return r * (180.0 / Math.PI);}
function hexValueObj( hexValue )
{
	var r,g,b;
	this.r = hex2RGB( hexValue.substring(1, 3));
	this.g = hex2RGB( hexValue.substring(3, 5));
	this.b = hex2RGB( hexValue.substring(5, 7));
}
	
function hex2RGB( hValue )
{
	var firstValue, secondValue;
	var hexValues = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" ];

	// we only accept values of 2 numbers here:
	if (hValue.length != 2)
		return 0;
		
	// Find out what the value of the first character is:
	firstValue = hValue.substring( 0, 1 );
	for (i = 0; i < hexValues.length; i++)
		if ( hexValues[i] == firstValue)
			firstValue = i * 16;

	// Find out what the value of the second character is:
	secondValue = hValue.substring( 1, 2 );
	for (i = 0; i < hexValues.length; i++)
		if ( hexValues[i] == secondValue)
			secondValue = i;

	return firstValue + secondValue;
}

var typing = false;
function Easter_EGG()
{
	var code=window.event.keyCode;
	switch (code) {
		case 116:
			typing = true;
			setTimeout("stopType();",1000);
			break;
	}
}

function stopType()
{
}