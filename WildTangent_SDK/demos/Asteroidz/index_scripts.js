var checked_src = "images/PASSED_check.gif";
var empty_src   = "images/open_circle.gif";
var num_of_starfield_selections = 3,
	num_of_asteroidz_selections = 3,
	num_of_option_selections = 2;

function init() {
	defaults();
	if(GetCookie("Asteroidz_numbers") != null) {
		clearAll();
		numOfAst   	   = GetCookie("Asteroidz_numbers");
		select_asteroidz(numOfAst);
		numOfStars 	   = GetCookie("Asteroidz_density");
		select_starfield(numOfStars);
		if(GetCookie("Asteroidz_space_trash") == "true")
			toggle_option(0);
		if(GetCookie("Asteroidz_lasers_on") == "true")
			toggle_option(1);
		if(GetCookie("Asteroidz_sound_on") == "true")
			toggle_option(2);
	}

	scene = (document.all) ? wtScene : document.embeds["wtScene"];
	stage = scene.createStage();
    viewpoint = stage.createCamera();
    viewpoint.setViewRect( 0, 0, scene.width, scene.height );
	viewpoint.setPosition(0,0,-5);
	model_frame  = scene.createContainer();
 	model 		 = scene.createModel ( "model/asteroid.wt" );
	modelTexture = scene.createBitmap( "model/asteroid_gray.wjp" );
	model.setColor(60,60,60);
	model.setTexture( modelTexture );

	chart 		 = scene.createBitmap( "images/chart.wpg" );
	viewpoint.addDrop( chart );
	
	stage.addObject( model_frame );
	model_frame.attach( model );
	model_frame.setConstantRotation(((Math.random() - .5) * 10), ((Math.random() - .5) * 25), ((Math.random() - .5) * 50), ((Math.random() - .5) * 110));
	
	ambientLight = scene.createLight(0);	//tWTLightAmbient
	stage.addObject( ambientLight );
	pointLight 	 = scene.createLight(1);	//tWTLightPoint
	stage.addObject( pointLight );
	scene.start();
}

function toggle_option(num)
{
	if (num != null) {
		img = document.images["option_" + num];
		img.src = (img.src.indexOf(empty_src) != -1) ? checked_src : empty_src;
	} else 
		alert("This Feature is Coming Soon!");
}

function select_starfield( num ) 
{
	for (i = 0; i < num_of_starfield_selections; i++)
		document.images["starfield_" + i ].src = empty_src;
	document.images["starfield_" + num ].src = checked_src;
}

function select_asteroidz( num ) 
{
	for (i = 0; i < num_of_asteroidz_selections; i++)
		document.images["asteroidz_" + i ].src = empty_src;
	document.images["asteroidz_" + num ].src = checked_src;
}

function ns_defaults()
{
	if (document.layers)
		defaults();
}

function quick_pick( num )
{
	var ast, density, optionz;
	clearAll();
	switch (num) {
		case 0: // FAST:
			ast 	= 0;
			density = 0;
			optionz = [true, true, false];
			break;
		case 1: // Med:
			ast 	= 1;
			density = 1;
			optionz = [true, false, false];
			break;
		case 2: // Slow:
			ast 	= 2;
			density = 2;
			optionz = [false, false, false];
			break;
	}
	
	document.images["quick_pick_" + num ].src 	 = checked_src;
	document.images["starfield_" + density ].src = checked_src;
	document.images["asteroidz_" + ast ].src 	 = checked_src;
	for (i = 0; i < optionz.length; i++)
		document.images["option_" + i ].src		 = (optionz[i]) ? checked_src : empty_src;
}

function clearAll()
{
	for (i = 0; i < num_of_asteroidz_selections; i++)
		document.images["quick_pick_" + i ].src = empty_src;

	for (i = 0; i < num_of_asteroidz_selections; i++)
		document.images["asteroidz_" + i ].src = empty_src;
		
	for (i = 0; i < num_of_starfield_selections; i++)
		document.images["starfield_" + i ].src = empty_src;

	for (i = 0; i < num_of_option_selections; i++)
		document.images["option_" + i ].src = empty_src;
}

function defaults()
{
	clearAll();
	document.images["starfield_1" ].src = checked_src;
	document.images["asteroidz_1" ].src = checked_src;
	document.images["option_0" ].src = checked_src;
}

function submit_asteroidz()
{
	var expdate 	= new Date();
	FixCookieDate 	( expdate ); // Correct for Mac date bug - call only once for given Date object!
	expdate.setTime	( expdate.getTime() + ( 24 * 60 * 60 * 1000 ) ); // 1 Day from now
	
	// Determine num of Asteroidz:
	for (i = 0; i < num_of_asteroidz_selections; i++) {
		if (document.images["asteroidz_" + i ].src.indexOf(checked_src) != -1) {
			SetCookie( "Asteroidz_numbers", i, expdate);
			break;
		}
	} 
	
	// Determine density:
	for (i = 0; i < num_of_starfield_selections; i++) {
		if (document.images["starfield_" + i ].src.indexOf(checked_src) != -1) {
			SetCookie( "Asteroidz_density", i, expdate);
			break;
		}
	}
	
	// Do options:
	SetCookie( "Asteroidz_space_trash", (document.images["option_0" ].src.indexOf(checked_src) != -1), expdate);
	SetCookie( "Asteroidz_lasers_on", (document.images["option_1" ].src.indexOf(checked_src) != -1), expdate);
	SetCookie( "Asteroidz_sound_on", (document.images["option_2" ].src.indexOf(checked_src) != -1), expdate);
	scene.stop();
	
	window.open('space.html',null,'status=yes,toolbar=no,menubar=no,width=500,height=500,top=0,left=0,scrollbars=no,resizable=no,location=no');
}

/************************************************************
 * FLASHING CODE!											*
 ***********************************************************/
var flashing = false;
function urgent_flash()
{
	if (document.layers) return;
	flashing = true;
	document.styleSheets("0").rules("0").style.color = "white";
	start_flash();
}

function start_flash()
{
	with (document.styleSheets("0").rules("0").style) {
		color = (color.toLowerCase() == "red") ? "white" : "red";

		if (flashing)
			setTimeout("start_flash();", 500);
		else
			color = "white";
	}		
}
function stop_flash()
{
	flashing = false;
}
