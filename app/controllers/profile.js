var args = arguments[0] || {};
Ti.App.Properties.setString('parent',"settings");
var u_id = Ti.App.Properties.getString("user_id");
var mod_users = Alloy.createCollection('user'); 
var details = mod_users.getUserById(u_id); 
COMMON.construct($);
COMMON.showLoading();
setTimeout(function(){   
	loadTable();
}, 300);  


var back =  function (){
	DRAWER.navigation("settings",1);
};

function loadTable(){
	details  = mod_users.getUserById(u_id); 
	var RegArr = [
	{ title:'Username', value:details.username, mod: "username",  hasChild:false  },
	{ title:'Fullname', value:details.fullname, mod:"fullname", hasChild:true },
	{ title:'Email',  value:details.email, mod:"email",hasChild:true },
	];
	
	var separatorColor = "#ffffff";
 	if(Ti.Platform.osname == "android"){
 		separatorColor = "#375540";
 	}
	var RegTable = Titanium.UI.createTableView({
		width:'100%',
		separatorColor: separatorColor ,
		scrollable: false
	});
	
	var regData=[];
	for (var j=0; j< RegArr.length; j++) {
	 
	   var regRow = Titanium.UI.createTableViewRow({
	   		titles: RegArr[j].title ,  
		    touchEnabled: true,
		    mod: RegArr[j].mod, 
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
		
		var title = Titanium.UI.createLabel({
			titles: RegArr[j].title ,  
			text: RegArr[j].title ,  
			mod: RegArr[j].mod,  
			font:{fontSize:16 },
			color: "#848484",
			width:'auto',
			textAlign:'left',
			left:10
		});
		
		var label = Titanium.UI.createLabel({
			text: RegArr[j].value ,
			titles: RegArr[j].title ,  
			mod: RegArr[j].mod,   
			font:{fontSize:14 },
			color: "#848484",
			width:'auto',
			textAlign:'left',
			right:50
		});
	
		regRow.add(title);
		regRow.add(label);
		var rightRegBtn =[];
		if(RegArr[j].hasChild == true){
			 rightRegBtn =  Titanium.UI.createImageView({
				image:"/images/btn-forward.png", 
				//mod: RegArr[j].mod, 
				width:15,
				height:15,
				right:20,
				top:20
			});		
			regRow.add(rightRegBtn);
		}
		
		regData.push(regRow);
	}
	 
	RegTable.setData(regData);
	addRegClickEvent(RegTable);
	$.table1Container.add(RegTable); 
	
	//PASSWORD TABLE
	var passData=[];
	
	var PassTable = Titanium.UI.createTableView({
		width:'100%',
		separatorColor: '#ffffff' ,
		scrollable: false
	});
	var passRow = Titanium.UI.createTableViewRow({
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
	var title = Titanium.UI.createLabel({
			text: "Change Password", 
			font:{fontSize:16 },
			color: "#848484",
			width:'auto',
			textAlign:'left',
			left:10
	});
		
	var label = Titanium.UI.createLabel({
			
			font:{fontSize:14 },
			color: "#848484",
			width:'auto',
			textAlign:'left',
			right:50
	});
	
	rightRegBtn =  Titanium.UI.createImageView({
				image:"/images/btn-forward.png",
				width:15,
				height:15,
				right:20,
				top:20
	});	
		
	passRow.addEventListener('click',  function(event){ 
			DRAWER.navigation("editPassword",1,{username: details.username});
	});
	passRow.add(title);
	passRow.add(label);
	passRow.add(rightRegBtn);
	passData.push(passRow);
	PassTable.setData(passData);
	$.table2Container.add(PassTable);  
	COMMON.hideLoading();
}


function addRegClickEvent(table){
	
	table.addEventListener('click', function(e){
		if(e.index > 0){
		  var selectedSection = e.source;
			var args = {
				'title'  : selectedSection.titles,
				'module' : selectedSection.mod,
				'fullname'  :details.fullname,
				'email'  :details.email
			};
			 
			DRAWER.navigation("editProfile",1,args); 
		}
	});
	
	
}

