var args = arguments[0] || {};
var PRODUCT = require('_products');
var RESOURCE = require('_resources');

var mod_InventoryProd = Alloy.createCollection('product_inventory'); 
var mod_InventoryRes  = Alloy.createCollection('resource_inventory'); 
 
COMMON.construct($);
COMMON.showLoading();
PRODUCT.construct($);
RESOURCE.construct($); 

setTimeout(function(){  
	PRODUCT.displayProduct(""); 
	RESOURCE.displayResources(""); 
}, 1000); 

function displayProduct(products){
	
	var TheTable = Titanium.UI.createTableView({
		width:'100%',
		backgroundImage: "/images/bg.jpg",
		separatorColor: '#375540'
	});
	
	var data=[]; 
		//hide loading bar
		COMMON.hideLoading();
 
   		var counter = 0;
   		
   		if(products.length < 1){
			var noRecord = Ti.UI.createLabel({ 
			    text: "No record found", 
			    color: '#375540', 
			    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			    font:{fontSize:14,fontStyle:'italic'},
			    top: 15,
			    width: "100%"
			 });
			$.productView.add(noRecord);
		}else{

	   		products.forEach(function(entry) {
	   			 
	   			var row = Titanium.UI.createTableViewRow({
			    touchEnabled: true,
			    source: entry.code,
			    selectedBackgroundColor: "#ECFFF9",
				backgroundGradient: {
				      type: 'linear',
				      colors: ['#fff','#F7F7F6'],
				      startPoint: {x:0,y:0},
				      endPoint:{x:"100%",y:0},
				      backFillStart:false
				    },
			    });
				
				var row_view = Ti.UI.createView({
					left: 5,
			    	top: 5, 
			    	right: 5,
			    	bottom: 5,
			    	height: Ti.UI.SIZE,
			    	width: Ti.UI.FILL,
			    	layout: "horizontal",
				});
				
				var tblView = Ti.UI.createView({
					layout: "vertical",
					height: Ti.UI.SIZE,
					width:"auto",
				}); 
				
				var leftImage =  Titanium.UI.createImageView({
					image:entry.image,
					source: entry.id,
					width: 112,
					right: 10,
					height: 80,
				});	
		 
				var popUpTitle = Titanium.UI.createLabel({
					text:entry.name,
					font:{fontSize:14, fontWeight:'bold'},
					source: entry.id,
					color: "#848484",
					width: Ti.UI.FILL,
					height: Ti.UI.SIZE,
					textAlign:Titanium.UI.TEXT_ALIGNMENT_LEFT,
					wordwrap: false,
					ellipsize: true
				});
				
				var category =  Titanium.UI.createLabel({
					text:entry.category,
					source: entry.id,
					font:{fontSize:11},
					color: "#848484",
					textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
					width: Ti.UI.FILL,
					height: Ti.UI.SIZE,
				});
				
				var distance =  Titanium.UI.createLabel({
					text:entry.code,
					source: entry.id,
					font:{fontSize:11},
					color: "#848484",
					textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
					width: Ti.UI.FILL,
					height: 14,
					ellipsize: true
				}); 
				
				var quantity_view = Ti.UI.createView({
					layout: "horizontal",
					width: Ti.UI.FILL,
					height: Ti.UI.SIZE,
					top: 5,
				});
				
				var quantity_text_view = Ti.UI.createView({
					width: Ti.UI.SIZE,
					height: Ti.UI.SIZE,
					backgroundColor: "red",
				});
				 
				var quantity_text =  Titanium.UI.createLabel({
					text: "QUANTITY",
					source: entry.id,
					font:{fontSize:14},
					left: 5,
					right: 5,
					color: "#ffffff",
					textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
					width: Ti.UI.SIZE,
					height: 20,
				});
				
				var quantity_text_input = Titanium.UI.createTextField({
					editable: false,
					borderColor: "red",
					height: 20,
					width: Ti.UI.FILL,
					value: 1000,
					textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
				});
				
				quantity_text_view.add(quantity_text);
				quantity_view.add(quantity_text_view);
				quantity_view.add(quantity_text_input);
				
				row.addEventListener('touchend', function(e) {
				 	viewDetails(e);
				});
			 	
				tblView.add(popUpTitle);
				tblView.add(category);
			 	tblView.add(distance);  
			 	tblView.add(quantity_view);
			 	
			 	row_view.add(leftImage);
			 	row_view.add(tblView);
			 	row.add(row_view);
			 	data.push(row);
	   		});
	   		
	   		TheTable.setData(data); 
			$.productView.add(TheTable);
		} 
};

function refreshTableList(){
	removeAllChildren($.productView);
	displayProduct(products);	  
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
	$.searchProduct.blur();  
	var str = $.searchProduct.getValue();
	if(str == ""){
		removeAllChildren($.productView);
		PRODUCT.displayProduct(details);	
	}
});

var searchProductResult = function(){
	COMMON.showLoading();
	$.searchProduct.blur();
	var str = $.searchProduct.getValue();
	var searchResult = mod_InventoryProd.searchProducts(str); 
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