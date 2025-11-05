// ALL JAVASCRIPT CALLS FOR THE WILDTANGENT SITE GO HERE:
// (c)1999 WildTangent Inc. All Rights Reserved.
// LAST MODIFIED: 5/3/99.
var	ns4 = (document.layers) ? true : false;
var	ie4 = (document.all)	? true : false;
var good_browser = document.layers || document.all;

// Used to determine if the browser has our player technology installed:
function wildExists()
{
	// Take care of OLD browzers:
	if (navigator.userAgent.indexOf("Mozilla/4") < 0)
		return false; // BEAT IT KID!
		
	if ( document.all ) { // MSIE 4+
		var object_tags = document.all.tags("Object");
		var wt_object_ids = new Array("CLSID:FA13A9FA-CA9B-11D2-9780-00104B242EA3"); // Put this in an array for any future object ID tags that may be used (windowless controls, etc.).
		for (i = 0; i < object_tags.length; i++)
			for (j = 0; j < wt_object_ids.length; j++)
				if ( object_tags[i].classid == wt_object_ids[j]) {
					if (object_tags[i] == null)
						return false;
					else
						return true;
				}
	} else if ( document.layers ) { // Nutscrape 4.0+
		if ( navigator.plugins["WildTangent Web Driver Plugin"] && 
			 navigator.mimeTypes["application/x-wildtangent-web-driver"] && 
			 navigator.mimeTypes["application/x-wildtangent-web-driver"].enabledPlugin != null
			)
		return true;
	}
	return true;
}

// Used to check to see if a ID # is legit:
function isValidIDNumber( inputVal )
{
	var inputStr = inputVal.toString();
	for (var i = 0; i < inputStr.length; i++) 
	{
		var oneChar = inputStr.charAt( i );
		if ( oneChar < "0" || oneChar > "9")
			return false;
	}
	return true;
}

function validateRegistration()
{
	with (document.register)
	{
		if (first_name.value == "") {
			alert("Please Enter in Your First Name.");
			first_name.focus();
			return false;
		}
		if (last_name.value == "") {
			alert("Please Enter in Your Last Name.");
			last_name.focus();
			return false;
		}

		// Get rid of any spaces in mail addy:
		var newMailAddy = '';
		for (i = 0; i < email.value.length; i++) {
			if ( email.value.charAt(i) != " ") 
				newMailAddy += email.value.charAt(i);
		}
		email.value = newMailAddy;

		if (!properEmailAddress(email.value)) {
			alert("Please Enter a valid e-mail address.");
			email.focus();
			return false;
		}
	}
	return true;
}

function properEmailAddress(email_string) {
	if (
		( email_string == "" )
			||
		( email_string.indexOf(".") == -1)
			|| 
		( email_string.indexOf("@") == -1 )
			||
		( email_string.substring( 0, email_string.indexOf("@") ) == "")
			||
		( email_string.substring( email_string.indexOf("@")+1, email_string.indexOf(".") ) == "")
			||
		( email_string.substring(email_string.indexOf(".")+1, email_string.length ) == "")
	)			
		return false;

	return true;
}

function refresh()
{
	if (ns4)
		location.reload();
}

// Create the mouseover nav images:
var cur_image_num	 = null;
var tempImage		 = null; // Used for dumping previous image for mouseover.
var image_path_array = new Array("01_company_info.gif", "01_contact.gif", "01_developers.gif", "01_beta_program.gif", "01_tech_support.gif", "01_products_demos.gif");
var image_array		 = new Array( image_path_array.length );
var image_dir 		 = "http://www.wildtangent.com/images/nav/buttons/";
for (var i = 0; i < image_path_array.length; i++)
{
	image_array[i] = new Image();
	image_array[i].src = image_dir + image_path_array[i];
}

function toggleImg( num )
{
	cur_image_num				 	 = num;
	tempImage					 	 = document.images["img" + num].src;
	document.images["img" + num].src = image_array[num].src;

	if (document.images["img" + num].alt)
		self.status 			 	 = document.images["img" + num].alt;
}

function restoreImg()
{
	document.images["img" + cur_image_num].src 	= tempImage;
	self.status = "";
}