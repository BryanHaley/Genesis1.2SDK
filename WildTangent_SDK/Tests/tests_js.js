var agt=navigator.userAgent.toLowerCase(); 
var is_major = parseInt(navigator.appVersion); 
var is_minor = parseFloat(navigator.appVersion); 
var is_nav  = ((agt.indexOf('mozilla')!=-1) && (agt.indexOf('spoofer')==-1) && (agt.indexOf('compatible') == -1) && (agt.indexOf('opera')==-1) && (agt.indexOf('webtv')==-1)); 
var is_nav4up = (is_nav && (is_major >= 4)); 
var is_ie   = (agt.indexOf("msie") != -1); 
var is_ie4up  = (is_ie  && (is_major >= 4)); 
var is_aol   = (agt.indexOf("aol") != -1); 
var is_aol4  = (is_aol && is_ie4up); 
var is_opera = (agt.indexOf("opera") != -1); 
var is_webtv = (agt.indexOf("webtv") != -1); 
	
var lastRenderTime = 0;
var scene, pageLoaded = false;
var model_dir = "./models/";
var models = [
	model_dir + "test_sphere.wt"
];

var image_dir = "./images/";
var jpg_dir   = image_dir + "jpg/";
var jpg = [
	jpg_dir + "2x2_24_bit.wjp", 
	jpg_dir + "100x100_24_bit.wjp", 
	jpg_dir + "500x200_24_bit.wjp", 
	jpg_dir + "512x512_24_bit.wjp",
	jpg_dir + "512x512_grayscale.wjp"
];

var sphereTex = [
	jpg_dir + "Chrome1.wjp", 
	jpg_dir + "BlueTexture.wjp", 
	jpg_dir + "GreenTexture.wjp", 
	jpg_dir + "YellowTexture.wjp", 
	jpg_dir + "GreenChrome.wjp",
	jpg_dir + "BoxTexture1.wjp",
	jpg_dir + "BoxTexture2.wjp",
	jpg_dir + "512x512_24_bit.wjp"
];

var png_dir   = image_dir + "png/";
var png = [
	png_dir + "2x2_8_bit.wpg",
	png_dir + "100x100_8_bit.wpg",
	png_dir + "500x200_8_bit.wpg",
	png_dir + "512x512_8_bit.wpg",
	png_dir + "512x512_grayscale.wpg"
];

function init()
{
	// Assign the scene object
	scene = document.wtScene;
		
	// Create the main Stage.
	mainStage = scene.createStage();
	
	// Create the scene's camera:
	scene_width  = 300;
	scene_height = 300;
	
	viewpoint = mainStage.createCamera();
	viewpoint.setViewRect( 0, 0, scene_width , scene_height );
	viewpoint.setPosition ( 0, 0, -2 );
	
	// Create status:
	status_info = scene.createBlankBitmap ( scene_width, scene_height );
	status_info.setColorKey(255,0,0);
	status_drop = viewpoint.addDrop  ( status_info, true );
	status_info.setColor(255,0,0);
	status_info.setTextBkColor(255,0,0);
	status_info.setTextFace("Tahoma,Arial");
	status_info.setTextHeight(10);
	
	// Create the lights:
	ambientLight = scene.createLight(0);	//tWTLightAmbient
	pointLight 	 = scene.createLight(1);	//tWTLightPoint
	mainStage.addObject(ambientLight);
	mainStage.addObject(pointLight);

	if(is_nav4up)
		scene.setOnRenderEvent("rFunction");
	scene.setNotifyRenderEvent(true);

	pageLoaded = true;
	document.button.startTest.value = "Begin Test";
}
window.onload   = init;

function refreshNetscape()
{
	if (is_nav4up) location.reload();
}

window.onresize = refreshNetscape;

var firstClick = true;

function beginTest()
{
	if(!pageLoaded) return;
		if  (firstClick) 
		{
			firstClick = false;
			initHTML();
			scene.start(); // Run the scene!
			document.button.startTest.value = "Restart Test";
		} else {
			location.reload();
		}
}