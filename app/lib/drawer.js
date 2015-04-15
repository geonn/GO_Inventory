/**Include Drawer Library**/
var NappDrawerModule = require('dk.napp.drawer');  

/** Initialize variable**/
var nappDrawer = null;
var menu_no = "1"; 

function createMyDrawer(rightMenuWindow,method){
	nappDrawer = NappDrawerModule.createDrawer({
			fullscreen: true,  
			rightWindow: rightMenuWindow,
			centerWindow: createCenterNavWindow(method), 
			//closeDrawerGestureMode: NappDrawerModule.CLOSE_MODE_ALL,
			openDrawerGestureMode: NappDrawerModule.OPEN_MODE_ALL,
			showShadow: false,   
			rightDrawerWidth: 200, 
			animationMode: NappDrawerModule.ANIMATION_NONE,  
			statusBarStyle: NappDrawerModule.STATUSBAR_WHITE,  
			orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});	
	
	if (Ti.Platform.osname == 'iphone') {
	    nappDrawer.setCloseDrawerGestureMode(NappDrawerModule.CLOSE_MODE_ALL); 
	}
	
	/***DRAWER EVENT***/
	nappDrawer.addEventListener('windowDidOpen', function (e) { 
		drawerFlag = 1; 
	});
	
	nappDrawer.addEventListener('windowDidClose', function (e) { 
		drawerFlag = 0; 
	});

	nappDrawer.addEventListener('android:back', function (e) {
		var mod = Ti.App.Properties.getString('parent');
		var usr = Ti.App.Properties.getString("user_id"); 
		 
		if(mod !== null && mod != ""){
			var modDetails = mod.split("||"); 
			if(modDetails[0] == "productLists"){
				var modAction = modDetails[1];  
				Ti.App.Properties.setString('parent',"inventory||0");
				navigation(modDetails[0], 1,{ "category": modAction } );
			}else if(modDetails[0] == "resourceLists"){
				var modAction = modDetails[1];  
				Ti.App.Properties.setString('parent',"inventory||1");
				navigation(modDetails[0], 1,{ "type": modAction } );
			}else if(modDetails[0] == "inventory"){
				var modAction = modDetails[1];  
				Ti.App.Properties.setString('parent','');
				navigation(modDetails[0], 1,{ "tab": modAction } );
			} else{
				Ti.App.Properties.setString('parent','');
				navigation(modDetails[0], 1);
			}
			
		}else if(drawerFlag == 1 || usr == ""){
			var dialog = Ti.UI.createAlertDialog({
			    cancel: 1,
			    buttonNames: ['Cancel','Confirm'],
			    message: 'Would you like to exit GO Inventory?',
			    title: 'Exit app'
			});
			dialog.addEventListener('click', function(e){
			  
		    	if (e.index === e.source.cancel){
			      //Do nothing
			    }
			    if (e.index === 1){
			    	var activity = Titanium.Android.currentActivity;
					activity.finish();
			    }
			});
			dialog.show(); 
		}else{
			nappDrawer.toggleLeftWindow();
		}
		return false;
	});
	 
}

function refreshMenu(method){
	nappDrawer = null; 
	createMyDrawer(Alloy.createController("menu").getView(),method);
	
	if(method == "login"){
		nappDrawer.setOpenDrawerGestureMode(NappDrawerModule.OPEN_MODE_NONE);
	}
	nappDrawer.open(); 
}

/**Private function**/
var createCenterNavWindow = function(method){	
	var rightBtn = Ti.UI.createButton();
	rightBtn.addEventListener("click", function(){
		nappDrawer.toggleRightWindow();
	});
	 
	var navController = openNewNavWindow(method);

	return navController;
};

var openNewNavWindow = function(target,param){
	if(param == ""){
		var win = Alloy.createController(target).getView();
	}else{
		var win = Alloy.createController(target,param).getView();
	}
	
	if (Titanium.Platform.name == 'android') {
    	var navController =  win;
	}else{
		 
		var myWin = Ti.UI.createWindow({ 
			navBarHidden: true,
			fullscreen  : true,
			backgroundImage: "/images/bg.jpg"
		});
		myWin.add(win);
		var navController =  Ti.UI.iOS.createNavigationWindow({
			window : myWin
		});
	}
	return navController;
};
 

var navigation = function(target, skipToggle, param){
	//clear current window cache
	Ti.App.fireEvent("clearObject");
	
	//go to new window
	var newWin = openNewNavWindow(target, param);
	nappDrawer.setCenterWindow(newWin);
	
	if(skipToggle != 1){
		nappDrawer.toggleRightWindow();
	}
	if(target == "login"){
		nappDrawer.setOpenDrawerGestureMode(NappDrawerModule.OPEN_MODE_NONE);
	}else{
		nappDrawer.setOpenDrawerGestureMode(NappDrawerModule.OPEN_MODE_ALL);
	}
};

/**API function to call **/
exports.initDrawer = function (module){  
	refreshMenu(module);
};


exports.navigation = function(target,isSkipToggle, param){  
	navigation(target , isSkipToggle, param); 
};

exports.closeToggle = function(target){ 
	nappDrawer.toggleRightWindow();
};

exports.disableToggle = function(){ 
	nappDrawer.setOpenDrawerGestureMode(NappDrawerModule.OPEN_MODE_NONE);
};

exports.initMenu = function(){ 
	refreshMenu('home');
	navigation("member",1);   
};

exports.logout = function(){
	
	refreshMenu('login');
	navigation("home",1);
};


