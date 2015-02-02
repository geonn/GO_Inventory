var args = arguments[0] || {};
COMMON.construct($);
 
function doLogin(){
	COMMON.showLoading();
	var username = $.username.value;
	var password = $.password.value;
	
	if(username == "" || password == ""){
		COMMON.createAlert('Authentication warning','Please fill in username and password');
		COMMON.hideLoading();
		
		$.btnLogin.show();
		return;
	}else{
		API.login({username : username, password:password }); 
	}
}
 
function hideLoading(){
	COMMON.hideLoading();
	$.btnLogin.show();
}

function showLoading(){
	COMMON.showLoading();
	$.btnLogin.hide();
}

$.passwordhint.addEventListener('click', function (e) {
    $.passwordhint.visible = false;
    $.password.focus();
});
        
$.password.addEventListener('blur', function (e){
	if($.password.value <= 0){
		$.passwordhint.visible = true;
	}
});

$.password.addEventListener('focus', function (e){
	$.passwordhint.visible = false;
    $.password.focus();
});

$.usernamehint.addEventListener('click', function (e) {
    $.usernamehint.visible = false;
    $.username.focus();
});
        
$.username.addEventListener('blur', function (e){
	if($.username.value <= 0){
		$.usernamehint.visible = true;
	}
});

$.username.addEventListener('focus', function (e){
	$.usernamehint.visible = false;
    $.username.focus();
});

Ti.App.addEventListener('showLoading', showLoading);
Ti.App.addEventListener('hideLoading', hideLoading);

/** close all login eventListener when close the page**/
$.loginView.addEventListener("close", function(){
    $.destroy(); 
});