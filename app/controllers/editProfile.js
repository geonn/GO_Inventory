var args = arguments[0] || {};
Ti.App.Properties.setString('module',"profile");
$.editProfile.hintText = args.title;
$.description.text  = "Edit your "+ args.module + " below:"; 
if(args.title == "Fullname"){
	$.editField.value = args.fullname;
}else{
	$.editField.value = args.email;
}

if(Ti.Platform.osname == "android"){
	$.editField.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
}

var back =  function (){
	$.editField.blur();
	DRAWER.navigation("profile",1);
};

var doSave = function (){
	
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
