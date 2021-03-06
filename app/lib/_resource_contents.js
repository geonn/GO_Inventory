var RESOURCE = require('_resources');

var mainView = null;
exports.construct = function(mv){
	mainView = mv;
	//RESOURCE.construct(mainView);
};

exports.deconstruct = function(){ 
	RESOURCE = null;
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
		text: "RESOURCE DETAILS" 
	});	
	
	titleLabelView.add(titleLabel);
	return titleLabelView;
};

function hideSaveAndUndoBtn(undoBtn,saveBtn) {
	undoBtn.visible = false;
	saveBtn.visible = false;
}

exports.hideSaveAndUndoBtn = function(){
	hideSaveAndUndoBtn();
};

exports.displayResourceImage = function (image,item_id){
 
	var imageContainer = Ti.UI.createView({
		height:"40%",
		top: 0,
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
		RESOURCE.loadPhoto(resImage,undoBtn,saveBtn);
	});
	undoBtn.addEventListener('click', function(){ 
		resImage.image = "";
		hideSaveAndUndoBtn(undoBtn,saveBtn);
	});
	saveBtn.addEventListener('click', function(){ 
		COMMON.showLoading();
		var imgBlob = RESOURCE.getImageData();
 
		API.uploadImage({
			item_id : item_id,  
			image : imgBlob, 
			type : "resources" 
		});
		hideSaveAndUndoBtn(undoBtn,saveBtn);
	});
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
	var addImage = Titanium.UI.createImageView({
		image: "/images/add_green.png",
		width: 25,
		left:20
	});
	
	var mod_res = Alloy.createCollection('resources');  
	var icardsTotal = mod_res.getiCardTotalByResource(items.id);// mod_res.getiCardByResource(items.id);//
	//console.log(icardsTotal);
	var contentView  = horizontalView(); 
	contentView.add(contentTitleLabel("Resource Stock Quantity"));
	if(icardsTotal != ""){
		var str = ""; 
		str += "Available : " + icardsTotal.available + "\r\n"; 
		str += "Used : " + icardsTotal.used + "\r\n";
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
					type : 'resource'
				});
			}
		}); 
	});
	
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
		top:0,
		width:"40%"
	});
} 

function contentLabel(textContent){
	var textContent = textContent || "-";
	return mainView.UI.create('Label',{ 
		top:0,
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
