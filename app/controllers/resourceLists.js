var args = arguments[0] || {};
var cate = args.type || "";
Ti.App.Properties.setString('parent',"inventory||1");
var presetSearch = Ti.App.Properties.getString("resource_search") || "";
$.searchResource.value = presetSearch;
var RESOURCE = require('_resources'); 

var mod_InventoryRes = Alloy.createCollection('resource_inventory'); 
var mod_Category  = Alloy.createCollection('category'); 
var allType = mod_Category.getCategoryByType("resource");
$.appTitle.text = cate; 

COMMON.construct($);
COMMON.showLoading();
RESOURCE.construct($);
API.checkResourceItems(cate);

setTimeout(function(){   
	if(presetSearch != ""){  
		var searchResult = mod_InventoryRes.searchResources(presetSearch,cate); 
 		RESOURCE.displayResources(searchResult);
	}else{  
		var cateResult = mod_InventoryRes.getResourceByCategory(cate); 
		RESOURCE.displayResources(cateResult); 
	} 
	 
}, 300); 
 
function addResource(){ 
	DRAWER.navigation("addResourceForm",1,{category:cate});
}

function refreshTableList(){
	$.resTable.data = [];
	var cateResult = mod_InventoryRes.getResourceByCategory(cate); 
	RESOURCE.displayResources(cateResult);
	cateResult = null;
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
		$.resTable.data = [];
		var cateResult = mod_InventoryRes.getResourceByCategory(cate); 
		RESOURCE.displayResources(cateResult);  
	}
});

var searchResourceResult = function(){
	COMMON.showLoading();
	$.searchResource.blur();
	var str = $.searchResource.getValue();
	Ti.App.Properties.setString("resource_search",str);
	var searchResult = mod_InventoryRes.searchResources(str,cate); 
	$.resTable.data = [];
	RESOURCE.displayResources(searchResult);		
};
$.searchResource.addEventListener("return", searchResourceResult);

var refreshTableList = function(){
	RESOURCE.refreshTableList();
};
 
//Ti.App.addEventListener('refreshTableList' , refreshTableList);
$.resourceView.addEventListener('touchend', function(e){
    $.searchResource.blur(); 
});

$.resourceView.addEventListener('touchend', function(e){
    $.searchResource.blur(); 
});
 
/**********************
 * Clear object and memory
 **********************/
var clearObject = function(){ 
	RESOURCE.deconstruct(); 
	
	mod_InventoryRes = null;
	presetSearch = null;
	RESOURCE = null;
	mod_Category = null;
	allType = null;
	searchResourceResult = null;
	refreshTableList = null;
	Ti.App.removeEventListener("clearObject", clearObject);
};
Ti.App.addEventListener("clearObject", clearObject);
