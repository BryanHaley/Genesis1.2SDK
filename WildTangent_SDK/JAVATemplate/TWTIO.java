import wildtangent.webdriver.*;

//This class is the implementation of WTEventCallback
//The functions in this class all need to exist for you JAVA applet to 
//compile and run - even if they don't do anything with the event, the
//event function needs to be defined...
public class TWTIO implements WTEventCallback
{
	Main pMain;
	
	public TWTIO(Main thisMain)
	{
		//pass in the class that this class will be interacting with...
		pMain = thisMain;
	}

	//Exception Event - for handling error conditions in the WT object
	public void onExceptionEvent(WTEvent event)
	{
		
	}
	
	//Render Event - called every time the WT object renders
	public void onRenderEvent(WTEvent event)
	{
		
	}
	
	//Keyboard Event - called when the WT object processes a keyboard event
	public void onKeyboardEvent(WTEvent event)
	{

	}
	
	//Mouse Event - called when the WT object processes a mouse event
	public void onMouseEvent(WTEvent event)
	{

	}	
}
