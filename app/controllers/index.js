var u_id = Ti.App.Properties.getString("user_id");
 
if(u_id == "" || u_id === null){
	DRAWER.initDrawer('login');
}else{
	DRAWER.initDrawer('home');
}

/***
 * Add new field at database, check if field exists; if not then alter the table
 * PARAM: new field, field type
 */
var mod_res = Alloy.createCollection('resources');   
mod_res.addColumn("usage", "TEXT"); 

var mod_prod = Alloy.createCollection('products');   
mod_prod.addColumn("price", "TEXT");   
mod_prod.addColumn("location", "TEXT"); 

var mod_prod = Alloy.createCollection('stockout');   
mod_prod.addColumn("gon", "TEXT");   
mod_prod.addColumn("purchase_order", "TEXT"); 

// event 
Ti.App.addEventListener("app:refreshMenu", function(e) {
	DRAWER.initMenu();
});

API.updateSettings();
API.getAnnouncement();
API.getCategory();
API.getStockOutList();