import java.applet.*;
import wildtangent.webdriver.*;

public class Main extends Applet implements WTConstants
{
	WT Wt;
	WTStage Stage;
	WTCamera Camera;
	WTLight ambientLight;
	WTDrop backDrop;
	WTBitmap backImage;
	WTModel boxModel;
	WTContainer boxContainer;
	TWTIO io;

	//this is the begin function called from JavaScript
	public void begin(Object o)
	{
		//Get the WT object out of the passed in JavaScript Object
		Wt = wt3dLib.getWT(o);
		
		//Create a stage
		Stage = Wt.createStage();
		
		//Create a camera
		Camera = Stage.createCamera();
		Camera.setPosition(0, 0, -2);

		backImage = Wt.createBlankBitmap(100, 100);
		backImage.setColor(0, 0, 64);
		backDrop = Camera.addDrop(backImage);		

		//Size the background drop to take the full render area
		backDrop.setSize(Wt.getWidth(), Wt.getHeight());
		
		//Create an ambient Light
		ambientLight = Wt.createLight(WTLIGHT_AMBIENT);
		ambientLight.setColor(100, 100, 100);
		Stage.addObject(ambientLight);
		
		//Create the box model - x, y, z, TilesPerSide
		boxModel = Wt.createBox(1, 1, 1, 5);
	
		//Set the color of each face of the box
		boxModel.setColor(255, 0, 0, "top");
		boxModel.setColor(0, 255, 0, "bottom");
		boxModel.setColor(0, 0, 255, "left");
		boxModel.setColor(255, 0, 255, "right");
		boxModel.setColor(255, 255, 0, "front");
		boxModel.setColor(0, 255, 255, "back");

		//Create a container to hold the boxModel
		boxContainer = Wt.createContainer();

		//Attach the boxModel to the boxContainer
		boxContainer.attach(boxModel);
	
		//Add the container to the stage
		Stage.addObject(boxContainer);
	
		//Put a rotation on the container - to make it look interesting
		boxContainer.setConstantRotation(1, 1, 1, 25);
		
		//To get events from the Web Driver in JAVA, you need to make a 
		//class that extends WTEventCallback, then tell the Web Driver 
		//about that class - see the code for TWTIO class for more details

		//Create a new instance of the TWTIO class, passing in this class
		//as a parent object
		io = new TWTIO(this);
		
		//Setup Keyboard Events
		Wt.setOnKeyboardEvent(io);
		Wt.setNotifyKeyboardEvent(true);

		//Setup Mouse Events
		Wt.setOnMouseEvent(io);
		Wt.setNotifyMouseEvent(1);
		
		//Setup Render Events
		Wt.setOnRenderEvent(io);
		Wt.setNotifyRenderEvent(true);
		
		//Start the Wt object
		Wt.start();
	}
	
	public void end()
	{
		//Set the parent object in the TWTIO class to null
		//This is important to do - it avoids a circular reference
		//condition on the shutdown of the WT object
		io.pMain = null;
		
		//Call the shutdown() function on the WT object
		Wt.shutdown();
	}
}
