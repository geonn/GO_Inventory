var args = arguments[0] || {};
var p_id = args.p_id || {};
var from = args.from || "";

var mod_InventoryProd = Alloy.createCollection('product_inventory');  
var presetSearch = Ti.App.Properties.getString("product_search") || "";
var PRODUCT = require('_products');
var curCate;
var PROD_CONTENTS = require('_product_contents');
PROD_CONTENTS.construct($);
COMMON.construct($);
COMMON.showLoading(); 
var prodDetails = mod_InventoryProd.getProductDetails(p_id);
Ti.App.Properties.setString('parent',"productLists||"+prodDetails.category);
if(Ti.Platform.osname == "android"){ 
	$.item_Details.height =   PixelsToDPUnits(Ti.Platform.displayCaps.platformHeight)  -50;  
}
		 
setTimeout(function(){  
	if(presetSearch != ""){
		var items = mod_InventoryProd.searchProducts(presetSearch);  
 	}else{
 		var items = prodDetails;
 	}	
 	getProductDetails(items); 
}, 100); 

var getProductDetails = function(items){ 
	var row = '', position; 
	
	/***Set ads items***/ 
	curCate = items['category']; 
	$.appTitle.text = items['category'];
	var scrollView = Ti.UI.createScrollView({  
	  	height: "100%",
	  	width: '100%'
	});
	
	row = $.UI.create('View', {
		classes: ["row"],  
		id:"view"+items['position'],
		layout: "vertical"
	}); 
		
	$.item_Details.title=items['name'];
		
	/***Create and Add Product Image***/
	row.add(PROD_CONTENTS.displayProductImage(items['image'],items['id']));
		
	/***Create and Add Header***/
	row.add(PROD_CONTENTS.displayHeader()); 
		
	/***Create and Add Product Contents***/
	row.add(PROD_CONTENTS.displayProductContents(items)); 
			
	scrollView.add(row); 

	 
	$.item_Details.add(scrollView); 
	COMMON.hideLoading();
};

function goBack(){
	if(from != ""){
		DRAWER.navigation(from,1);
	}else{
		DRAWER.navigation("productLists",1,{category:curCate});
	}
	
}
