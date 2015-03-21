var args = arguments[0] || {};
var p_id = args.p_id || "";
var from = args.from || "";

var mod_InventoryRes = Alloy.createCollection('resource_inventory');  
var presetSearch = Ti.App.Properties.getString("resource_search") || "";
var RESOURCE = require('_resources');
var RES_CONTENTS = require('_resource_contents');
var curCate;
RESOURCE.construct($);
RES_CONTENTS.construct($);

COMMON.construct($);
COMMON.showLoading();

var resDetails = mod_InventoryRes.getResourceDetails(p_id);
  
if(from != ""){ 
	Ti.App.Properties.setString('parent',from);
}else{
	Ti.App.Properties.setString('parent',"resourceLists||"+resDetails.type);
}
 
if(Ti.Platform.osname == "android"){ 
	$.item_Details.height =   PixelsToDPUnits(Ti.Platform.displayCaps.platformHeight)  -50;  
} 
setTimeout(function(){  
	if(presetSearch != ""){
		var items = mod_InventoryRes.searchResources(presetSearch);  
 	}else{
 		var items = resDetails;
 	}	
 	getResourceDetails(items); 
 	items = null;
}, 200); 

var getResourceDetails = function(items){
	var position; 
	   		
	/***Set ads items***/
	curCate = items['type']; 
	$.appTitle.text = items['type'];
	 
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
	row.add(RES_CONTENTS.displayResourceImage(items['image'], items['id']));
		
	/***Create and Add Header***/
	row.add(RES_CONTENTS.displayHeader()); 
		
	/***Create and Add Product Contents***/
	row.add(RES_CONTENTS.displayResourceContents(items)); 
		
	scrollView.add(row);
	COMMON.hideLoading();
	$.item_Details.add(scrollView); 
};

function goBack(){
	if(from != ""){
		DRAWER.navigation(from,1);
	}else{
		DRAWER.navigation("resourceLists",1,{type:curCate});
	} 
	
}

/**********************
 * Clear object and memory
 **********************/
var clearObject = function(){ 
	
	mod_InventoryRes = null;
	presetSearch = null;
	RESOURCE = null; 
	RES_CONTENTS = null; 
	curCate = null;
	resDetails = null;
	getResourceDetails= null;
	Ti.App.removeEventListener("clearObject", clearObject);
};
Ti.App.addEventListener("clearObject", clearObject);	