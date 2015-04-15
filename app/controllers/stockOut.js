var args = arguments[0] || {};

var mod_stockout = Alloy.createCollection('stockout'); 
var STOCKOUT = require('_stockout'); 
Ti.App.Properties.setString('parent',"");
 //Retrieve Stock out record from server
API.getStockOutList();
//Query list from local DB
var list = mod_stockout.getStockOutList();

STOCKOUT.construct($);
COMMON.construct($);
COMMON.showLoading();  
 
setTimeout(function(){   
	STOCKOUT.displayList(list);  
	COMMON.hideLoading();
}, 300);
 
/***SEARCH PRODUCTS***/
$.searchOrder.addEventListener('focus', function(e){
	$.searchOrder.showCancel =  true; 
	$.orderTable.opacity = 1;
	$.orderTable.height = "auto";
});

$.searchOrder.addEventListener('blur', function(e){
	$.searchOrder.showCancel =  false;
});

$.searchOrder.addEventListener('cancel', function(e){
	Ti.App.Properties.setString("order_search","");
	COMMON.showLoading();
	$.searchOrder.blur();  
	var str = $.searchOrder.getValue();
	if(str == ""){
		removeAllChildren($.orderTable); 
		STOCKOUT.displayList(list);  
	}
});

var searchResult = function(){
	COMMON.showLoading();
	$.searchOrder.blur();
	var str = $.searchOrder.getValue();
	Ti.App.Properties.setString("order_search",str);
	var result = mod_stockout.searchStockOut(str); 
	removeAllChildren($.orderTable);
	STOCKOUT.displayList(result);		
};
$.searchOrder.addEventListener("return", searchResult);

$.stockOutView.addEventListener('touchend', function(e){
    $.searchOrder.blur(); 
});

$.stockOutView.addEventListener('touchend', function(e){
    $.searchOrder.blur(); 
});
