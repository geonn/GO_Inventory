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
		text: "RESOURCE DETAILS" 
	});	
	
	titleLabelView.add(titleLabel);
	return titleLabelView;
};
 
exports.displayResourceImage = function (image){
 
	var imageContainer = Ti.UI.createView({
		height:"40%",
		top: 0,
		width:"90%" 
	});
	if(image == ""){
		var resImage = Ti.UI.createImageView({
			image: "/images/noImage.png", 
			top:0,
			width:"80%"
		});
	}else{
		var resImage = Titanium.UI.createImageView({
			image: image, 
			top:0,
			width:"80%"
		});
	}
	imageContainer.add(resImage);
	return imageContainer;
};

exports.displayResourceContents = function(items){ 
	var mainContentView = Titanium.UI.createView({
		layout : "vertical", 
		top:5, 
		bottom:5,
		backgroundColor: "#ffffff",
		height:Ti.UI.SIZE
	});
	 
 	/*** RESOURCE NAME***/
 	var contentView = horizontalView(); 
	contentView.add(contentTitleLabel("Resource Name"));
	contentView.add(contentLabel(items.name));
	mainContentView.add(contentView); 
	mainContentView.add(saperatorLine());
	
	/*** RESOURCE CODE***/
	var contentView = horizontalView(); 
	contentView.add(contentTitleLabel("Resource Code"));
	contentView.add(contentLabel(items.code));
	mainContentView.add(contentView); 
	mainContentView.add(saperatorLine());
	
	/*** RESOURCE CATEGORY***/
	var contentView  = horizontalView(); 
	contentView.add(contentTitleLabel("Resource Type"));
	contentView.add(contentLabel(items.type));
	mainContentView.add(contentView); 
	mainContentView.add(saperatorLine());
	
	/*** RESOURCE SIZE***/
	var  depth =  items.depth || "-";
	var  width =  items.width || "-";
	var  height = items.height || "-";
	var sizeText = "(Depth)"+depth + ", (Width)"+width + ", (Height)"+height;
	var contentView  = horizontalView(); 
	contentView.add(contentTitleLabel("Resource Size"));
	contentView.add(contentLabel(sizeText));
	mainContentView.add(contentView); 
	mainContentView.add(saperatorLine());
	
	/*** RESOURCE SUPPLIER***/
	var contentView  = horizontalView(); 
	contentView.add(contentTitleLabel("Resource Supplier"));
	contentView.add(contentLabel(items.supplier));
	mainContentView.add(contentView); 
	mainContentView.add(saperatorLine());
	
	/*** RESOURCE STOCK QUANTITY***/
	var contentView  = horizontalView(); 
	contentView.add(contentTitleLabel("Resource Stock Quantity"));
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
