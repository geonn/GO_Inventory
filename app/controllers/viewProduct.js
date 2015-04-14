var args = arguments[0] || {}; 
var MODULE = require("scanner");
$.viewProductView.height = Ti.Platform.displayCaps.platformHeight;
Ti.App.Properties.setString('parent',"");
API.getResourcesiCardList();
API.getProductiCardList();
/***Create Scanner View***/
// Create a window to add the picker to and display it. 
var window = MODULE.createScannerWindow();

// create start scanner button
var button = MODULE.createScannerButton();

button.addEventListener('click', function() {
	MODULE.openScanner("2");
});

MODULE.init(window); 
$.scanner.add(button);

$.search_btn.addEventListener('click',function(e){
	var searchCode = $.searchField.value;
	searchCode = searchCode.toUpperCase();
	var splitCode = searchCode.split('-'); 
	 
	if(splitCode.length < 2){
		COMMON.createAlert("Error","This is not valid code.");
		return false;	
	}
	
	if(splitCode[0] == "TPI"){  
		//PRODUCT
		var mod_prod = Alloy.createCollection('products');   
		var code = mod_prod.getProductDetails(searchCode); 
		console.log(code);
		if(code == ""){ 
			COMMON.createAlert("Error","Cannot find PRODUCT code.");
			return false;	
		}else{
			DRAWER.navigation("productDetails",1 ,{p_id: code['product'],code:code['code'] , from: "viewProduct"});
		}
	}else{
		//RESOURCE
		var mod_res = Alloy.createCollection('resources');   
		var code =  mod_res.getResourcesByCode(searchCode);
		if(code == ""){ 
			COMMON.createAlert("Error","Cannot find resources code.");
			return false;	
		}else{
			DRAWER.navigation("resourceDetails",1 ,{p_id: code['resource'] , from: "viewProduct"});
		}
			
	} 
	 
});
