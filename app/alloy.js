// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){}; 
var API = require('api');
var COMMON = require('common');
var DRAWER = require('drawer');


function menuToggle(e){  
	DRAWER.closeToggle();
}


function PixelsToDPUnits(ThePixels){
  return (ThePixels / (Titanium.Platform.displayCaps.dpi / 160));
}

function DPUnitsToPixels(TheDPUnits){
  return (TheDPUnits * (Titanium.Platform.displayCaps.dpi / 160));
}

var getValueFromPipe = function(myCode){ 
	var data = myCode.split("||");  
 	var obj = {};
 	
 	if(data[0] == "done"){
 		obj['type'] = data[0]; 
 	}else if(data[0] == "product"){
 		obj['type'] = data[0];
		obj['id'] = data[1];
		obj['prefix'] = data[2];
		obj['item_id'] = data[3];
		obj['product'] = data[4];
		obj['code'] = data[5]; 
 		
 	}else{
 		obj['type'] = data[0];
		obj['prefix'] = data[1];
		obj['item_id'] = data[2];
		obj['name'] = data[3];
		obj['code'] = data[4]; 
		obj['id']   = data[5]; 
 	}
	
	return obj;
};

function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

function currentDateTime(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();
	
	var hours = today.getHours();
	var minutes = today.getMinutes();
	var sec = today.getSeconds();
	if (minutes < 10){
		minutes = "0" + minutes
	} 
	if (sec < 10){
		sec = "0" + sec
	} 
	if(dd<10) {
	    dd='0'+dd;
	} 
	
	if(mm<10) {
	    mm='0'+mm;
	} 
	
	datetime = yyyy+'-'+mm+'-'+dd + " "+ hours+":"+minutes+":"+sec;
	return datetime ;
}

function timeFormat(datetime){
	var timeStamp = datetime.split(" ");  
	var newFormat;
	var ampm = "am";
	var date = timeStamp[0].split("-");  
	var time = timeStamp[1].split(":");  
	if(time[0] > 12){
		ampm = "pm";
		time[0] = time[0] - 12;
	}
	
	newFormat = date[2]+"/"+date[1]+"/"+date[0] + " "+ time[0]+":"+time[1]+ " "+ ampm;
	return newFormat;
}

function removeAllChildren(viewObject){
    //copy array of child object references because view's "children" property is live collection of child object references
    var children = viewObject.children.slice(0);
 
    for (var i = 0; i < children.length; ++i) {
        viewObject.remove(children[i]);
    }
}

function validateEmail(email) { 
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 
