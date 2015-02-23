var args = arguments[0] || {};

var mod_stockout = Alloy.createCollection('stockout'); 
var STOCKOUT = require('_stockout'); 

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

console.log(list);
