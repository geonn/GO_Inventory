var PRODUCT = require('_products');

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
		height:"5%"
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
		height:"40%", 
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
			top:0,
			width:"83%"
		});
		hideSaveAndUndoBtn(undoBtn,saveBtn);
	}
	editorContainer.add(undoBtn);  
	editorContainer.add(saveBtn);  
	imageContainer.add(resImage);
	imageContainer.add(editorContainer); 
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

exports.displayProductContents = function(items){ 
	var mainContentView = Titanium.UI.createView({
		layout : "vertical", 
		top:5, 
		bottom:5, 
		height:Ti.UI.SIZE
	});
	 
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
	var sizeText = "(Depth)"+depth + ", (Width)"+width + ", (Height)"+height;
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
	var contentView  = horizontalView(); 
	contentView.add(contentTitleLabel("Product Stock Quantity"));
	contentView.add(contentLabel(items.quantity));
	mainContentView.add(contentView); 
	mainContentView.add(saperatorLine());
	
	return mainContentView;
};

exports.displayProductResources = function(code){
	var mod_res = Alloy.createCollection('resources');  
	var proRes  = mod_res.getResourcesByicard(code);
	console.log(proRes);
	
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

/***PRIVATE FUNCTION***/
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
		width:"40%"
	});
} 

function contentLabel(textContent){
	var textContent = textContent || "-";
	return mainView.UI.create('Label',{ 
		classes: ['bold_text', 'gray_text','medium_text'], 
		text: textContent
	});	
}

function contentWhiteLabel(textContent){
	var textContent = textContent || "-";
	return mainView.UI.create('Label',{ 
		color: "#ffffff", 
		text: textContent, 
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
