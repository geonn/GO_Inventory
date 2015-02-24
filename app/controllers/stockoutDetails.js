var args = arguments[0] || {};
var order_id = args.order || "";
$.appTitle.text = "#"+args.orderNo || "";

var mod_product = Alloy.createCollection('products'); 
var details = mod_product.getProductByOrder(order_id); 
var STOCKOUT = require('_stockout'); 
STOCKOUT.construct($);
COMMON.construct($);
COMMON.showLoading();  

//setTimeout(function(){   
	STOCKOUT.displayDetails(details);   
//}, 300);

function goBack(){
	DRAWER.navigation("stockOut",1);
}