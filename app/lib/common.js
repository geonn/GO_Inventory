var mainView = null;

exports.construct = function(mv){
	mainView = mv;
};
exports.deconstruct = function(){  
	mainView = null;
};

exports.hideLoading = function(){
	mainView.activityIndicator.hide();
	mainView.loadingBar.opacity = "0";
	mainView.loadingBar.height = "0";
	mainView.loadingBar.top = "0"; 
};

exports.showLoading = function(){ 
	mainView.activityIndicator.show();
	mainView.loadingBar.opacity = "1";
	mainView.loadingBar.zIndex = "100";
	mainView.loadingBar.height = "120";
	 
	if(Ti.Platform.osname == "android"){
		mainView.loadingBar.top =  (DPUnitsToPixels(Ti.Platform.displayCaps.platformHeight) / 2) -50; 
		mainView.activityIndicator.style = Ti.UI.ActivityIndicatorStyle.BIG;
		//mainView.activityIndicator.top = 0; 
	}else if (Ti.Platform.name === 'iPhone OS'){
		mainView.loadingBar.top = (Ti.Platform.displayCaps.platformHeight / 2) -50; 
		mainView.activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
	}  
};

exports.createAlert = function(tt,msg){
	var box = Titanium.UI.createAlertDialog({
		title: tt,
		ok: 'Okay',
		message: msg
	});
	box.show();
};

exports.noRecord = function(){
	var data = [];
	var row = Titanium.UI.createTableViewRow({
		touchEnabled: false,
		backgroundColor: 'transparent' 
	});
		 
	var tblView = Ti.UI.createView({
		height: 'auto'//parseInt(Ti.Platform.displayCaps.platformHeight) -100
	}); 

	var noRecord = Ti.UI.createLabel({ 
		text: "No record found", 
		color: '#375540', 
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		 font:{fontSize:14,fontStyle:'italic'},
		top: 15,
		width: "100%"
	});
	tblView.add(noRecord); 
	row.add(tblView); 
	data.push(row);
	return data;
};

exports.popup = function(subView,config){
    //Popup win
	var popupWin = Ti.UI.createWindow({
		backgroundImage : "/images/Transparent.png",
		opacity            : 0, 
		id                : "popupWin"
	});
	
	//View that used to show the msg
	var popupView = Ti.UI.createView({
		width    : config.width,
		height    : config.height,
		backgroundColor : "#000000",
		borderRadius : 10,
		borderColor : "#565656",
		borderWidth : 1
	}); 
	 
	popupView.add(subView ); 
	popupWin.add(popupView);
 
	//Event to close the popup window
	popupWin.addEventListener("click", function(e){
		if(e.source.id != null){
			popupWin.close();
		}
	});
		
	var matrix = Ti.UI.create2DMatrix(); 
	matrix = matrix.scale(1.3, 1.3);
	  
	popupWin.addEventListener('open', function(){
	    if (Titanium.Platform.name == 'android') {
    		popupWin.activity.actionBar.hide();
		}
	    
	    var a = Ti.UI.createAnimation({
		    transform : matrix,
		    opacity: 1, 
		    duration : 500, 
		});
		popupWin.animate(a);  
	}); 
	 
	return popupWin;
};