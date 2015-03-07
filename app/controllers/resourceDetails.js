var args = arguments[0] || {};
var p_id = args.p_id || {};
var mod_InventoryRes = Alloy.createCollection('resource_inventory');  
var presetSearch = Ti.App.Properties.getString("resource_search") || "";
var RESOURCE = require('_resources');
var RES_CONTENTS = require('_resource_contents');
var curCate;
RES_CONTENTS.construct($);
COMMON.construct($);
COMMON.showLoading();  
var resDetails = mod_InventoryRes.getResourceDetails(p_id);
if(Ti.Platform.osname == "android"){ 
	$.item_Details.height =   PixelsToDPUnits(Ti.Platform.displayCaps.platformHeight)  -50;  
}
setTimeout(function(){  
	if(presetSearch != ""){
		var items = mod_InventoryRes.searchResources(presetSearch);  
 	}else{
 		var items = mod_InventoryRes.getResourceByCategory(resDetails.type);  
 	}	
 	getResourceDetails(items); 
}, 200); 

var getResourceDetails = function(items){
	var row = '', position; 
	   		
	/***Set ads items***/
	var the_view = []; 
	for (var i=0; i< items.length; i++) {
	 
		if(items[i].id == p_id){ 
			position=  items[i].position;
			curCate  = items[i].type;
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
		row.add(RES_CONTENTS.displayResourceImage(items[i].image, items[i].id));
		
		/***Create and Add Header***/
		row.add(RES_CONTENTS.displayHeader()); 
		
		/***Create and Add Product Contents***/
		row.add(RES_CONTENTS.displayResourceContents(items[i])); 
		
		scrollView.add(row);
		the_view.push(scrollView); 
	} 

	var scrollableView = Ti.UI.createScrollableView({
		  id: "scrollableView",
		  views:the_view,
		  showPagingControl:false
	});
	COMMON.hideLoading();
	$.item_Details.add(scrollableView);
 
	scrollableView.scrollToView(position, true);  
};

function goBack(){
	DRAWER.navigation("resourceLists",1,{type:curCate});
}
