var args = arguments[0] || {}; 
var MODULE = require("scanner");
$.viewProductView.height = Ti.Platform.displayCaps.platformHeight;

/***Create Scanner View***/
// Create a window to add the picker to and display it. 
var window = MODULE.createScannerWindow();

// create start scanner button
var button = MODULE.createScannerButton({title: ""});

button.addEventListener('click', function() {
	MODULE.openScanner("2");
});

MODULE.init(window); 
$.scanner.add(button);

$.search_btn.addEventListener('click',function(e){
	var searchCode = $.searchField.value;
	var splitCode = searchCode.split('-');
	alert(searchCode);
	console.log(splitCode);
	// if(code['type'] == "resource"){  
		// DRAWER.navigation("resourceDetails",1 ,{p_id: code['resource'] , from: "viewProduct"});
	// }else if(code['type'] == "product"){ 
				// //var det = mod_invProducts.getProductDetails(code['product']);
		// DRAWER.navigation("productDetails",1 ,{p_id: code['product'],code:code['code'] , from: "viewProduct"});
	// }else{
		// COMMON.createAlert("Error","This is not valid code.");
	// }
});
