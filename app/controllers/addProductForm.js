var args = arguments[0] || {};
var mod_category = Alloy.createCollection('category'); 
var cateList  = mod_category.getCategoryByType("product");
var PRODUCT = require('_products');
PRODUCT.construct($);
COMMON.construct($);
var prodCateKey;
generateCategoryPicker();
function addProd(){ 
	COMMON.showLoading();
	
	var prodName    = $.name.value;
	var prodCode    = $.prodCode.value;
	var prodSet     = $.prodSet.value;
	var prodDepth   = $.prodDepth.value;
	var prodWidth   = $.prodWidth.value;
	var prodHeight  = $.prodHeight.value;
	var prodWeight  = $.prodWeight.value;
	var prodHab 	= $.prodHab.value;
	var prodFab 	= $.prodFab.value;
	var prodCategory 	= prodCateKey;
	
	API.addProduct({
		name : prodName, code : prodCode, set : prodSet,
		category : prodCategory, depth : prodDepth, width : prodWidth,
		height : prodHeight, surface_habitable : prodHab, weight : prodWeight,
		fabric_used : prodFab
	});
	 
}

function back(e){ 
	DRAWER.navigation("inventory",1);
	$.productFormView.removeEventListener('click', PRODUCT.hideProductFormKeyboard);
};

function hideCategory(e) { 
	 
	prodCateKey = e.row.key;
	$.categoryLabel.text = e.selectedValue[0];
	$.categoryLabel.color = "#000000"; 
	$.categoryView.height = 0;
	$.categoryView.setVisible(false);  
	$.categoryPicker.setVisible(false);
	return false;
}

function showCategory() {
	$.categoryView.height = 140;
	$.categoryView.setVisible(true);  
	$.categoryPicker.setVisible(true);
	//$.categoryPicker.setSelectedRow(0,0,true);
	return false;
}

function generateCategoryPicker(){
	
	for(var i = 0 ; i < cateList.length; i++){
		var title = cateList[i].cateValue;
		var key = cateList[i].cateKey;
		var data = Ti.UI.createPickerRow({title:"  "+title ,key:key });  
		$.categoryPicker.add(data);
	}
	
}

$.productFormView.addEventListener('click', PRODUCT.hideProductFormKeyboard);
  