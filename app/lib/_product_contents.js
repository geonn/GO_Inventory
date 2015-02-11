var mainView = null;
exports.construct = function(mv){
	mainView = mv;
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
 
exports.displayProductImage = function (image){
	var prodImage = Titanium.UI.createImageView({
		image: image, 
		top:0,
		width:"80%"
	});
	return prodImage;
};

exports.displayProductContents = function(items){ 
	var mainContentView = Titanium.UI.createView({
		layout : "vertical", 
		top:5, 
		bottom:5,
		backgroundColor: "#ffffff",
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

function saperatorLine(){
	return Titanium.UI.createView({
		width : "100%",  
		height:"1",
		backgroundColor: "#C0C0C0"
	});
}
