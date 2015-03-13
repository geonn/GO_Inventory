var args = arguments[0] || {};
Ti.App.Properties.setString('parent',"settings");
function goBack(e){ 
	DRAWER.navigation("settings",1 ); 
};