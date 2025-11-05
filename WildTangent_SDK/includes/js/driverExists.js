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
	var wtWebDriverPresent = false;
	
	function driverExists()
	{
		if(is_ie4up || is_aol4)
		{
			wtWebDriverPresent = ieDetectDriver();
		}

		if(is_nav4up)
		{
			if (navigator.plugins["WildTangent Web Driver Plugin"] 
			  && navigator.mimeTypes["application/x-wildtangent-web-driver"] 
			  && navigator.mimeTypes["application/x-wildtangent-web-driver"].enabledPlugin != null) 
			    wtWebDriverPresent = true;
		}
		return wtWebDriverPresent;
	}
