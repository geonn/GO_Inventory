var args = arguments[0] || {};
Ti.App.Properties.setString('parent',"profile");
$.editProfile.hintText = args.title;
$.description.text  = "Edit your "+ args.module + " below:"; 
var isSubmit        = 0;

if(args.title == "Fullname"){
	$.editField.value = args.fullname;
}else{
	$.editField.value = args.email;
}

if(Ti.Platform.osname == "android"){
	$.editField.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
}

var back =  function (){
	var isSaved = doSave();
	if(isSaved === true){
		$.editField.blur();
		DRAWER.navigation("profile",1);
	}
	
};

var doSave = function (){
	if(isSubmit == 1){
		return;
	}
	isSubmit = 1;
	
 	COMMON.showLoading();
 	
 	if(args.title == "Fullname"){
 		if($.editField.value == ""){
 			COMMON.createAlert('Empty Full Name', 'Full name cannot be empty.');
	 		isSubmit = 0;
			COMMON.hideLoading();
			return false;	
 		}
 		API.updateUserProfile({
 			field    : "fullname",
			value : $.editField.value 
		});
		 
	}else{
		var isValidEmail = validateEmail($.editField.value); 
		if($.editField.value == ""){
 			COMMON.createAlert('Empty Email', 'Email cannot be empty.');
		 	isSubmit = 0;
			COMMON.hideLoading();
			return false;	
 		}
 		
 		if(isValidEmail === false){
			COMMON.createAlert("Invalid Email","Please fill in valid email address"); 
			isSubmit = 0;
			COMMON.hideLoading();
			return false;
		}
		
		API.updateUserProfile({
			field    : "email",
			value : $.editField.value 
		}); 
		
	}
	
	return true;
	
	
};

$.editProfile.addEventListener('load', function(e) {
	$.editField.focus();
});

$.editProfile.addEventListener('open', function(e) {
	$.editField.focus();
});
/** close all editProfile eventListener when close the page**/
$.editProfile.addEventListener("close", function(){
	$.destroy();
    /* release function memory */
    doSave    = null;
});
