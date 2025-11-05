var ast = null;
function Asteroid( id )
{
	/* Define functions for this object: */
	this.drift = drift;

	function drift()
	{
		this.cur_drift_pos += this.velocity;
		this.ast_frame.setPosition( 0,0, this.cur_drift_pos);
		if (this.cur_drift_pos > 300)
			this.cur_drift_pos = 0;
	}
	this.ID = id;

	var astDistance = 60, astMinDistance = 10, minSize = 3, addSize = 3;
	if (ast == null) { // Make sure the asteroid loads ONCE:
		ast 	= scene.createModel( code_path + "model/asteroid.wt" );
		ast_tex = scene.createBitmap( code_path + "model/asteroid_gray.wjp");
		ast.setColor(60,60,60);
	}
	this.ast_group = scene.createGroup();
	mainStage.addObject( this.ast_group );
	
	this.asteroid 	= ast;
	this.ast_frame 	= scene.createContainer();
	this.ast_frame.attach( this.asteroid );

	this.asteroid.setTexture( ast_tex );
	this.ast_group.addObject( this.ast_frame );
		
	place_object( this.ast_group, (Math.random() * astDistance) + astMinDistance ); // Places the asteroid @ a random pos around the craft.
	this.ast_group.setRotation((Math.random() - .5) * 1000,(Math.random() - .5) * 1000,(Math.random() - .5) * 1000,(Math.random() - .5) * 1000);
	this.ast_frame.setConstantRotation( ((Math.random() - .5) * 10), ((Math.random() - .5) * 25), ((Math.random() - .5) * 50), ((Math.random() - .5) * 110) );
	this.cur_drift_pos = 0;
	this.velocity = (Math.random() * .2);
	
	
	// Add this puppy to the collision list:
	this.collision_radius = 1.8*1.8;
	this.collision_id	  = collision_objects.length;
	this.collision_posObj = this.ast_frame;
	collision_objects[ collision_objects.length ] = this;
}
var hit 	 = new Array();
var hitframe = new Array();
var current_hit_frame = 1;
function createDirectHit()
{
	hit_group = scene.createGroup();
	mainStage.addObject( hit_group );
	for (i = 1; i <= 6; i++)
	{
		hitframe[i] = scene.createContainer();
		hit[i]	 	= scene.createBitmap( code_path + "images/explode/ex" + i + ".wpg" );
		hit[i].setColorKey(0,0,0);
		hitframe[i].attachBitmap( hit[i], 5,5, 32,32);
		hit_group.addObject(hitframe[i]);
		hit_group.removeObject(hitframe[i]);
	}
}

function playDirectHit()
{
	var frames_in_animation = 6;
	if (current_hit_frame > 1)
		hit_group.removeObject( hitframe[current_hit_frame - 1] );

	if (current_hit_frame < frames_in_animation) {
		hit_group.addObject( hitframe[current_hit_frame++] );	
		setTimeout("playDirectHit();", 100);
	} else
		current_hit_frame = 1;
}

function Debris()
{
	/* Define functions for this object: */
	this.check_pos = check_pos;

	var debrisDistance, debrisMinDistance, boundBox, debrisVector, shipVector, masterVector;

	this.debrisDistance 	= 15;
	this.debrisMinDistance 	= 1;
	this.boundBox 			= 10;

	// Reposition this peice if it's out of cockpit view:
	function check_pos()
	{
		if ( ver4012 )
		{
			if (!current_ship.battleCam)
				debrisVector=this.debris_frame.getPosition();
			shipVector=current_ship.positionGroup.getPosition();
		}
		else
		{
			if (!current_ship.battleCam)
				debrisVector=this.debris_frame.getAbsolutePosition();
			shipVector=current_ship.positionGroup.getAbsolutePosition();
		}
		if ( (debrisVector.getX() < shipVector.getX() - this.boundBox) || (debrisVector.getX() > shipVector.getX() + this.boundBox) || (debrisVector.getY() < shipVector.getY() - this.boundBox) || (debrisVector.getY() > shipVector.getY() + this.boundBox) || (debrisVector.getZ() < shipVector.getZ() - this.boundBox) ) {
				var forwardVec, upVec;
				masterVector=current_ship.masterGroup.getAbsolutePosition();
				this.trashMaster.setPosition ( masterVector.getX(), masterVector.getY(), masterVector.getZ());
				forwardVec  = current_ship.shipGroup.getOrientationVector();
				upVec 		= current_ship.shipGroup.getOrientationUp();
				this.trashMaster.setOrientation( 0, 1, 0, 0 );
				this.trashMaster.setOrientationVector( forwardVec.getX(), forwardVec.getY(), forwardVec.getZ(), upVec.getX(), upVec.getY(), upVec.getZ() );
				this.trashGroup.setPosition( ((Math.random() - .5) * this.debrisDistance), ((Math.random() - .5) * this.debrisDistance), (this.boundBox + 5 + (Math.random()) * this.debrisDistance));
		}
	}
	
	this.trashMaster = scene.createGroup();
	this.trashGroup  = scene.createGroup();
	mainStage.addObject  ( this.trashMaster );
	this.trashMaster.addObject( this.trashGroup  );

	this.debris = scene.createModel( code_path + "model/trash0" + Math.round(1 + Math.random() * 2) + ".wt" );
	this.color = Math.random() * 100;
	this.debris.setColor(this.color, this.color, this.color + Math.random() * 20);
	this.debris.setScale(.1,.1,.1);

	this.debris_frame = scene.createContainer();
	this.trashGroup.addObject( this.debris_frame );
	this.debris_frame.attach( this.debris );

	// Position the object @ a random location around the craft:
	place_object( this.trashGroup, (Math.random() * this.debrisDistance) + this.debrisMinDistance );
	this.debris_frame.setConstantRotation( ((Math.random() - .5) * 10), ((Math.random() - .5) * 25), ((Math.random() - .5) * 50), ((Math.random() - .5) * 1000) );
}

var star = null;
function star_plotter()
{
	if (star == null) {
		star = scene.createBlankBitmap(5,5);
		star.setColor(150,150,150);
	}

	this.star = star;
	this.star_plot  = scene.createContainer();
	this.star_plot.attachBitmap( this.star, 3,3, 0,0 );
	space.addObject( this.star_plot );
	this.star_plot.setPosition(Math.random()*1000-500,Math.random()*1000-500,Math.random()*1000-500);
	place_object( this.star_plot, 1000); // Plots the star @ 1000 units away on a random vector.
}

// Used to position objects around the scene @ random locations:
function place_object(object, distance)
{
	var obj_vector;
	obj_placement_Pos.setPosition(0,0,0);
	spaceGroup.setRotation((Math.random() - .5) * 1000,(Math.random() - .5) * 1000,(Math.random() - .5) * 1000,(Math.random() - .5) * 1000);
	obj_placement_Pos.setPosition(0,0, distance);
	obj_vector = obj_placement_Pos.getAbsolutePosition();	
	object.setPosition( obj_vector.getX(), obj_vector.getY(), obj_vector.getZ() );
}


// Create the weapon bank that holds the numerous projectiles within it.
function WeaponBank(in_ship, weapontype, posX, posY, posZ)
{
	/* Define functions for this object: */
	this.Fire	  = Fire;
	this.setReady = setReady;

	this.parent_ship = in_ship;

	// Move the created lasers inside this bank:
	function Fire(bankNumber, startTime)
	{
		if (this.ready) {
			// Set this bank to ready in the correct time:
			this.ready = false;
			this.parent_ship.NotReady( bankNumber );
			setTimeout("ships[" + this.parent_ship.ship_ID + "].weaponBank[" + bankNumber + "].setReady();", this.timeBetweenShots * ((this.parent_ship.linkedCannons) ? 2500 : 1000));

			if ( startTime == 0 )
				startTime = current_running_time; // This is set if it's single fire.  The dual shots are shot at the same time.
			
			with (this.projectiles[this.activeWeapon]) {
				var vec, upvec, forvec;
				this.parent_ship.laserPos.setPosition( 0, 0, weaponDuration * (this.parent_ship.speed + (moveToDist / weaponDuration )) );
				if ( ver4012 ) // Old API
				{
					vec		 	 = this.originGroup.getPosition();
					origin  	 = new D3dVector( vec.getX(), vec.getY(), vec.getZ() );
					vec			 = this.parent_ship.laserPos.getPosition();
				}
				else
				{
					vec		 	 = this.originGroup.getAbsolutePosition();
					origin  	 = new D3dVector( vec.getX(), vec.getY(), vec.getZ() );
					vec			 = this.parent_ship.laserPos.getAbsolutePosition();
				}
				moveToVector = new D3dVector(vec.getX(), vec.getY(), vec.getZ() );

				mainStage.addObject( weaponGroup );
				weaponGroup.setOrientation(0,1,0,0);

				upvec  = this.parent_ship.shipGroup.getOrientationUp();
				forvec = this.parent_ship.shipGroup.getOrientationVector();
				weaponGroup.setOrientationVector( forvec.getX(), forvec.getY(), forvec.getZ(), upvec.getX(), upvec.getY(), upvec.getZ() );
				weaponGroup.setPosition( origin.x, origin.y, origin.z );

				start 	 	= startTime;
				firing		= true;
				if (lights)
					weaponLight.setColor(lightColor.r,lightColor.g,lightColor.b);
			}
			this.activeWeapon = (this.activeWeapon + 1) % this.numOfShots;
		}
	}

	// This function tells the world that this weapon bank is ready to fire its next shot:
	function setReady()	{
		this.parent_ship.Ready(this.parent_ship.activeBank);
		this.parent_ship.activeBank = (this.parent_ship.activeBank + 1) % this.parent_ship.numOfWeaponBanks;
		this.ready = true;
	}

	// Initialize variables:
	var type, ready, activeWeapon, origin, numOfShots, projectiles, timeBetweenShots, originVector;
	this.type			= weapontype; // Type: 0 = laser, 1 = ion cannons, 2 = missle.
	this.ready			= true;
	this.activeWeapon 	= 0;
	this.numOfShots 	= 6;
	this.projectiles	= new Array();
	this.originGroup	= scene.createGroup();
	in_ship.shipGroup.addObject( this.originGroup );
	this.originGroup.setPosition( posX, posY, posZ ); // Used to reset the lazer.
	if ( ver4012 ) // Old API
		originVector=this.originGroup.getPosition();
	else
		originVector=this.originGroup.getAbsolutePosition();
	this.origin 		= new D3dVector( originVector.getX(),originVector.getY(),originVector.getZ() );

	// Set the amount of time between shots, in seconds:
	switch (this.type)
	{
		case 0: // Lasers
		case 1: 
		case 2: // Ions
			this.timeBetweenShots = .25;
			break;
		case 3: // Warheads
			this.timeBetweenShots = 1;
			break;
	}
	
	for (i = 0; i < this.numOfShots; i++) {// Create the actual projectiles.
		this.projectiles[i] = new Projectile( this.parent_ship, this.type, this.origin );
		in_ship.junkBin.addObject( this.projectiles[i].weaponGroup );
	}
}

var laser_model = null, laser_tex = null;
function Projectile( ship, weapontype, originVec )
{
	/* Define functions for this object: */
	this.Fire		= Fire;
	this.stop_fire	= stop_fire;
	
	var IntervalID, start;
	// Move a projectile for a set distance for a duration in seconds:
	this.start 		= null;
	this.parent_ship= ship;
	function Fire()
	{
		// Determine the appropriate distance to be at:
		with ( this ) {
			var newX = origin.x - ((current_running_time - start ) / (weaponDuration * 1000)) * ( origin.x - moveToVector.x );
			var newY = origin.y - ((current_running_time - start ) / (weaponDuration * 1000)) * ( origin.y - moveToVector.y );
			var newZ = origin.z - ((current_running_time - start ) / (weaponDuration * 1000)) * ( origin.z - moveToVector.z );
			weaponGroup.setPosition( newX, newY , newZ );
		}

		var vec = new D3dVector(newX, newY, newZ);
		// See if any collision occured:
		for (k = 0; k < ast_position.length; k++)
//			if (inBoundingBox(vec, ast_position[k] )) {
				if ( getDistanceSquared( vec, ast_position[k] ) <= collision_objects[k + 1].collision_radius ) {
					current_ship.junkBin.addObject(collision_objects[k + 1].ast_group);
					hit_group.setPosition( vec.x, vec.y, vec.z);
					playDirectHit();
					
					this.stop_fire();
				}
//			}		
		// Continue this animation if the duration has not expired:	
		if ( current_running_time - this.start >= (this.weaponDuration * 1000) )
			this.stop_fire();
	}
	
	function stop_fire()
	{
		with ( this ) {
			firing = false;
			this.parent_ship.junkBin.addObject( weaponGroup );

			if (lights)
				weaponLight.setColor(0,0,0);
		}
	}

	var resetRollAngle, resetPitchAngle, firing, weaponMaster, weaponYaw, weaponPitch, weaponRoll, type, weapon, weaponGroup, weaponFrame, weaponLight, weaponColor, lightColor, weaponDuration, activeWeapon, origin,  moveToVector;

	// Determine how far the projectile will go, and how fast it travels:
	this.setBarrelRoll	= false;
	this.type 			= weapontype; // Type: 0 = laser, 1 = ion cannons, 2 = missle.
	this.origin 		= originVec;
	switch ( this.type ) {
		case 0: // Emperial Laser.
			this.weaponDuration	= 2; // Amount of time a lazer lasts, in seconds.
			this.weaponColor	= new Color( 0, 255, 10 );
			this.lightColor		= new Color( 0, 500, 50);
			this.moveToDist 	= 100;
			break;
		case 1: // Rebel Laser:
			this.weaponDuration	= 2; // Amount of time a lazer lasts, in seconds.
			this.weaponColor	= new Color( 255, 0, 10 );
			this.lightColor		= new Color( 500, 0, 25);
			this.moveToDist 	= 100;
			break;
		case 2: // Ion cannon.
			this.weaponDuration	= 1.5; // Amount of time a lazer lasts, in seconds.
			this.moveToDist 	= 65;
			break;
		case 3:	// Missle/torpedo.
			this.weaponDuration	= 60; // Amount of time a lazer lasts, in seconds.
			this.moveToDist 	= 500;
			break;
	}
	this.moveToVector = null;
	this.firing = false;

	// Create the projectiles' axis and add them to the scene.  These axis will be adjusted when fired:
	this.weaponGroup  = scene.createGroup();

	mainStage.addObject( this.weaponGroup );

	if (laser_model == null) {	
		laser_model	= scene.createModel( code_path + "model/laser.wt" );
		laser_model.setScale(1,1,1.75);
		laser_tex	= scene.createBitmap( code_path + "model/laser.wjp" );
		laser_model.setTexture( laser_tex );
	}
	
	this.weapon = laser_model;
//	this.weapon	= scene.createBox( .05, .05, 1.5 );
//	this.weapon.setColor( this.weaponColor.r, this.weaponColor.g, this.weaponColor.b );

	this.weaponFrame = scene.createContainer();
	this.weaponGroup.setPosition( this.origin.x, this.origin.y, this.origin.z );
	this.weaponGroup.addObject( this.weaponFrame );
	this.weaponFrame.attach( this.weapon );

	if (lights) {
		// Create the light for the weapon (dynamic lighting):		
		this.weaponLight = scene.createLight(1);	//tWTLightPoint
		this.weaponGroup.addObject( this.weaponLight );
		this.weaponLight.setColor(0,0,0);
		this.weaponLight.setConstantAttenuation(0.4);
		this.weaponLight.setLinearAttenuation(0.5);
	}
}

function PixelCoords( inx, iny )
{
	var x, y;
	this.x = inx;
	this.y = iny;
}

function D3dVector(inx, iny, inz)
{
	var x,y,z;
	this.x = inx;
	this.y = iny;
	this.z = inz;
}

function Color(inx, iny, inz)
{
	var r,g,b;
	this.r = inx;
	this.g = iny;
	this.b = inz;
}