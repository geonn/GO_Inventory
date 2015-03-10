var args = arguments[0] || {};

function navMenu(e){
	switch(e.index){
		case 0: 
			DRAWER.navigation("home",2);   
			break;
		case 1:   
			DRAWER.navigation("assignment",2); 
			break;
		case 2:   
			DRAWER.navigation("history",2); 
			break;
		case 3:   
			DRAWER.navigation("news",2);
			break; 
	 	case 4: 
	 		DRAWER.navigation("inventory",2);
			break;
		case 5: 
	 		DRAWER.navigation("stockOut",2);
			break;
		case 6: 
	 		DRAWER.navigation("viewProduct",2);
			break;
		case 7: 
			DRAWER.navigation("settings",2);
			break;
		case 8: 
			Ti.App.Properties.setString("user_id","" );
			Ti.App.Properties.setString('module',"");
			var mod_product = Alloy.createCollection('products'); 
			mod_product.resetScanHistory();
			DRAWER.navigation("login",2);
			break;
	}
}
