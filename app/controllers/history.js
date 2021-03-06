var args = arguments[0] || {};
var pop;
var mod_InventoryProd = Alloy.createCollection('product_inventory');
var mod_products = Alloy.createCollection('products'); 
var mod_resources = Alloy.createCollection('resources'); 
Ti.App.Properties.setString('parent',""); 
$.hView.height = Ti.Platform.displayCaps.platformHeight - 50;

COMMON.construct($);
COMMON.showLoading();
var products = mod_products.getScanProduct();  
setTimeout(function(){ 
	displayProduct(products); 
}, 300); 

function displayProduct(products){
	//hide loading bar
	COMMON.hideLoading();  
	var data=[];  
	var counter = 0; 
	
	if(products.length < 1){ 
		$.hisTable.setData(COMMON.noRecord());
	}else{ 
		products.forEach(function(entry) {
			if(entry.updated != "null"){
				
				var toSync = mod_resources.getResourcesToSync({iCard: entry.code});
				var prodDetails = mod_InventoryProd.getProductDetails(entry.product); 
				var row = Titanium.UI.createTableViewRow({
			    touchEnabled: true,
			    height: 70,
			    source: entry.code,
			    backgroundSelectedColor: "#ECFFF9",
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
					width:"100%" 
				}); 
				
				var leftImage =  Titanium.UI.createImageView({
					image:prodDetails.image,
					defaultImage: "/images/warm-grey-bg.png",
					source: entry.code,
					width:"20%",
					height:50,
					left:10,
					top:10
				});	
		 
				var popUpTitle = Titanium.UI.createLabel({
					text:prodDetails.name,
					font:{fontSize:16},
					source: entry.code,
					color: "#848484",
					width:'50%',
					textAlign:'left',
					top:15,
					left:80,
					height:Ti.UI.SIZE
				});
				
				var category =  Titanium.UI.createLabel({
					text:entry.code,
					source: entry.code,
					font:{fontSize:12,fontWeight:'bold'},
					width:'auto',
					color: "#848484",
					textAlign:'left',
					width:'50%', 
					left:80,
					height:Ti.UI.SIZE
				});
				
				var distance =  Titanium.UI.createLabel({
					text:timeFormat(entry.updated),
					source: entry.code,
					font:{fontSize:12,fontWeight:'bold'},
					width:'50%',
					color: "#848484",
					textAlign:'left',  
					left:80,
					height:Ti.UI.SIZE
				}); 
				 
				row.addEventListener('click', function(e) {
				 	viewDetails(e);
				});
			 
				row.add(leftImage);
				var activityIndicator = COMMON.showImageIndicator();  
				row.add(activityIndicator);
				COMMON.imageIndicatorEvent(leftImage,activityIndicator); 
			
				tblView.add(popUpTitle);
				tblView.add(category);
			 	tblView.add(distance);  
			 	row.add(tblView);
			 	
			 	//Add Sync button
			 	if(toSync.length > 0){ 
					var syncButton =  Titanium.UI.createButton({
						title:"Sync",
						source: entry.code, 
						width:'20%',
						color: "#848484", 
						right:5,
						height:Ti.UI.SIZE
					}); 
					
					syncButton.addEventListener('click', function(e){ 
						syncScanToServer(entry.code,toSync);
					});
					row.add(syncButton);
				} 
				data.push(row);
			}
		});
		
		$.hisTable.setData(data);  	
		data = null;	
	} 
	
};

function syncScanToServer(iCard, data){
	var prod = mod_products.getProductDetails(iCard);
 
	API.updatedCombination({
			iCard : iCard,
			data : data 
	}); 
 	
}

// function refreshTableList(){
	// removeAllChildren($.historyScrollView);
	// displayProduct(products);	  
// }

function viewDetails(e){   
	if(e.source.title == "Sync"){
		return false;
	}
	var res_det = mod_resources.getResourcesByicard(e.rowData.source);
	var containerView = Ti.UI.createView({
		layout: "composite",
		height:"100%",
		width:"100%",
		backgroundColor: "black"
	}); 
 
	var confirmView = Ti.UI.createView({
		layout: "vertical",
		height:"100%",
		width:"100%"
	});
	var titleView = Ti.UI.createView({
		layout: "composite",
		height:"15%",
		width:"100%",
		backgroundColor:"#375540"
	});
	var titleLabel = Ti.UI.createLabel({
		color: '#ffffff',
		font: { fontSize:16 },
		text: 'Details of '+ e.rowData.source,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		width: Ti.UI.SIZE, 
		height: Ti.UI.SIZE
	});
	
	var contentView = Ti.UI.createScrollView({
		layout: "vertical",
		height:"65%",
		backgroundColor:"#EFEFEF", 
		width:"100%" 
	});
 	
 	if(res_det.length == 0){
 		var resource_label = $.UI.create('Label', {
			classes : ['gray_text'], 
			font: { fontSize:12 },
			text: "No resource yet",  
			width: "100%",   
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			top: 5,
			bottom: 50
		});
		contentView.add(resource_label);
 	}else{
 		for(var i=0; i < res_det.length; i++){ 
 			var textColor = "#365640"; 
			if(res_det[i].status == "1"){
				var textColor = "#9D001D";
			}
			console.log(res_det[i]);
			var resource_label = $.UI.create('Label', {
			  classes : ['gray_text'], 
			  color: textColor,
			  font: { fontSize:12 },
			  text: res_det[i].name	+ " ("+res_det[i].code+") at "+ timeFormat(res_det[i].updated),  
			  width: "90%",  
			  left:10,
			  textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			  top: 5,
			  bottom: 5
			});
			
			var centerImageView = Ti.UI.createView({ 
				height:"1",
				backgroundColor: "#375540",
				width: "100%",
			});
			contentView.add(resource_label);
			contentView.add(centerImageView);
		}
 	}
	
	var centerImageView = Ti.UI.createView({
		layout: "composite",
		height:"20%",
		bottom:5, 
		width: "100%",
		backgroundColor:"#EFEFEF", 
	});
	
	okayBtn = Ti.UI.createImageView({
		image:'/images/Button_OK.png',  
		height: "90%",
		bottom: 5 
	});
	 
	titleView.add(titleLabel);  
	centerImageView.add(okayBtn);
	confirmView.add(titleView);
	confirmView.add(contentView);
	confirmView.add(centerImageView);
	containerView.add(confirmView);
	var config = [];
	config.width = "70%";
	config.height = "55%";
	pop = COMMON.popup(containerView,config);
	pop.open({fullscreen:true, navBarHidden: true}); 
	addDoneEvent(okayBtn,pop);  
		
}

function addDoneEvent(myView, popView){
	myView.addEventListener('click', function(e){
		pop.close();
	});
}
/***SEARCH PRODUCTS***/
$.searchItem.addEventListener('focus', function(e){
	$.searchItem.showCancel =  true; 
	$.hisTable.opacity = 1;
	$.hisTable.height = "auto";
});

$.searchItem.addEventListener('blur', function(e){
	$.searchItem.showCancel =  false;
});

$.searchItem.addEventListener('cancel', function(e){
	$.searchItem.blur();  
	var str = $.searchItem.getValue();
	if(str == ""){
		$.hisTable.data = [];
		displayProduct(products);	
	}
		
});

var searchResult = function(){
	COMMON.showLoading();
	$.searchItem.blur();
	var str = $.searchItem.getValue();
	 
	var searchResult = mod_products.searchProducts(str); 
	$.hisTable.data = [];
	displayProduct(searchResult);		
};
$.searchItem.addEventListener("return", searchResult);
 
$.historyView.addEventListener('touchend', function(e){
    $.searchItem.blur(); 
});

/**********************
 * Clear object and memory
 **********************/
var clearObject = function(){ 
	$.hisTable.data = []; 
	products = null; 
	mod_InventoryProd = null;
    mod_products = null;
	mod_resources = null;
	searchResult = null;
	Ti.App.removeEventListener("clearObject", clearObject);
};
Ti.App.addEventListener("clearObject", clearObject);	
