// load the Scandit SDK module
var scanditsdk = require("com.mirasense.scanditsdk");
var mod_products = Alloy.createCollection('products'); 
var mod_resources = Alloy.createCollection('resources'); 
var mod_invProducts = Alloy.createCollection('product_inventory'); 
var iCard;
var picker;
var window;

/***Private function***/
// Stops the scanner, removes it from the window and closes the latter.
var closeScanner = function() { 
	if (picker != null) {
		picker.stopScanning();
		//window.remove(picker);
	}
	window.close();
};


/***Public function***/
exports.closeScanner = function(){
	closeScanner();
};

exports.createScannerWindow = function(){
	return Titanium.UI.createWindow({   
		navBarHidden:true,
		fullscreen : true,
	});
};

exports.createScannerButton = function(){
	return Titanium.UI.createButton({
		"width":200,
		"height": 80 
	});
};
// Sets up the scanner and starts it in a new window.
/*********
 * 1 - scan and assigned resources and finish goods
 * 2 - scan to check the product info
 */
exports.openScanner = function(scanType) {
	 
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
		// 1 - scan and assigned resources and finish goods
		if(scanType == "1"){
			iCard = Ti.App.Properties.getString("iCard"); 
			var code = getValueFromPipe(e.barcode);   
			if(code['type'] == "done"){
				//product DONE scanning
				if(iCard === null){
					COMMON.createAlert("Error","Please scan finish product first.");
					return false;
				}else{
					var resouceData = mod_resources.getResourcesByicard(iCard); 
					if(resouceData.length == 0){
						COMMON.createAlert("Error","No resources attached to this product yet.");
					}else{
						mod_resources.confirmScan({code:Ti.App.Properties.getString("iCard") });
						 
						var data = mod_resources.getResourcesToSync({iCard: iCard});
						API.updatedCombination({
								iCard : iCard,
								data : data,
						});
						 
						setTimeout(function(){  
							//update to server
							API.updateDoneProduct({
								iCard : iCard 
							});
						}, 300); 
					}
					Ti.App.fireEvent('populateData');
					 
				}
			}else if(code['type'] == "resource"){ 
				if(iCard === null){
					COMMON.createAlert("Error","Please scan product first.");
					return false;
				}else{
					var usage;
					// create dialog to enter resources usage
					if(Ti.Platform.osname == "android"){
						var textfield = Ti.UI.createTextField();
						var usageDialog = Ti.UI.createAlertDialog({
						    title: 'Enter Resources Usage', 
						   	androidView: textfield,
						    buttonNames: ['Confirm', 'Cancel'], 
						}); 
					}else{  
						var usageDialog = Ti.UI.createAlertDialog({
						    title: 'Enter Resources Usage', 
						    style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
						    buttonNames: ['Confirm', 'Cancel'],
						    keyboardType : Ti.UI.KEYBOARD_PHONE_PAD
						}); 
					} 
						usageDialog.show(); 
						usageDialog.addEventListener('click', function(e){  
							if(e.index == 0) {  
								if(Ti.Platform.osname == "android"){
									usage = textfield.value;
								}else{
									usage = e.text;
								} 
								mod_resources.addUpdateResources({
									id : code['id'],
									iCard  : iCard,
									prefix : code['prefix'],
									item_id : code['item_id'],
									name : code['name'],
									code : code['code'],
									usage : usage,
									resource: code['resource'],
									status : 1,
									created : currentDateTime(),
									updated : currentDateTime()
								});
							}else{
								 mod_resources.addUpdateResources({
									id : code['id'],
									iCard  : iCard,
									prefix : code['prefix'],
									item_id : code['item_id'],
									name : code['name'],
									code : code['code'],
									resource: code['resource'],
									usage : "",
									status : 1,
									created : currentDateTime(),
									updated : currentDateTime()
								});
							}
							closeScanner();
							Ti.App.fireEvent('populateData');
						}); 
					 
				}
				
				Ti.App.fireEvent('populateData');
			}else if(code['type'] == "product"){
				//Scan product
				var prodDetails = mod_products.getProductDetails(code['code']);
				
				if(prodDetails.done == "1"){
					COMMON.createAlert("Scan Failed","This product is already completed."); 
				}else{
					//add/update product details
					mod_products.addUpdateProduct({
						id : code['id'],
						prefix : code['prefix'],
						item_id : code['item_id'],
						product : code['product'],
						code : code['code'], 
						location : code['location'], 
						price : code['price'], 
						myScan : "1",
						created : currentDateTime(),
						updated : currentDateTime()
					});
					Ti.App.Properties.setString("iCard", code['code']); 
					
				}
				Ti.App.fireEvent('populateData');
			}else{
				COMMON.createAlert("Error","Invalid Code.");
			}
		} 
		
		// 2 - scan to check the product info
		if(scanType == "2"){ 
			var code = getValueFromPipe(e.barcode);    
			if(code['type'] == "resource"){ 
				//tempararily hide
				DRAWER.navigation("resourceDetails",1 ,{p_id: code['resource'] , from: "viewProduct"});
			}else if(code['type'] == "product"){ 
				//var det = mod_invProducts.getProductDetails(code['product']);
				DRAWER.navigation("productDetails",1 ,{p_id: code['product'],code:code['code'] , from: "viewProduct"});
			}else{
				COMMON.createAlert("Error","This is not valid code.");
			}
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
    		//picker.setOrientation(Ti.UI.orientation);
		}	
		else {
			picker.setOrientation(window.orientation);
		}
// 		
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