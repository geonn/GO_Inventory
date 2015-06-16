var args = arguments[0] || {};
var p_id = args.p_id || "";
var code = args.code || "";
var from = args.from || "";  

Ti.App.Properties.setString('parent',from);
var curCate; 
var mod_InventoryProd = Alloy.createCollection('product_inventory');  
var PRODUCT = require('_products');
var PROD_CONTENTS = require('_product_contents');
PROD_CONTENTS.construct($);
COMMON.construct($);
COMMON.showLoading();
var prodDetails = mod_InventoryProd.getProductDetails(p_id);

Ti.App.Properties.setString('parent',"productLists||"+prodDetails.category);
if(Ti.Platform.osname == "android"){ 
	//$.item_Details.height =   PixelsToDPUnits(Ti.Platform.displayCaps.platformHeight)  ;//-50;  
}	 

setTimeout(function(){
	var items = prodDetails;
 	getProductDetails(items); 
}, 100); 

function reloadPage(){
	var items = mod_InventoryProd.getProductDetails(p_id);
	getProductDetails(items); 
	
}
Ti.App.addEventListener('reloadPage' , reloadPage);
var getProductDetails = function(items){ 
	var row = '', position; 
	
	/***Set ads items***/ 
	curCate = items['category']; 
	$.appTitle.text = items['category'];
	var scrollView = Ti.UI.createView({   
	  	width: '100%',
	  	top:0
		//height : Ti.Platform.displayCaps.platformHeight-30
	});

	row = $.UI.create('View', {
		id:"view"+items['position'],
		layout: "vertical",
		height:Ti.UI.SIZE,
		bottom:20,
		top: 0
	}); 
		
	$.item_Details.title=items['name'];
	 
	/***Create and Add Product Image***/
	row.add(PROD_CONTENTS.displayProductImage(items['image'],items['id']));
	 
	/***Create and Add Header***/
	row.add(PROD_CONTENTS.displayHeader()); 
	 
	/***Create and Add Product Contents***/
	row.add(PROD_CONTENTS.displayProductContents(items, code)); 
	
	
	if(code != ""){
		/***Create iResource Header***/
		row.add(PROD_CONTENTS.displayResourceHeader());  
		/***List Product Resources if any***/
		row.add(PROD_CONTENTS.displayProductResources(code));  
	} 
	//scrollView.add(); 
	
	$.item_Details.add(row); 
	if(code != ""){ 
		/***Bottom Bar***/
		$.mainProductDetails.add(PROD_CONTENTS.displayBottomBar(code)); 
	} 
	COMMON.hideLoading(); 
};

function goBack(){
	if(from != ""){
		DRAWER.navigation(from,1);
	}else{
		DRAWER.navigation("productLists",1,{category:curCate});
	} 
}

/**********************
 * Clear object and memory
 **********************/
var clearObject = function(){
	  
	curCate = null;
	getProductDetails = null;
	resourcesType = null;
	prodDetails = null;
	PROD_CONTENTS = null;
	Ti.App.removeEventListener("clearObject", clearObject);
	Ti.App.removeEventListener('reloadPage' , reloadPage);
};
Ti.App.addEventListener("clearObject", clearObject);	