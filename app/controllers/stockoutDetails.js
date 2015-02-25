var args = arguments[0] || {};
var order_id = args.order || "";
$.appTitle.text = "#"+args.orderNo || "";

if(Ti.Platform.osname == "android"){ 
	$.orderDetailsTable.height =   PixelsToDPUnits(Ti.Platform.displayCaps.platformHeight)  -50;  
}
 
var STOCKOUT = require('_stockout'); 
STOCKOUT.construct($);
COMMON.construct($);
COMMON.showLoading();  

//setTimeout(function(){   
	STOCKOUT.displayDetails(order_id);   
//}, 300);

function goBack(){
	DRAWER.navigation("stockOut",1);
}