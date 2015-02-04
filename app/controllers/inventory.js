var args = arguments[0] || {};
var mod_InventoryProd = Alloy.createCollection('product_inventory'); 
COMMON.construct($);
var details = mod_InventoryProd.getProductList(); 
COMMON.showLoading();
setTimeout(function(){  
	displayProduct(details); 
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
			    height: 70,
			    source: entry.code,
			    selectedBackgroundColor: "#ECFFF9",
				backgroundGradient: {
			      type: 'linear',
			      colors: ['#FEFEFB','#F7F7F6'],
			      startPoint: {x:0,y:0},
			      endPoint:{x:0,y:70},
			      backFillStart:false},
			    });
				
				var tblView = Ti.UI.createView({
					layout: "vertical",
					height:"80",
					width:"auto" 
				}); 
				
				var leftImage =  Titanium.UI.createImageView({
					image:entry.image,
					source: entry.id,
					width:"20%",
					height:50,
					left:10,
					top:10
				});	
		 
				var popUpTitle = Titanium.UI.createLabel({
					text:entry.name,
					font:{fontSize:16},
					source: entry.id,
					color: "#848484",
					width:'50%',
					textAlign:'left',
					top:15,
					left:80,
					height:Ti.UI.SIZE
				});
				
				var category =  Titanium.UI.createLabel({
					text:entry.category,
					source: entry.id,
					font:{fontSize:12,fontWeight:'bold'},
					width:'auto',
					color: "#848484",
					textAlign:'left',
					width:'50%', 
					left:80,
					height:Ti.UI.SIZE
				});
				
				var distance =  Titanium.UI.createLabel({
					text:entry.code,
					source: entry.id,
					font:{fontSize:12,fontWeight:'bold'},
					width:'50%',
					color: "#848484",
					textAlign:'left',  
					left:80,
					height:Ti.UI.SIZE
				}); 
				
				 
				row.addEventListener('touchend', function(e) {
				 	viewDetails(e);
				});
			 
				row.add(leftImage);
				tblView.add(popUpTitle);
				tblView.add(category);
			 	tblView.add(distance);  
			 	row.add(tblView);
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
		displayProduct(details);	
	}
		
});

var searchResult = function(){
	COMMON.showLoading();
	$.searchProduct.blur();
	var str = $.searchProduct.getValue();
	 
	var searchResult = mod_InventoryProd.searchProducts(str); 
	removeAllChildren($.productView);
	displayProduct(searchResult);		
};
$.searchProduct.addEventListener("return", searchResult);

Ti.App.addEventListener('refreshTableList' , refreshTableList);
$.productView.addEventListener('touchend', function(e){
    $.searchProduct.blur(); 
});