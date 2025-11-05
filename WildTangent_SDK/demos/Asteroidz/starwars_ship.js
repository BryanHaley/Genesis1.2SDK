var ship_id = -1; // Used to call setTimeouts on ship objects.
function StarWarsShip( name )
{
	/* Define functions for this object: */
	this.update_ship		= update_ship;
	this.PositionCraft		= PositionCraft;	
	this.PitchCraft			= PitchCraft;
	this.RollCraft			= RollCraft;
	this.roll_ship			= roll_ship;
	this.pitch_ship			= pitch_ship;
	this.toggleBarrelRoll	= toggleBarrelRoll;
	this.position			= position;
	this.UpdateHUD 			= UpdateHUD;
	this.BattleCamHUD		= BattleCamHUD;
	this.Ready				= Ready;
	this.NotReady			= NotReady;
	this.Fire				= Fire;
	this.CheckWeapons		= CheckWeapons;
	this.setView			= SetView;

	/*********************************************************************************
	 * UPDATE SHIP'S WORLD
	 *********************************************************************************/
	// This function is called whenever the scene needs to update the position/orientation of the ship:
	function update_ship()
	{
		this.PositionCraft();
		this.UpdateHUD();
		this.RollCraft();
		this.PitchCraft();
		this.CheckWeapons();

		// Fire away!		 
		if (this.fire)
			this.Fire();
	}

	/*********************************************************************************
	 * BEGIN POSITIONING AND ORIENTATION CODE:
	 *********************************************************************************/
	var rollAngle, pitchAngle, laserPitch , laserRoll, barrelRoll, throttleUp, throttleDown, throttle, speed;
	this.rollAngle 		= 0;
	this.pitchAngle 	= 0;
	this.laserPitch 	= 0;
	this.laserRoll 		= 0;
	this.barrelRoll 	= false;
	this.throttleUp 	= false;
	this.throttleDown 	= false;
	this.throttle	 	= 0;
	this.speed 			= 0;
	
	function PositionCraft()
	{
		if ( this.throttleUp ) {
			this.throttle += 5;
			if ( this.throttle > 100 ) this.throttle = 100;
		}
		
		if ( this.throttleDown ) {
			this.throttle -= 5;
			if ( this.throttle < 0 ) this.throttle = 0;
		}
		
		var targetSpeed = Math.round((this.throttle * .01) * this.topSpeed);
		if ( this.speed < targetSpeed ) { // Speed Up:
			this.speed += this.acceleration;
			if (this.speed > targetSpeed) this.speed = targetSpeed;
		}
		if ( this.speed > targetSpeed ) { // Slow Down:
			this.speed -= this.acceleration * 1.5;
			if ( speed < targetSpeed ) speed = targetSpeed;
		}
	
		this.positionGroup.setPosition( 0, 0, 0 );
		this.positionGroup.setPosition( 0, 0, this.speed * .005 );
		if ( ver4012 ) // Old API
		{
			this.current_position = this.positionGroup.getPosition();
			this.masterGroup.setPosition( this.current_position.getX(), this.current_position.getY(), this.current_position.getZ() );
			viewpoint_pos = viewpoint.getPosition();
		}
		else
		{
			this.current_position = this.positionGroup.getAbsolutePosition();
			this.masterGroup.setPosition( this.current_position.getX(), this.current_position.getY(), this.current_position.getZ() );
			viewpoint_pos = viewpoint.getAbsolutePosition();
		}
		
		space.setPosition( viewpoint_pos.getX(), viewpoint_pos.getY(), viewpoint_pos.getZ() ); // This moves the Space sphere along with the ship.
	}
	
	function PitchCraft()
	{
		var maxPitchAngle = this.MaxPitchAngle + (this.throttle/100);
		var inertiaSteps = 10;
		// Pitch Axis:
		if (this.pitchUp) {
			if ( this.pitchAngle < maxPitchAngle) {
				this.pitchAngle += maxPitchAngle/inertiaSteps;
				if ( this.pitchAngle > maxPitchAngle) this.pitchAngle = maxPitchAngle;
			} else if ( this.pitchAngle > maxPitchAngle ) {
				this.pitchAngle -= maxPitchAngle/inertiaSteps;
				if ( this.pitchAngle < maxPitchAngle) this.pitchAngle = maxPitchAngle;
			}
			this.pitch_ship( this.pitchAngle );
		} else if (this.pitchUpMomentuum) {
			this.pitchAngle -= maxPitchAngle/inertiaSteps;
			if (this.pitchAngle < 0) this.pitchAngle = 0;
			if (this.pitchAngle == 0 ) this.pitchUpMomentuum = false;
			this.pitch_ship( this.pitchAngle );
		}
		
		if (this.pitchDown) {
			if ( this.pitchAngle > -maxPitchAngle) {
				this.pitchAngle -= maxPitchAngle/inertiaSteps;
				if ( this.pitchAngle < -maxPitchAngle ) this.pitchAngle = -maxPitchAngle;
			} else if ( this.pitchAngle < maxPitchAngle ) {
				this.pitchAngle += maxPitchAngle/inertiaSteps;
				if ( this.pitchAngle > maxPitchAngle ) this.pitchAngle = maxPitchAngle;
			}
			this.pitch_ship( this.pitchAngle );
		} else if (this.pitchDownMomentuum) {
			this.pitchAngle += maxPitchAngle/inertiaSteps;
			if (this.pitchAngle > 0) this.pitchAngle = 0;
			if (this.pitchAngle == 0 ) this.pitchDownMomentuum = false;
			this.pitch_ship( this.pitchAngle );
		}
	}
	
	function RollCraft()
	{
		var maxRollAngle = this.MaxRollAngle + (this.throttle/100);
		var inertiaSteps = 10;
		// Roll Axis:
		if ( this.rollLeft ) {
			if ( this.rollAngle < maxRollAngle ) { // Momentuum
				this.rollAngle += maxRollAngle/inertiaSteps;
				if ( this.rollAngle > maxRollAngle ) this.rollAngle = maxRollAngle;
			} else if ( this.rollAngle > maxRollAngle ) {
				this.rollAngle -= maxRollAngle/inertiaSteps;
				if ( this.rollAngle < maxRollAngle ) this.rollAngle = maxRollAngle;
			}
			this.roll_ship( this.rollAngle );
		} else if ( this.rollLeftMomentuum ) { // The user has let go of the key, now we slow down the ship.
			this.rollAngle -= maxRollAngle/inertiaSteps;
			if ( this.rollAngle < 0  ) this.rollAngle = 0;
			if ( this.rollAngle == 0 ) this.rollLeftMomentuum = false;
			this.roll_ship( this.rollAngle );
		}
	
		if ( this.rollRight ) {
			if ( this.rollAngle > -maxRollAngle ) {
				this.rollAngle -= maxRollAngle/inertiaSteps;
				if ( this.rollAngle < -maxRollAngle ) this.rollAngle = -maxRollAngle;
			} else if ( this.rollAngle < maxRollAngle ) {
				this.rollAngle += maxRollAngle/inertiaSteps;
				if ( this.rollAngle > maxRollAngle ) this.rollAngle = maxRollAngle;
			}
			this.roll_ship( this.rollAngle );
		} else if ( this.rollRightMomentuum ) { // The user has let go of the key, now we slow down the ship.
			this.rollAngle += maxRollAngle/inertiaSteps;
			if ( this.rollAngle > 0  ) this.rollAngle = 0;
			if ( this.rollAngle == 0 ) this.rollRightMomentuum = false;
			this.roll_ship( this.rollAngle );
		}
	}

	function roll_ship(angle)
	{
		this.masterGroup.setRotation(0,0,1,  angle);
	}
	
	function pitch_ship(angle)
	{
		this.masterGroup.setRotation(1,0,0, angle);
	}

	this.barrelRoll = false;
	function toggleBarrelRoll( on )
	{
		this.barrelRoll = on;
		this.masterGroup.setRotation(1,0,0, (on) ? -45 : 45 );
		this.shipGroup.setRotation  (1,0,0, (on) ?  45 :-45 );
	}
		
	function position(x,y,z) {
		this.masterGroup.setPosition(x,y,z);
	}
	/*********************************************************************************
	 * END POSITIONING AND ORIENTATION CODE:
	 *********************************************************************************/

	/*********************************************************************************
	 * BEGIN HUD CODE:
	 *********************************************************************************/
	var readyImageDrop, notReadyImageDrop, battleCamdrawText;
	this.readyImageDrop 	= new Array();
	this.notReadyImageDrop 	= new Array();
	this.battleCamdrawText 	= false;
	
	function UpdateHUD()
	{
		this.HUD.setTextHeight(10);
		this.HUD.drawText(scene_width - 95, scene_height - 30, "                        ");
		this.HUD.drawText(scene_width - 95, scene_height - 30, "Throttle: " + this.throttle + "%");
	
		this.HUD.drawText(scene_width - 95, scene_height - 15, "                        ");
		this.HUD.drawText(scene_width - 95, scene_height - 15, "Speed: " + this.speed );
		if (this.battleCam)
			(this.battleCamdrawText) ? this.HUD.drawText(0, scene_height - 15, "BATTLE CAM") : this.HUD.drawText(0, scene_height - 15, "                     ");
	}

	function BattleCamHUD()
	{
		this.battleCamdrawText = !this.battleCamdrawText;
		if (this.battleCam)
			setTimeout("ships[" + this.ship_ID + "].BattleCamHUD();", 500);
	}
	
	function Ready( bankNumber )
	{
		if (this.inCockpit) {
			this.HUDdrop.removeDrop( this.readyImageDrop[bankNumber] );
			this.readyImageDrop[bankNumber] = this.HUDdrop.addDrop( this.ready_image[bankNumber] );
			this.readyImageDrop[bankNumber].setPosition( this.bankPixelPos[bankNumber].x, this.bankPixelPos[bankNumber].y);
		}
	}

	function NotReady( bankNumber )
	{
		if (this.inCockpit) {
			this.HUDdrop.removeDrop( this.notReadyImageDrop[bankNumber] );
			this.notReadyImageDrop[bankNumber] = this.HUDdrop.addDrop( this.not_ready_image[bankNumber] );
			this.notReadyImageDrop[bankNumber].setPosition( this.bankPixelPos[bankNumber].x, this.bankPixelPos[bankNumber].y );
		}
	}
	/*********************************************************************************
	 * END HUD CODE:
	 *********************************************************************************/

	/****************************** FIRE ********************************************/
	function Fire()
	{
		// Death and destruction:
		if (this.linkedCannons) {
			var starttime = current_running_time;
			for ( i = 0; i < this.numOfWeaponBanks; i++)
				this.weaponBank[i].Fire(i,starttime);
		} else
			this.weaponBank[this.activeBank].Fire(this.activeBank,0);
	}

	function CheckWeapons()
	{
		for (i = 0; i < this.numOfWeaponBanks; i++)
			for (j = 0; j < this.weaponBank[i].numOfShots; j++)
				if (this.weaponBank[i].projectiles[j].firing)
					this.weaponBank[i].projectiles[j].Fire();
	}
	/****************************** FIRE ********************************************/

	/*********************************************************************************
	 * BEGIN CAMERA VIEW CODE:
	 *********************************************************************************/
	var battleCam, numOfViews, currentView, inCockpit, vectorObject;
	this.battleCam 	 = false;
	this.numOfViews  = 3;
	this.currentView = 0;
	this.inCockpit 	 = false;
	function SetView()
	{
		var viewVector;
		this.battleCam = false;
		this.inCockpit = false;
		
		viewpoint.unsetLookAt();
		viewpoint.setOrientation(0,1,0,0);
		this.HUD.setColor(0,0,0);
		
		switch (this.currentView)
		{
			case 0:
				this.inCockpit 	= true;
				viewVector  	= new D3dVector(0, .25, 0.6);
				this.cross_drop	= this.HUDdrop.addDrop( this.cross_image );
				this.cross_drop.setPosition( scene_width/2 - this.cross_drop.getWidth()/2, scene_height/2 - this.cross_drop.getHeight()/2 - 4);
				this.shipGroup.addObject( viewpoint );
			
				// Add the ready lights, and position them:
				for (i = 0; i < this.numOfWeaponBanks; i++) {
					this.notReadyImageDrop[i] = this.HUDdrop.addDrop( this.not_ready_image[i] );
					this.notReadyImageDrop[i].setPosition( this.bankPixelPos[i].x, this.bankPixelPos[i].y);
	
					this.readyImageDrop	 [i] = this.HUDdrop.addDrop( this.ready_image[i] );
					this.readyImageDrop	 [i].setPosition( this.bankPixelPos[i].x, this.bankPixelPos[i].y );
				}
				break;
			case 1:
				viewVector = new D3dVector(0, 2, -10);
				viewpoint.removeDrop( this.cross_drop );
				this.shipGroup.addObject( viewpoint );
				
				// Remove ready lights:
				for (i = 0; i < this.numOfWeaponBanks; i++) {
					viewpoint.removeDrop( this.notReadyImageDrop[i] );
					viewpoint.removeDrop( this.readyImageDrop[i] );
				}
				break;
			case 2:
				this.battleCam = true;
				if ( ver4012 ) // Old API
					vectorObject=this.masterGroup.getPosition();
				else
					vectorObject=this.masterGroup.getAbsolutePosition();
				viewVector = new D3dVector( vectorObject.getX(), vectorObject.getY(), vectorObject.getZ() - 10);
				mainStage.addObject( viewpoint );
				viewpoint.setLookAt( this.frame );
				this.BattleCamHUD();
				break;
		}
		this.currentView = (this.currentView + 1) % this.numOfViews;
		viewpoint.setPosition ( viewVector.x, viewVector.y, viewVector.z );
		viewpoint.setOrientation(0,1,0,0);
	}

	/*********************************************************************************
	 * END CAMERA VIEW CODE:
	 *********************************************************************************/

	// Define this object:
	var ready_image, not_ready_image, bankPixelPos, weaponBank, model, shipname, scaleVec, modelpath, frame, numOfWeaponBanks, activeBank;
	this.activeBank = 0;
	this.shipname 	= name;
	this.bankPixelPos = new Array();

	ship_id++;
	this.ship_ID = ship_id;

	// Create the axis':
	this.masterGroup	= scene.createGroup();
	this.shipGroup		= scene.createGroup();
	this.positionGroup 	= scene.createGroup(); // Used for moving the object through the scene. Feel the Travisness.
	this.laserPos		= scene.createGroup();
	this.junkBin		= scene.createGroup();

	// Add the Group hierarchy
	mainStage.addObject(this.masterGroup);
	this.masterGroup.addObject( this.shipGroup );
	this.shipGroup.addObject( this.laserPos );
	this.shipGroup.addObject( this.positionGroup );
	//this.shipGroup.addObject( this.junkBin );
	this.junkBin.setPosition( 0, 0, 50000 );

	// These two lines give the ship an off-center roll:
	this.masterGroup.setOrientation(1,0,0, 45 );
	this.shipGroup.setOrientation  (1,0,0, -45 );

	switch ( this.shipname.toLowerCase() ) {
		case "snowspeeder":
			this.modelpath 		 = code_path + "model/snowspdr.wt";
			this.texpath		 = code_path + "model/snowspd1.wjp";
			this.scaleVec 		 = new D3dVector( 4, 4, 4 );
			
			// Specify ship speed and agility attributes:
			this.acceleration	 = 1;
			this.topSpeed		 = 105;
			this.MaxRollAngle 	 = 1; 
			this.MaxPitchAngle 	 = 1.2;
			
			// Create Lazer Banks:
			this.numOfWeaponBanks = 2;
			this.weaponBank 	 = new Array( this.numOfWeaponBanks );
			this.weaponBank[0]	 = new WeaponBank( this, 1, -.52, .1, 2.25);
			this.weaponBank[1]	 = new WeaponBank( this, 1,  .52, .1, 2.25);
			
			this.ready_image 	 = new Array( this.numOfWeaponBanks );
			this.not_ready_image = new Array( this.numOfWeaponBanks );

			// Position where the ready lights for the weapon banks will be on the HUD:
			this.bankPixelPos[0] = new PixelCoords(scene_width/2  - 30, scene_height/2 + 25);
			this.bankPixelPos[1] = new PixelCoords(scene_width/2  + 25, scene_height/2 + 25);
			break;
		case "tie advanced":
			this.modelpath 		 = code_path + "model/vader.wt";
			this.texpath		 = code_path + "model/vader_tex.wjp";
			this.scaleVec 		 = new D3dVector( .25, .25, .25 );

			// Specify ship speed attributes:
			this.acceleration	 = 1;
			this.topSpeed		 = 180;
			this.MaxRollAngle 	 = 2.2; 
			this.MaxPitchAngle 	 = 2.8;

			// Create Lazer Banks:
			this.numOfWeaponBanks = 2;
			this.weaponBank 	 = new Array( this.numOfWeaponBanks );
			this.weaponBank[0]	 = new WeaponBank( this, 0, -.17,-.4, 1.35);
			this.weaponBank[1]	 = new WeaponBank( this, 0,  .17,-.4, 1.35);
			
			this.ready_image 	 = new Array( this.numOfWeaponBanks );
			this.not_ready_image = new Array( this.numOfWeaponBanks );

			// Position where the ready lights for the weapon banks will be on the HUD:
			this.bankPixelPos[0] = new PixelCoords(scene_width/2  - 30, scene_height/2 + 25);
			this.bankPixelPos[1] = new PixelCoords(scene_width/2  + 25, scene_height/2 + 25);
			break;
		case "beretta":
			this.modelpath 		 = code_path + "model/beretta.wt";
			this.texpath		 = code_path + "model/beretta.wjp";
			this.scaleVec 		 = new D3dVector( 6, 6, 6 );

			// Specify ship speed attributes:
			this.acceleration	 = 1;
			this.topSpeed		 = 100;
			this.MaxRollAngle 	 = 2.2; 
			this.MaxPitchAngle 	 = 2.8;

			// Create Lazer Banks:
			this.numOfWeaponBanks = 2;
			this.weaponBank 	 = new Array( this.numOfWeaponBanks );
			this.weaponBank[0]	 = new WeaponBank( this, 0, -.15,-.2, 1.8);
			this.weaponBank[1]	 = new WeaponBank( this, 0,  .15,-.2, 1.8);
			
			this.ready_image 	 = new Array( this.numOfWeaponBanks );
			this.not_ready_image = new Array( this.numOfWeaponBanks );

			// Position where the ready lights for the weapon banks will be on the HUD:
			this.bankPixelPos[0] = new PixelCoords(scene_width/2  - 30, scene_height/2 + 25);
			this.bankPixelPos[1] = new PixelCoords(scene_width/2  + 25, scene_height/2 + 25);
			break;			
	}

	for (i = 0; i < this.ready_image.length; i++) {
		this.ready_image		[i] = scene.createBitmap( code_path + "images/ready.wpg" );
		this.not_ready_image	[i] = scene.createBitmap( code_path + "images/not_ready.wpg" );
	}

	this.model 	 = scene.createModel( this.modelpath );
	if (this.texpath != null) {
		this.tex = scene.createBitmap( this.texpath );
		this.model.setTexture( this.tex );
	}
	this.model.setScale(this.scaleVec.x, this.scaleVec.y, this.scaleVec.z);
	
	this.frame = scene.createContainer();
	this.shipGroup.addObject( this.frame );
	this.frame.setOrientation( 0,1,0, 180 );
	this.frame.attach(this.model);
	
	// Create the HUD:
	this.HUD	 	 = scene.createBlankBitmap(scene_width, scene_height);
	this.HUDdrop 	 = viewpoint.addDrop( this.HUD, true );
	this.HUD.setColorKey( 0,0,0 );
	this.cross_image = scene.createBitmap ( code_path + "images/crosshair.wpg" );
	while (!this.cross_image.getIsLoaded()) ; // Waits for the image to load.
	this.cross_image.setColorKey( 0,0,0 );
	
	// Add this puppy to the collision list:
	this.collision_radius = 1;
	this.collision_id	  = collision_objects.length;
	this.collision_posObj = this.masterGroup;
	collision_objects[ collision_objects.length ] = this;
}
