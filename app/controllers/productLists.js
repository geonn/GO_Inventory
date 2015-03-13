var args = arguments[0] || {};
var cate = args.category || ""; 
Ti.App.Properties.setString('parent',"inventory||0");
var presetSearch = Ti.App.Properties.getString("product_search") || "";
$.searchProduct.value = presetSearch;
var PRODUCT = require('_products'); 

var mod_InventoryProd = Alloy.createCollection('product_inventory');  
var mod_Category  = Alloy.createCollection('category'); 
var allType = mod_Category.getCategoryByType("product");
$.appTitle.text = cate;
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

function addProduct(){ 
	DRAWER.navigation("addProductForm",1,{category:cate});
}

function refreshTableList(){
	console.log("check listener");
	removeAllChildren($.productView);
	PRODUCT.displayProduct(products);	  
}
 
function back(e){ 
	DRAWER.navigation("inventory",1,{tab:"0"}); 
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
 
//Ti.App.addEventListener('refreshTableList' , refreshTableList);
$.productView.addEventListener('touchend', function(e){
    $.searchProduct.blur(); 
});

$.productView.addEventListener('touchend', function(e){
    $.searchProduct.blur(); 
});

/**********************
 * Clear object and memory
 **********************/
var clearObject = function(){
	mod_InventoryProd = null;
	mod_Category = null;
	allType = null; 
	PRODUCT = null; 
	searchProductResult = null;
	refreshTableList = null;
	Ti.App.removeEventListener("clearObject", clearObject);
};
Ti.App.addEventListener("clearObject", clearObject);	
