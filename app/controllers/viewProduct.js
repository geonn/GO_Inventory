var args = arguments[0] || {}; 
var MODULE = require("scanner");
$.viewProductView.height = Ti.Platform.displayCaps.platformHeight;

/***Create Scanner View***/
// Create a window to add the picker to and display it. 
var window = Titanium.UI.createWindow({   
		navBarHidden:true,
		fullscreen : true,
});

// create start scanner button
var button = Titanium.UI.createButton({
	"width":200,
	"height": 80,
	"title": "START"
});

button.addEventListener('click', function() {
	MODULE.openScanner("2");
});

MODULE.init(window); 
$.scanner.add(button);