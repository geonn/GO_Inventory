var args = arguments[0] || {}; 
var pageTab = args.tab || "0";
//$.searchProduct.value = presetSearch;
var PRODUCT = require('_products');
var RESOURCE = require('_resources');
 
var mod_InventoryProd = Alloy.createCollection('product_inventory'); 
var mod_InventoryRes  = Alloy.createCollection('resource_inventory'); 
var mod_Category  = Alloy.createCollection('category'); 
var allType = mod_Category.getCategoryByType("product");
var resourcesType = mod_Category.getCategoryByType("resource"); 
changeSlideTab(pageTab);
 
COMMON.construct($);
PRODUCT.construct($);
RESOURCE.construct($); 
COMMON.showLoading(); 

setTimeout(function(){   
	PRODUCT.displayCategory(); 
	RESOURCE.displayCategory();  
	COMMON.hideLoading();
}, 300); 
 

function refreshTableList(){
	removeAllChildren($.productView);
	PRODUCT.displayProduct(products);	  
}

//products and resources tab
function goSlide(event){
	var index = event.source.mod; 
	changeSlideTab(index); 
}

function changeSlideTab(no){
	var arrViews = $.scrollableView.getViews();
	switch(no){
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
	$.scrollableView.scrollToView(arrViews[no]);
}
 
var refreshTableList = function(){
	PRODUCT.refreshTableList();
};

/**********************
 * Clear object and memory
 **********************/
var clearObject = function(){
	mod_InventoryProd = null;
	mod_InventoryRes = null;
	mod_Category = null;
	resourcesType = null;
	allType = null;
	PRODUCT = null;
	RESOURCE = null;
	Ti.App.removeEventListener("clearObject", clearObject);
};
Ti.App.addEventListener("clearObject", clearObject);
//Ti.App.addEventListener('refreshTableList' , refreshTableList); 
