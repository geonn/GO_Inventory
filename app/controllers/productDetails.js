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

if(Ti.Platform.osname == "android"){ 
	$.item_Details.height =   PixelsToDPUnits(Ti.Platform.displayCaps.platformHeight)  -50;  
}
		 
setTimeout(function(){  
	if(presetSearch != ""){
		var items = mod_InventoryProd.searchProducts(presetSearch);  
 	}else{
 		var items = mod_InventoryProd.getProductByCategory(prodDetails.category);  
 	}	
 	getProductDetails(items); 
}, 100); 

var getProductDetails = function(items){ 
	var row = '', position; 
	
	/***Set ads items***/
	var the_view = []; 
	for (var i=0; i< items.length; i++) {
	 
		if(items[i].id == p_id){ 
			position = items[i].position;
			curCate  = items[i].category;
			$.appTitle.text = curCate;
		}
		 
		var scrollView = Ti.UI.createScrollView({
			contentWidth: 'auto',
		  	contentHeight: 'auto', 
		  	height: Ti.UI.SIZE,
		  	width: '100%'
		});
	
		row = $.UI.create('View', {
			classes: ["row"], 
			id:"view"+items[i].position,
			layout: "vertical"
		}); 
		
		$.item_Details.title=items[i].name;
		
		/***Create and Add Product Image***/
		row.add(PROD_CONTENTS.displayProductImage(items[i].image));
		
		/***Create and Add Header***/
		row.add(PROD_CONTENTS.displayHeader()); 
		
		/***Create and Add Product Contents***/
		row.add(PROD_CONTENTS.displayProductContents(items[i])); 
			
		scrollView.add(row);
		the_view.push(scrollView); 
	} 

	var scrollableView = Ti.UI.createScrollableView({
		  id: "scrollableView",
		  views:the_view,
		  showPagingControl:false
	});
	
	$.item_Details.add(scrollableView);
	scrollableView.scrollToView(position, true);  
	COMMON.hideLoading();
};

function goBack(){
	if(from != ""){
		DRAWER.navigation(from,1);
	}else{
		DRAWER.navigation("productLists",1,{category:curCate});
	}
	
}
