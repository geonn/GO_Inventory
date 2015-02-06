var args = arguments[0] || {};
var p_id = args.p_id || {};
var mod_InventoryProd = Alloy.createCollection('product_inventory');  
var items = mod_InventoryProd.getProductList(); 
COMMON.construct($);
COMMON.showLoading(); 

setTimeout(function(){  
	getProductDetails(items); 
}, 1000); 

var getProductDetails = function(items){
	 
	var imagepath, adImage, row = '', position;
	var my_page = 0;
	   		
	/***Set ads items***/
	var the_view = []; 
	for (var i=0; i< items.length; i++) {
	 
		if(items[i].id == p_id){ 
			position=  items[i].position;
		}
		adImage = Titanium.UI.createImageView({
			image: items[i].image,
			width:"100%"
		});
		
		var scrollView = Ti.UI.createScrollView({
			contentWidth: 'auto',
		  	contentHeight: 'auto',
		   
		  	height: Ti.UI.SIZE,
		  	width: '100%'
		});
	
		row = $.UI.create('View', {classes: ["row"], id:"view"+items[i].position});
		
		$.item_Details.title=items[i].name;
		row.add(adImage);
		//row.add(img_caption);
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
	DRAWER.navigation("inventory",1);
}
