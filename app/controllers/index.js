var u_id = Ti.App.Properties.getString("user_id");
console.log(u_id);console.log("geo");
if(u_id == "" || u_id === null){
	DRAWER.initDrawer('login');
}else{
	DRAWER.initDrawer('home');
}


// event 
Ti.App.addEventListener("app:refreshMenu", function(e) {
	DRAWER.initMenu();
});

API.updateSettings();
API.getAnnouncement();
API.getCategory();
