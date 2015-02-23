var args = arguments[0] || {};
var order_id = args.order || "";

var mod_product = Alloy.createCollection('products'); 
var details = mod_product.getProductByOrder(order_id);
console.log(details);

COMMON.construct($);
COMMON.showLoading();  

function goBack(){
	DRAWER.navigation("stockOut",1);
}