// load the Scandit SDK module
var scanditsdk = require("com.mirasense.scanditsdk");

var iCard;
var picker;
var window;

/***Private function***/
// Stops the scanner, removes it from the window and closes the latter.
var closeScanner = function() {
	if (picker != null) {
		picker.stopScanning();
		window.remove(picker);
	}
	window.close();
};

exports.closeScanner = function(){
	closeScanner();
};
/***Public function***/
// Sets up the scanner and starts it in a new window.
exports.openScanner = function() {
	 
	// Instantiate the Scandit SDK Barcode Picker view
	picker = scanditsdk.createView({
		width:"100%",
		height:"100%"
	});
	// Initialize the barcode picker, remember to paste your own app key here.
	picker.init("qt/U+huGEeSG62SYxtngPa7xVDA0BLRMw7gQLH8qAB0", 0);

	picker.showSearchBar(false);
	// add a tool bar at the bottom of the scan view with a cancel button (iphone/ipad only)
	picker.showToolBar(true);

	// Set callback functions for when scanning succeedes and for when the 
	// scanning is canceled.
	picker.setSuccessCallback(function(e) { 
		 
		iCard = Ti.App.Properties.getString("iCard");
		var code = getValueFromPipe(e.barcode);   
		if(code['type'] == "resource"){ 
			if(iCard === null){
				alert("Please scan product first.");
				return false;
			}else{
				var mod_resources = Alloy.createCollection('resources'); 
				mod_resources.addUpdateResources({
					iCard  : iCard,
					prefix : code['prefix'],
					item_id : code['item_id'],
					name : code['name'],
					code : code['code'],
					status : 1,
					created : currentDateTime(),
					updated : currentDateTime()
				});
			}
			Ti.App.fireEvent('populateData');
		}else if(code['type'] == "product"){
			//Scan product
			var mod_products = Alloy.createCollection('products'); 
			mod_products.addUpdateProduct({
				prefix : code['prefix'],
				item_id : code['item_id'],
				name : code['name'],
				code : code['code'],
				image : API.getDomain()+ code['image'],
				created : currentDateTime(),
				updated : currentDateTime()
			});
			Ti.App.Properties.setString("iCard", code['code']); 
			Ti.App.fireEvent('populateData');
		}else{
			alert("Invalid Code.");
		}
		
		closeScanner();
	});
	picker.setCancelCallback(function(e) { 
		closeScanner();
	});

	window.add(picker);
	window.addEventListener('open', function(e) {
		// Adjust to the current orientation.
		// since window.orientation returns 'undefined' on ios devices 
		// we are using Ti.UI.orientation (which is deprecated and no longer 
	    // working on Android devices.)
		if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
    		picker.setOrientation(Ti.UI.orientation);
		}	
		else {
			picker.setOrientation(window.orientation);
		}
		
		picker.setSize(Ti.Platform.displayCaps.platformWidth,  Ti.Platform.displayCaps.platformHeight);
		picker.startScanning();		// startScanning() has to be called after the window is opened. 
	});
	
	window.addEventListener('android:back', function (e) { 
		closeScanner(); 
	});

	window.open();
};

exports.init = function(win){
	window = win;
};

// disable the status bar for the camera view on the iphone and ipad
if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
	Titanium.UI.iPhone.statusBarHidden = true;
}


// Changes the picker dimensions and the video feed orientation when the
// orientation of the device changes.
Ti.Gesture.addEventListener('orientationchange', function(e) {
	window.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT, 
				   Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT];
	if (picker != null) {
		picker.setOrientation(e.orientation);
		picker.setSize(Ti.Platform.displayCaps.platformWidth, 
				Ti.Platform.displayCaps.platformHeight);
		// You can also adjust the interface here if landscape should look
		// different than portrait.
	}
});