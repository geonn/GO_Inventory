var args = arguments[0] || {};
var cate = args.category || "";
var mod_category = Alloy.createCollection('category'); 
var cateList  = mod_category.getCategoryByType("resource");
var RESOURCE = require('_resources');
RESOURCE.construct($);
COMMON.construct($);
var prodCateKey;
var photoLoad;
generateCategoryPicker();
 
function addProd(){ 
	//var imagePath	= Ti.App.Properties.getString("resource_image"); 
	
	photoLoad = $.undoPhoto.getVisible(); 
	//var imgBlob = $.previewImage.toImage();  
	var imgBlob = RESOURCE.getImageData();

	COMMON.showLoading();
	
	var prodName    = $.name.value;
	var prodCode    = $.prodCode.value;
	var prodType    = prodCateKey;
	var prodDepth   = $.prodDepth.value;
	var prodWidth   = $.prodWidth.value;
	var prodHeight  = $.prodHeight.value;
	var prodWeight  = $.prodWeight.value; 
	var supplier 	= $.prodSupplier.value; 
	var prodQty     = $.prodQty.value;
	API.addResource({
		name : prodName, code : prodCode, 
		category : prodType, depth : prodDepth, width : prodWidth,
		height : prodHeight, supplier : supplier, weight : prodWeight,
		curCate : cate, quantity:prodQty , photoLoad : photoLoad, photo : imgBlob, type : "resources" 
	});
	 
}

function back(e){ 
	DRAWER.navigation("resourceLists",1,{type: cate});
	$.productFormView.removeEventListener('click', hideProductFormKeyboard);
};

function hideCategory(e) { 
	if(Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad"){ 
		prodCateKey = e.row.key;
		$.categoryLabel.text = e.selectedValue[0];
		$.categoryLabel.color = "#000000"; 
		$.categoryView.height = 0;
		$.categoryView.setVisible(false);  
		$.categoryPicker.setVisible(false);
	}
	return false;
}

function showCategory() {
	if(Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad"){
		$.categoryView.height = 140;
		$.categoryView.setVisible(true);  
		$.categoryPicker.setVisible(true);
		//$.categoryPicker.setSelectedRow(0,0,true);
	}
	return false;
}

function generateCategoryPicker(){
	
	for(var i = 0 ; i < cateList.length; i++){
		var title = cateList[i].cateValue;
		var key = cateList[i].cateKey;
		var data = Ti.UI.createPickerRow({title:"  "+title ,key:key });  
		$.categoryPicker.add(data);
		if(title == cate){
			$.categoryPicker.setSelectedRow(0,i,false);
		}
	}
}

function takePhoto(){
	 RESOURCE.loadPhoto($.previewImage, $.undoPhoto,"");
}
function undoPhoto(){
	$.previewImage.image = "";
	$.undoPhoto.visible = false;
}
function hideProductFormKeyboard(e){
	if (e.source.id != 'TextField'  ) {
    	 
    	if(e.source.id == 'name'){
			return false;
		}
		if(e.source.id == 'prodCode'){
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
		if(e.source.id == 'prodSupplier'){
			return false;
		}
		if(e.source.id == 'categoryLabel'){
			return false;
		}
		if(e.source.id == 'prodQty'){
			return false;
		}
		$.name.blur();
		$.prodCode.blur(); 
		$.prodDepth.blur();
		$.prodWidth.blur();
		$.prodHeight.blur();
		$.prodWeight.blur(); 
		$.prodSupplier.blur();
		$.prodQty.blur();
		if(Ti.Platform.osname == "iphone" || Ti.Platform.osname == "ipad"){ 
			$.categoryView.height = 0;
			$.categoryView.setVisible(false);  
			$.categoryPicker.setVisible(false);
		}
	}
};
$.previewImage.addEventListener('click', takePhoto);
$.undoPhoto.addEventListener('click', undoPhoto);
$.productFormView.addEventListener('click', hideProductFormKeyboard);

/**********************
 * Clear object and memory
 **********************/
var clearObject = function(){ 
	//RESOURCE.deconstruct();
	
	photoLoad = null;
	prodCateKey = null;
	mod_category = null; 
	RESOURCE = null; 
	cateList = null; 
	Ti.App.removeEventListener("clearObject", clearObject);
};
Ti.App.addEventListener("clearObject", clearObject);	
  
  