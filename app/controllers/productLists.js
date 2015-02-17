var args = arguments[0] || {};
var cate = args.category || "";
var presetSearch = Ti.App.Properties.getString("product_search") || "";
$.searchProduct.value = presetSearch;
var PRODUCT = require('_products'); 

var mod_InventoryProd = Alloy.createCollection('product_inventory');  
var mod_Category  = Alloy.createCollection('category'); 
var allType = mod_Category.getCategoryByType("product");
// var lastDistance = 0; 
// $.productView.addEventListener('scroll', function(e) { 
	 // PRODUCT.reloadFromScroll(e);
// });
COMMON.construct($);
COMMON.showLoading();
PRODUCT.construct($);
  
setTimeout(function(){   
	if(presetSearch != ""){  
		var searchResult = mod_InventoryProd.searchProducts(presetSearch,cate); 
 		PRODUCT.displayProduct(searchResult);
	}else{  
		var cateResult = mod_InventoryProd.getProductByCategory(cate); 
		PRODUCT.displayProduct(cateResult); 
	}
	
	 
}, 300); 
 

function refreshTableList(){
	removeAllChildren($.productView);
	PRODUCT.displayProduct(products);	  
}
 
function back(e){ 
	DRAWER.navigation("inventory",1); 
};
/***SEARCH PRODUCTS***/
$.searchProduct.addEventListener('focus', function(e){
	$.searchProduct.showCancel =  true; 
	$.productView.opacity = 1;
	$.productView.height = "auto";
});

$.searchProduct.addEventListener('blur', function(e){
	$.searchProduct.showCancel =  false;
});

$.searchProduct.addEventListener('cancel', function(e){
	Ti.App.Properties.setString("product_search","");
	COMMON.showLoading();
	$.searchProduct.blur();  
	var str = $.searchProduct.getValue();
	if(str == ""){
		removeAllChildren($.productView);
		var cateResult = mod_InventoryProd.getProductByCategory(cate); 
		PRODUCT.displayProduct(cateResult);  
	}
});

var searchProductResult = function(){
	COMMON.showLoading();
	$.searchProduct.blur();
	var str = $.searchProduct.getValue();
	Ti.App.Properties.setString("product_search",str);
	var searchResult = mod_InventoryProd.searchProducts(str,cate); 
	removeAllChildren($.productView);
	PRODUCT.displayProduct(searchResult);		
};
$.searchProduct.addEventListener("return", searchProductResult);

var refreshTableList = function(){
	PRODUCT.refreshTableList();
};
 
Ti.App.addEventListener('refreshTableList' , refreshTableList);
$.productView.addEventListener('touchend', function(e){
    $.searchProduct.blur(); 
});

$.productView.addEventListener('touchend', function(e){
    $.searchProduct.blur(); 
});

