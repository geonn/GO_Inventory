var args = arguments[0] || {};
Ti.App.Properties.setString('module',"");
var mod_settings = Alloy.createCollection('settings'); 
var syncVal = mod_settings.getSettingById("1");
var pushVal = mod_settings.getSettingById("2"); 
generateSettingTable(); 

function generateSettingTable(){
	var tbl_data = [
	    { title: 'About', hasChild:true}, 
		{ title: 'Profile', hasChild:true },
		{ title: 'Auto Sync', hasChild:false, id: "1", action:'sync' ,value: syncVal['value']},
		{ title: 'Push Notification', hasChild:false ,id: "2", action: 'push', value: pushVal['value']}
	]; 
	
	var separatorColor = "#ffffff";
 	if(Ti.Platform.osname == "android"){
 		separatorColor = "#375540";
 	}
	var RegTable = Titanium.UI.createTableView({
		width:'100%', 
		backgroundImage: "/images/bg.jpg",
		separatorColor: separatorColor ,
		scrollable: false
	});

	var regData=[];
	for (var j=0; j< tbl_data.length; j++) {

	   var regRow = Titanium.UI.createTableViewRow({
		    touchEnabled: true,
		    height: 50, 
		    id: "profile",
		    selectedBackgroundColor: "#ECFFF9",
			backgroundGradient: {
		      type: 'linear',
		      colors: ['#FEFEFB','#F7F7F6'],
		      startPoint: {x:0,y:0},
		      endPoint:{x:0,y:50},
		      backFillStart:false},
		  });

		var title = $.UI.create('label', {
			text: tbl_data[j].title,  
			color: "#848484",
			width:'auto',
			textAlign:'left',
			left:20,
		});

		if(tbl_data[j].hasChild == true){
			var rightAction =  Titanium.UI.createImageView({
				image:"/images/btn-forward.png",
				width:15,
				height:15,
				right:20,
				top:20
			});		
		}else{
			var rightAction = Ti.UI.createSwitch({
			 	value:tbl_data[j].value, // mandatory property for iOS   
			 	action :  tbl_data[j].action,
				right:20 
			});
			
			switchEvent(rightAction,tbl_data[j].id,tbl_data[j].action);
		}
		

		regRow.add(title);
		regRow.add(rightAction);
		regData.push(regRow);
	}

	RegTable.setData(regData);  
	$.setting.add(RegTable);
}

function switchEvent(rightAction,a_id, action){
	rightAction.addEventListener('change',function(e){  
		mod_settings.updateSettings(a_id,action, e.value);
	});
}

/* Event Listener */
$.setting.addEventListener("close", function(){
    $.destroy();
});

$.setting.addEventListener('click', function(e){
	if(e.index == 0){
		DRAWER.navigation("about",1);
	}
	if(e.index == 1){
		DRAWER.navigation("profile",1);
	}
	 
});

