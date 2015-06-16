var PRODUCT = require('_products');
var pop;
var mainView = null;
exports.construct = function(mv){
	mainView = mv;
};
exports.deconstruct = function(){  
	mainView = null;
};

exports.displayHeader = function(){
	var titleLabelView = Titanium.UI.createView({
		backgroundColor: "#375540", 
		top:0,
		height:"5%"
	});
	 
	 var titleLabel = mainView.UI.create('Label',{
	 	classes: ['white_text'],
		text: "PRODUCT DETAILS" 
	});	
	
	titleLabelView.add(titleLabel);
	return titleLabelView;
};

exports.displayResourceHeader = function(){
	var titleLabelView = Titanium.UI.createView({
		backgroundColor: "#375540", 
		top:0,
		height: 50
	});
	 
	 var titleLabel = mainView.UI.create('Label',{
	 	classes: ['white_text'],
		text: "PRODUCT RESOURCES" 
	});	
	
	titleLabelView.add(titleLabel);
	return titleLabelView;
};
 
exports.displayProductImage = function (image,item_id){
	var imageContainer = Ti.UI.createView({
		height: "150sp", 
		width:"100%",
		layout : "horizontal" 
	});
	
	var editorContainer = Ti.UI.createView({
		height:"100%",
		top: 0,
		right: 0,
		width:"15%", 
		layout : "vertical"   
	});
	
	var undoBtn = Titanium.UI.createButton({
			height : 30,
			width : 30,
			right:0,
			visible : "false",
			backgroundImage : "/images/cross.png"
	});
	
	var saveBtn = Titanium.UI.createButton({ 
			height : 30,
			width : 30,
			top: 20,
			right: 0 ,
			visible : "false", 
			backgroundImage : "/images/tick.png"
	});
	
	if(image == ""){
		var resImage = Ti.UI.createImageView({
			image: "/images/noImage.png", 
			top:0,
			width:"83%"
		});
		hideSaveAndUndoBtn(undoBtn,saveBtn);
	}else{
		var resImage = Titanium.UI.createImageView({
			image: image, 
			defaultImage: "/images/warm-grey-bg.png",
			top:0,
			width:"83%"
		});
		hideSaveAndUndoBtn(undoBtn,saveBtn);
	}
	var activityIndicator = COMMON.showImageIndicator(); 
	
	editorContainer.add(undoBtn);  
	editorContainer.add(saveBtn);  
	imageContainer.add(resImage); 
	imageContainer.add(editorContainer); 
	imageContainer.add(activityIndicator);
	COMMON.imageIndicatorEvent(resImage,activityIndicator); 
	resImage.addEventListener('click', function(){
		PRODUCT.loadPhoto(resImage,undoBtn,saveBtn);
	});
	undoBtn.addEventListener('click', function(){ 
		resImage.image = "";
		hideSaveAndUndoBtn(undoBtn,saveBtn);
	});
	saveBtn.addEventListener('click', function(){ 
		COMMON.showLoading();
		var imgBlob = PRODUCT.getImageData();
		 
		API.uploadImage({
			item_id : item_id,  
			image : imgBlob, 
			type : "products" 
		});
		hideSaveAndUndoBtn(undoBtn,saveBtn);
	});
	return imageContainer;
};

exports.displayProductContents = function(items, code){ 
	var mainContentView = Titanium.UI.createView({
		layout : "vertical", 
		top:5, 
		bottom:5, 
		height:Ti.UI.SIZE
	});
	var mod_prod = Alloy.createCollection('products');  
	var proRes  = mod_prod.getProductDetails(code);
	
	var contentView = horizontalView(); 
	contentView.add(contentTitleLabel("Item Price"));
	contentView.add(contentLabel(proRes.price));
	mainContentView.add(contentView); 
	mainContentView.add(saperatorLine());
	
	var contentView = horizontalView(); 
	contentView.add(contentTitleLabel("Location"));
	contentView.add(contentLabel(proRes.location));
	mainContentView.add(contentView); 
	mainContentView.add(saperatorLine());
	
 	/*** PRODUCT NAME***/
 	var contentView = horizontalView(); 
	contentView.add(contentTitleLabel("Product Name"));
	contentView.add(contentLabel(items.name));
	mainContentView.add(contentView); 
	mainContentView.add(saperatorLine());
	
	/*** PRODUCT SET***/
	var contentView = horizontalView(); 
	contentView.add(contentTitleLabel("Product Set"));
	contentView.add(contentLabel(items.prodSet));
	mainContentView.add(contentView); 
	mainContentView.add(saperatorLine());

	/*** PRODUCT CODE***/
	var contentView = horizontalView(); 
	contentView.add(contentTitleLabel("Product Code"));
	contentView.add(contentLabel(items.code));
	mainContentView.add(contentView); 
	mainContentView.add(saperatorLine());
	
	/*** PRODUCT CATEGORY***/
	var contentView  = horizontalView(); 
	contentView.add(contentTitleLabel("Product Category"));
	contentView.add(contentLabel(items.category));
	mainContentView.add(contentView); 
	mainContentView.add(saperatorLine());
	
	/*** PRODUCT SIZE***/
	var  depth =  items.depth || "-";
	var  width =  items.width || "-";
	var  height = items.height || "-";
	var sizeText = "Depth : "+depth + "\r\nWidth : "+width + "\r\nHeight : "+height;
	var contentView  = horizontalView(); 
	contentView.add(contentTitleLabel("Product Size"));
	contentView.add(contentLabel(sizeText));
	mainContentView.add(contentView); 
	mainContentView.add(saperatorLine());
	
	/*** PRODUCT SURFACE HABITABLE***/
	var contentView  = horizontalView(); 
	contentView.add(contentTitleLabel("Product Habitable"));
	contentView.add(contentLabel(items.surface_habitable));
	mainContentView.add(contentView); 
	mainContentView.add(saperatorLine()); 
	
	/*** PRODUCT STOCK QUANTITY***/
	var addImage = Titanium.UI.createImageView({
		image: "/images/add_green.png",
		width: 25,
		left:20
	});
	
	var icardsTotal = mod_prod.getiCardTotalByProduct(items.id);
//console.log(icardsTotal);
	var contentView  = horizontalView(); 
	contentView.add(contentTitleLabel("Product Stock Quantity"));
	if(icardsTotal.length > 0){
		var str = ""; 
		icardsTotal.forEach(function(tq) {
			if(tq.done == "1"){
				str += "Done : " + tq.total + "\r\n"; 
			}else{
				str += "In Progress : " + tq.total + "\r\n"; 
			}
		});
		
		contentView.add(contentLabel(str));
	}else{
		contentView.add(contentLabel("N/A"));
	}
	 
	contentView.add(addImage );
	mainContentView.add(contentView); 
	mainContentView.add(saperatorLine());
	
	addImage.addEventListener('click', function(){
		if(Ti.Platform.osname == "android"){
			var textfield = Ti.UI.createTextField({keyboardType : Ti.UI.KEYBOARD_PHONE_PAD});
			var dialog = Ti.UI.createAlertDialog({
			    title: 'Enter quantity of iCard',
			   	androidView: textfield,
			    buttonNames: ['Confirm', 'Cancel'], 
			}); 
		}else{ 
			var dialog = Ti.UI.createAlertDialog({
			    title: 'Enter quantity of iCard', 
			    buttonNames: ['Confirm', 'Cancel'],
			    style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
			    keyboardType : Ti.UI.KEYBOARD_PHONE_PAD
			}); 
		}
		
		dialog.show(); 
		dialog.addEventListener('click', function(e){  
			if(e.index == 0) { 
				 var qty;
				if(Ti.Platform.osname == "android"){
					qty = textfield.value;
				}else{
					qty = e.text;
				} 
				API.createiCard({
					item : items.id,
					qty  : qty,
					type : 'product'
				});
			}
		}); 
	});
	
	return mainContentView;
};

exports.displayProductResources = function(code){
	var mod_res = Alloy.createCollection('resources');  
	var proRes  = mod_res.getResourcesByicard(code);
	 
	var mainContentView = Titanium.UI.createView({
		layout : "vertical",  
		bottom:5, 
		backgroundColor: "#375540",
		height:Ti.UI.SIZE,
		width:"100%"
	});
	
	if(proRes.length > 0){
		/*** RESOURCE NAME***/
		var mainResTitleView = Titanium.UI.createView({
			layout : "horizontal",   
			backgroundColor: "#375540",
			height:Ti.UI.SIZE,
			width:"100%"
		});
	 	var contentResView = Ti.UI.createView({
			layout : "horizontal",  
			height:Ti.UI.SIZE, 
			width:"45.5%",
			top:5,
			left: 5,
			bottom: 5
		});
		var contentResView2 = Ti.UI.createView({
			layout : "horizontal",  
			height:Ti.UI.SIZE, 
			width:"49.5%",
			top:5,
			left: 0,
			bottom: 5
		});
		
		contentResView.add(contentWhiteLabel("Resource Name"));
		contentResView2.add(contentWhiteLabel("Code"));
		mainResTitleView.add(contentResView);
		mainResTitleView.add(contentResView2); 
		mainContentView.add(mainResTitleView); 
		mainContentView.add(saperatorLine());
		proRes.forEach(function(entry) {
			var mainResDataView = Titanium.UI.createView({
				layout : "horizontal",   
				backgroundColor: "#ffffff",
				height:Ti.UI.SIZE,
				width:"100%"
			});
			
			/*** RESOURCE CODE***/ 
			var contentResView3 = Ti.UI.createView({
				layout : "horizontal",  
				height:Ti.UI.SIZE, 
				width:"45.5%",
				top:5,
				left: 5 
			});
			var contentResView4 = Ti.UI.createView({
				layout : "horizontal",  
				height:Ti.UI.SIZE, 
				width:"auto",
				top:5,
				left: 0 
			});
			
			console.log(entry.name);
			contentResView3.add(contentLabel(entry.name));
			contentResView4.add(contentLabel(entry.code));
			mainResDataView.add(contentResView3);
			mainResDataView.add(contentResView4);
			mainContentView.add(mainResDataView);  
			mainContentView.add(saperatorLine());
		});
	}
	
	return mainContentView;
};

exports.displayBottomBar = function(code){
	
	var mod_prod = Alloy.createCollection('products');  
	var proRes  = mod_prod.getProductDetails(code);
	 
	var seperatorLine = Titanium.UI.createView({ 
		backgroundColor: "#D5D5D5",
		height:1, 
		width:Ti.UI.FILL
	});
	 
	var mainContentView = Titanium.UI.createView({
		layout : "horizontal",  
		bottom:0, 
		backgroundColor: "#f6f6f6",
		height:50, 
		width:Ti.UI.FILL
	});
	var leftContentView = Titanium.UI.createView({
		layout : "vertical",   
		backgroundColor: "#f6f6f6",
		content: proRes.price,
		height:50,
		width:"25%"
	});
	
	var leftContentLabel = mainView.UI.create('Label',{ 
		classes: ['bold_text', 'gray_text','medium16_text','text_center'], 
		text: "Price",
		//text: "RM "+proRes.price,  
		//content: proRes.price,
		top:15,
		width:Ti.UI.FILL
	});
	leftContentView.add(leftContentLabel);
	
	var centerContentView = Titanium.UI.createView({
		layout : "vertical",   
		backgroundColor: "#f6f6f6",
		content: proRes.location,
		height:50, 
		width:"45%"
	});
	
	var centerContentLabel = mainView.UI.create('Label',{ 
		//classes: ['bold_text', 'gray_text','medium_text','text_left'], 
		classes: ['bold_text', 'gray_text','medium16_text','text_center'], 
		text: "Location",
		//text: proRes.location, 
		//content: proRes.location,
		top: 15,
		width:Ti.UI.FILL
	});
	centerContentView.add(centerContentLabel);
	
	var rightContentView = Titanium.UI.createView({
		layout : "vertical",   
		backgroundColor: "#f6f6f6",
		height:50,
		
		width:"auto"
	});
	var rightContentLabel = mainView.UI.create('Label',{ 
		classes: ['bold_text', 'gray_text','medium16_text','text_center'], 
		text: "Stock Out", 
		top:15,
		width:Ti.UI.SIZE
	});
	leftContentView.add(leftContentLabel);
	centerContentView.add(centerContentLabel);
	rightContentView.add(rightContentLabel);
	mainContentView.add(seperatorLine);
	mainContentView.add(leftContentView);
	mainContentView.add(Titanium.UI.createView({ 
		backgroundColor: "#D5D5D5",
		height:Ti.UI.FILL, 
		width:1
	}));
	mainContentView.add(centerContentView);
	mainContentView.add(Titanium.UI.createView({ 
		backgroundColor: "#D5D5D5",
		height:Ti.UI.FILL, 
		width:1
	}));
	mainContentView.add(rightContentView);
	
	leftContentView.addEventListener('click', function(e){ 
		promptInput('price', e.source.content,code);
	});
	centerContentView.addEventListener('click', function(e){ 
		promptInput('location', e.source.content,code);
	});
	rightContentView.addEventListener('click', function(e){ 
		
		var mod_Stockout = Alloy.createCollection('stockout');  
		var so_detail = mod_Stockout.getStockOutDetails(proRes.orders);
	 
		var stock_id = ""; 
		if(so_detail != ""){
			stock_id = so_detail.id;
		} 
		var containerView = Ti.UI.createView({
			layout: "composite",
			height:"100%",
			width:"100%",
			backgroundColor: "#EFEFEF"
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
			text:  'Stock Out Information',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			width: Ti.UI.SIZE, 
			height: Ti.UI.SIZE
		});
		
		var contentView = Ti.UI.createScrollView({
			layout: "vertical",
			height:"74.5%",
			backgroundColor:"#EFEFEF", 
			width:"95%" 
		});
		
		var customerNameTextInput = mainView.UI.create('TextField',{
			hintText : "Customer Name",
			value : so_detail.customer_name,
			id : "customer_name",
			top: '10',
			classes: ['input']
		});
		var customerCompanyTextInput = mainView.UI.create('TextField',{
			hintText : "Customer Company",
			value : so_detail.company_name,
			classes: ['input']
		});
		
		var salesOrderTextInput = mainView.UI.create('TextField',{
			hintText : "Sales Order Number",
			value : so_detail.sales_order,
			classes: ['input']
		});
		
		var purchaseOrderTextInput = mainView.UI.create('TextField',{
			hintText : "Purchase Order Number",
			value : so_detail.purchase_order,
			classes: ['input']
		});
		
		var deliveryOrderTextInput = mainView.UI.create('TextField',{
			hintText : "Delivery Order Number",
			value : so_detail.delivery_order,
			classes: ['input']
		});
		
		var gonTextInput = mainView.UI.create('TextField',{
			hintText : "Goods Outgoing Note Number",
			value : so_detail.gon,
			classes: ['input']
		});
		
		var remarkTextArea = mainView.UI.create('TextArea',{
			hintText : "Remark",
			value : so_detail.remark,
			classes: ['textarea']
		});
		contentView.add(customerNameTextInput);
		contentView.add(customerCompanyTextInput);
		contentView.add(salesOrderTextInput);
		contentView.add(purchaseOrderTextInput); 
		contentView.add(deliveryOrderTextInput);
		contentView.add(gonTextInput);
		contentView.add(remarkTextArea);
		var centerImageView = Ti.UI.createView({
			layout: "composite",
			height:"10%",
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
		config.height = "75%";
		pop = COMMON.popup(containerView,config);
		pop.open({fullscreen:true, navBarHidden: true}); 
		
		var params = {
			code : code,
			stock_id : stock_id,
			customerName: customerNameTextInput, 
			company_name: customerCompanyTextInput,
			salesOrder: salesOrderTextInput,
			gon: gonTextInput,
			purchaseOrder: purchaseOrderTextInput,
			deliveryOrder:deliveryOrderTextInput,
			remark: remarkTextArea
			};
		addDoneEvent(okayBtn,params);  
	});
	return mainContentView;
};

function addDoneEvent(myView, params){ 
	myView.addEventListener('click', function(e){
		API.updateStockoutInfo({
			code : params.code,
			stock_id: params.stock_id,
			customer_name: params.customerName.value,
			company_name:params.company_name.value,
			sales_order:params.salesOrder.value,
			gon:params.gon.value,
			purchase_order:params.purchaseOrder.value,
			delivery_order:params.deliveryOrder.value,
			remark:params.remark.value
		});
		 
		pop.close();
	});
}

/***PRIVATE FUNCTION***/
function promptInput(iType, content,code){
	if(Ti.Platform.osname == "android"){
		var textfield = Ti.UI.createTextField({ keyboardType : Ti.UI.KEYBOARD_PHONE_PAD});
		var dialog = Ti.UI.createAlertDialog({
		    title: 'Product price',
		     message: 'Current '+iType+' : '+ content,
		   	androidView: textfield,
		    buttonNames: ['Confirm', 'Cancel'], 
		}); 
	}else{ 
		var dialog = Ti.UI.createAlertDialog({
		    title: 'Product '+iType, 
		    message: 'Current '+iType+' : '+content,
		    style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
		    buttonNames: ['Confirm', 'Cancel'],
		    keyboardType : Ti.UI.KEYBOARD_PHONE_PAD
		}); 
	}
	
	dialog.show(); 
	dialog.addEventListener('click', function(e){  
		if(e.index == 0) { 
		 
			var itemData;
			if(Ti.Platform.osname == "android"){
				itemData = textfield.value;
			}else{
				itemData = e.text;
			}
			 
			API.updateProductInformation(iType,itemData,code);  
		}else{
			
		}
	}); 
}

function horizontalView(){
	return Titanium.UI.createView({
		layout : "horizontal",  
		height:Ti.UI.SIZE,
		top:5,
		bottom: 5
	});
} 

function contentTitleLabel(textTitle){
	return mainView.UI.create('Label',{ 
		classes: ['bold_text', 'gray_text','medium_text'], 
		text: textTitle,
		top:0,
		width:"40%"
	});
} 

function contentLabel(textContent){
	var textContent = textContent || "-";
	return mainView.UI.create('Label',{ 
		classes: ['bold_text', 'gray_text','medium_text'], 
		height: Ti.UI.SIZE,
		top:0,
		text: textContent 
	});	
}

function contentWhiteLabel(textContent){
	var textContent = textContent || "-";
	return mainView.UI.create('Label',{ 
		color: "#ffffff", 
		text: textContent, 
		height: Ti.UI.SIZE,
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
	});	
}

function hideSaveAndUndoBtn(undoBtn,saveBtn) {
	undoBtn.visible = false;
	saveBtn.visible = false;
}

function saperatorLine(){
	return Titanium.UI.createView({
		width : "100%",  
		height:"1",
		backgroundColor: "#C0C0C0"
	});
}
