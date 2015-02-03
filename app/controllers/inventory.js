var args = arguments[0] || {};
var mod_InventoryProd = Alloy.createCollection('product_inventory'); 

var details = mod_InventoryProd.getProductList();
console.log(details);
