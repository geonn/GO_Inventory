var args = arguments[0] || {}; 
$.appTitle.text = "HOME";
COMMON.construct($);
COMMON.showLoading();

function goTo(e){ 
	DRAWER.navigation(e.source.mod,1);
}
 
function logout(){  
	Ti.App.Properties.setString("user_id","" );
	Ti.App.Properties.setString('module',"");
	DRAWER.navigation("login",1);
	
}

API.getInventoryProducts();
API.getInventoryResources();
API.syncScanByUser();