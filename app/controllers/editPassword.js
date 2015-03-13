var args = arguments[0] || {}; 
Ti.App.Properties.setString('parent',"profile");
$.username.text = args.username;
var u_id = Ti.App.Properties.getString("user_id");
var mod_users = Alloy.createCollection('user'); 
var details = mod_users.getUserById(u_id);
COMMON.construct($);

var isSubmit        = 0;

var back =  function (){
	$.currentPasswordField.blur();
	$.editPasswordField.blur();
	$.editConfirmPasswordField.blur();
	DRAWER.navigation("profile",1);
};

if(Ti.Platform.osname == "android"){ 
	$.currentPasswordField.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
} 
 
var doSave = function(){ 
	if(isSubmit == 1){
		return;
	}
	isSubmit = 1;
	
 	COMMON.showLoading();
	//console.log($.editPasswordField.value+"=="+$.editConfirmPasswordField.value);
	
	if(($.currentPasswordField.value == "") || ($.editPasswordField.value == "") || ($.editConfirmPasswordField.value == "")){
		COMMON.createAlert('Password Blank', 'Please filled in all password fields.');
		isSubmit = 0;
		COMMON.hideLoading();
		return;	
	}
	 
	if($.currentPasswordField.value !== details.password){
		COMMON.createAlert('Password Mismatch', 'Wrong current password.');
		isSubmit = 0;
		COMMON.hideLoading();
		return;	
	}
	//Check if password match
	if($.editPasswordField.value !== $.editConfirmPasswordField.value){ 
		COMMON.createAlert('Password Mismatch', 'Both password must be match.');
		isSubmit = 0;
		COMMON.hideLoading();
		return;	
	}  
	 
	API.changePassword({
		current_password : $.currentPasswordField.value,
		password         : $.editPasswordField.value
			
	});
	
};

$.editPassword.addEventListener('load', function(e) {
	$.currentPasswordField.focus();
});
 

/** close all editProfile eventListener when close the page**/
$.editPassword.addEventListener("close", function(){
	$.destroy(); 
    /* release function memory */
    doSave    = null;
});
