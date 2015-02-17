var args = arguments[0] || {}; 
//$.searchProduct.value = presetSearch;
var PRODUCT = require('_products');
var RESOURCE = require('_resources');

var mod_InventoryProd = Alloy.createCollection('product_inventory'); 
var mod_InventoryRes  = Alloy.createCollection('resource_inventory'); 
var mod_Category  = Alloy.createCollection('category'); 
var allType = mod_Category.getCategoryByType("product");
var lastDistance = 0; 
// $.productView.addEventListener('scroll', function(e) { 
	 // PRODUCT.reloadFromScroll(e);
// });
COMMON.construct($);
COMMON.showLoading();
PRODUCT.construct($);

RESOURCE.construct($); 

setTimeout(function(){   
	PRODUCT.displayCategory(); 
	
	RESOURCE.displayResources(""); 
}, 300); 
 

function refreshTableList(){
	removeAllChildren($.productView);
	PRODUCT.displayProduct(products);	  
}

//products and resources tab
function goSlide(event){
	var index = event.source.mod;
	var arrViews = $.scrollableView.getViews();
	
	switch(index){
		case "0":
			$.lbl_products.backgroundColor = "#FFFFFF";
			$.lbl_products.color = "#494949";
			$.lbl_products.borderColor = "#FFFFFF"; 
			$.lbl_resources.backgroundColor = "#D1D1D1";
			$.lbl_resources.color = "#838383";
			$.lbl_resources.borderColor = "#ADADAD";
			break;
		 
		case "1":
			$.lbl_products.backgroundColor = "#D1D1D1";
			$.lbl_products.color = "#838383";
			$.lbl_products.borderColor = "#ADADAD"; 
			$.lbl_resources.backgroundColor = "#FFFFFF";
			$.lbl_resources.color = "#494949";
			$.lbl_resources.borderColor = "#FFFFFF";
			break;
	} 
	$.scrollableView.scrollToView(arrViews[index]);
}

function addProduct(){ 
	DRAWER.navigation("addProductForm",1);
}

/***SEARCH PRODUCTS***/
// $.searchProduct.addEventListener('focus', function(e){
	// $.searchProduct.showCancel =  true; 
	// $.productView.opacity = 1;
	// $.productView.height = "auto";
// });
// 
// $.searchProduct.addEventListener('blur', function(e){
	// $.searchProduct.showCancel =  false;
// });
// 
// $.searchProduct.addEventListener('cancel', function(e){
	// Ti.App.Properties.setString("product_search","");
	// COMMON.showLoading();
	// $.searchProduct.blur();  
	// var str = $.searchProduct.getValue();
	// if(str == ""){
		// removeAllChildren($.productView);
		// PRODUCT.displayProduct("1");	
	// }
// });
// 
// var searchProductResult = function(){
	// COMMON.showLoading();
	// $.searchProduct.blur();
	// var str = $.searchProduct.getValue();
	// Ti.App.Properties.setString("product_search",str);
	// var searchResult = mod_InventoryProd.searchProducts(str); 
	// removeAllChildren($.productView);
	// PRODUCT.displayProduct(searchResult);		
// };
// $.searchProduct.addEventListener("return", searchProductResult);

var refreshTableList = function(){
	PRODUCT.refreshTableList();
};
 
Ti.App.addEventListener('refreshTableList' , refreshTableList);
$.productView.addEventListener('touchend', function(e){
    //$.searchProduct.blur(); 
});

$.productView.addEventListener('touchend', function(e){
   // $.searchProduct.blur(); 
});

