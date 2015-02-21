var mainView = null;
var mod_InventoryProd = Alloy.createCollection('product_inventory');  
 
function displayCategory(){
	var data=[]; 
	var category = mod_InventoryProd.getProductCategory(); 
	if(category.length < 1){
		var noRecord = Ti.UI.createLabel({ 
			text: "No record found", 
			color: '#375540', 
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		 	font:{fontSize:14,fontStyle:'italic'},
			top: 15,
			width: "100%"
		});
		mainView.productView.add(noRecord);
	}else{
		var counter =1;
		
		category.forEach(function(entry) {
			 
			var row = Titanium.UI.createTableViewRow({
		    touchEnabled: true,
		    source: entry.category,  
		    backgroundColor: "#ffffff",
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
		    	height: 30,
		    	width: Ti.UI.FILL,
		    	source: entry.category,  
		    	layout: "horizontal",
			});
			
			var tblView = Ti.UI.createView({
				layout: "vertical",
				source: entry.category,  
				height:"30",
				width: "90%",
			}); 
			
			 
			var popUpTitle = Titanium.UI.createLabel({
				text:entry.category + " ("+entry.total+")",
				font:{fontSize:14, fontWeight:'bold'},
				source: entry.category,
				color: "#848484",
				width: "90%",
				height: Ti.UI.SIZE,
				textAlign:Titanium.UI.TEXT_ALIGNMENT_LEFT,
				wordwrap: false,
				ellipsize : true
			});
			
			var rightImage =  Titanium.UI.createImageView({
				image:"/images/btn-forward",
				source: entry.category,
				width: 20,
				right: 10,
				height: 20,
			});	
			
			row.addEventListener('click', function(e) {
			 	viewProductList(e);
			});
		 	
			tblView.add(popUpTitle); 
		 	
		 	row_view.add(tblView);
		 	row_view.add(rightImage);
		 	row.add(row_view);
		 	data.push(row);
		  
		});
	 
		mainView.prodTable.setData(data); 
		mainView.productView.add(mainView.prodTable);
	}
}

function displayProduct(products){
	if(products == "1"){
		var details = mod_InventoryProd.getProductList(0); 
		products = details;
	}
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
		mainView.productView.add(noRecord);
	}else{
		var counter =1;
		
		products.forEach(function(entry) {
			 
			var row = Titanium.UI.createTableViewRow({
		    touchEnabled: true,
		    source: entry.id, 
		    position: counter,
		    backgroundColor: "#ffffff",
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
		    	height: 80,
		    	width: Ti.UI.FILL,
		    	layout: "horizontal",
			});
			
			var tblView = Ti.UI.createView({
				layout: "vertical",
				height:"80",
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
				ellipsize : true
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
				height: Ti.UI.SIZE,
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
				source: entry.id,
				backgroundColor: "#375540",
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
				borderColor: "#375540",
				height: 20,
				width: Ti.UI.FILL,
				value: entry.quantity,
				textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
			});
			
			quantity_text_view.add(quantity_text);
			quantity_view.add(quantity_text_view);
			quantity_view.add(quantity_text_input);
			
			row.addEventListener('click', function(e) {
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
		 	counter++; 
		});
	 
		//mainView.prodTable.height = rowHeight + 150;
		//mainView.productView.height = rowHeight + 150;
		mainView.prodTable.setData(data); 
		mainView.productView.add(mainView.prodTable);
	}
} 

exports.construct = function(mv){
	mainView = mv;
};

exports.displayProduct = function(products){
	displayProduct(products);
};

exports.displayCategory = function(){
	displayCategory();	
};

function viewProductList(e){
	DRAWER.navigation("productLists",1 ,{category: e.source.source});
}

function viewDetails(e){
	DRAWER.navigation("productDetails",1 ,{p_id: e.source.source});
}

exports.refreshTableList = function(){
	removeAllChildren(mainView.productView);
	displayProduct(products);	  
};

exports.hideProductFormKeyboard = function(e){
	if (e.source.id != 'TextField'  ) {
    	 
    	if(e.source.id == 'name'){
			return false;
		}
		if(e.source.id == 'prodCode'){
			return false;
		}
		if(e.source.id == 'prodSet'){
			return false;
		}
		if(e.source.id == 'prodDepth'){
			return false;
		}
		if(e.source.id == 'prodWidth'){
			return false;
		}
		if(e.source.id == 'prodHeight'){
			return false;
		}
		if(e.source.id == 'prodWeight'){
			return false;
		}
		if(e.source.id == 'prodHab'){
			return false;
		}
		if(e.source.id == 'prodFab'){
			return false;
		}
		if(e.source.id == 'categoryLabel'){
			return false;
		}
		mainView.name.blur();
		mainView.prodCode.blur();
		mainView.prodSet.blur();
		mainView.prodDepth.blur();
		mainView.prodWidth.blur();
		mainView.prodHeight.blur();
		mainView.prodWeight.blur();
		mainView.prodHab.blur();
		mainView.prodFab.blur();
		closeCategory();
	}
};

exports.reloadFromScroll = function(e){
	
	if(Ti.Platform.osname == "android"){
		var position = e.y;
	}else{
		var position = e.contentOffset.y;
	}
	 console.log(position);
	if(defaultContentHeight == position){
		defaultContentHeight += distance;
		var co = dataSet * contentOffset; 
		details = mod_InventoryProd.getProductList(co); 
		displayProduct(details); 
		dataSet++;
	}
};

function closeCategory(){
	mainView.categoryView.height = 0;
	mainView.categoryView.setVisible(false);  
	mainView.categoryPicker.setVisible(false);
	return false;
} 
