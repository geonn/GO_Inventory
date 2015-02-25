var args = arguments[0] || {}; 
var MODULE = require("scanner");
$.viewProductView.height = Ti.Platform.displayCaps.platformHeight;

/***Create Scanner View***/
// Create a window to add the picker to and display it. 
var window = MODULE.createScannerWindow();

// create start scanner button
var button = MODULE.createScannerButton({title: "Check Product"});

button.addEventListener('click', function() {
	MODULE.openScanner("2");
});

MODULE.init(window); 
$.scanner.add(button);