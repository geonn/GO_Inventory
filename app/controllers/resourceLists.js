var args = arguments[0] || {};
var cate = args.type || "";
var presetSearch = Ti.App.Properties.getString("resource_search") || "";
$.searchResource.value = presetSearch;
var RESOURCE = require('_resources'); 

var mod_InventoryRes = Alloy.createCollection('resource_inventory'); 
var mod_Category  = Alloy.createCollection('category'); 
var allType = mod_Category.getCategoryByType("resource");
$.appTitle.text = cate;
// var lastDistance = 0; 
// $.resourceView.addEventListener('scroll', function(e) { 
	 // PRODUCT.reloadFromScroll(e);
// });
COMMON.construct($);
COMMON.showLoading();
RESOURCE.construct($);
  
setTimeout(function(){   
	if(presetSearch != ""){  
		var searchResult = mod_InventoryRes.searchResources(presetSearch,cate); 
 		RESOURCE.displayResources(searchResult);
	}else{  
		var cateResult = mod_InventoryRes.getResourceByCategory(cate); 
		RESOURCE.displayResources(cateResult); 
	}
	
	 
}, 300); 
 

function refreshTableList(){
	removeAllChildren($.resourceView);
	RESOURCE.displayResources(products);	  
}
 
function back(e){ 
	DRAWER.navigation("inventory",1,{tab: "1"}); 
};
/***SEARCH PRODUCTS***/
$.searchResource.addEventListener('focus', function(e){
	$.searchResource.showCancel =  true; 
	$.resourceView.opacity = 1;
	$.resourceView.height = "auto";
});

$.searchResource.addEventListener('blur', function(e){
	$.searchResource.showCancel =  false;
});

$.searchResource.addEventListener('cancel', function(e){
	Ti.App.Properties.setString("resource_search","");
	COMMON.showLoading();
	$.searchResource.blur();  
	var str = $.searchResource.getValue();
	if(str == ""){
		removeAllChildren($.resourceView);
		var cateResult = mod_InventoryRes.getResourceByCategory(cate); 
		RESOURCE.displayResources(cateResult);  
	}
});

var searchResourceResult = function(){
	COMMON.showLoading();
	$.searchResource.blur();
	var str = $.searchResource.getValue();
	Ti.App.Properties.setString("product_search",str);
	var searchResult = mod_InventoryRes.searchResources(str,cate); 
	removeAllChildren($.resourceView);
	RESOURCE.displayProduct(searchResult);		
};
$.searchResource.addEventListener("return", searchResourceResult);

var refreshTableList = function(){
	RESOURCE.refreshTableList();
};
 
Ti.App.addEventListener('refreshTableList' , refreshTableList);
$.resourceView.addEventListener('touchend', function(e){
    $.searchResource.blur(); 
});

$.resourceView.addEventListener('touchend', function(e){
    $.searchResource.blur(); 
});

