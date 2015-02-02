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
			DRAWER.navigation("settings",2);
			break;
		case 6: 
			Ti.App.Properties.setString("user_id","" );
			Ti.App.Properties.setString('module',"");
			DRAWER.navigation("login",2);
			break;
	}
}
