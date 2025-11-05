var settings = document.cookie; 
function getCookie(name) { // use: getCookie("name"); 
	var index = settings.indexOf(name + "="); 
	if (index == -1) return null; 
	index = settings.indexOf("=", index) + 1; 
	var endstr = settings.indexOf(";", index); 
	if (endstr == -1) endstr = settings.length; 
	return unescape(settings.substring(index, endstr)); 
} 

var today = new Date(); 
var expiry = new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000); // plus 28 days 
function setCookie(name, value) { // use: setCookie("name", value); 
	if (value != null && value != "") document.cookie=name + "=" + escape(value) + "; expires=" + expiry.toGMTString(); 
	settings = document.cookie; // update settings 
}
