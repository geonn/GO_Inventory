var args = arguments[0] || {}; 
var pop;
var MODULE = require("scanner");
var iCard =  Ti.App.Properties.getString("iCard");
var mod_InventoryProd = Alloy.createCollection('product_inventory');
var mod_products = Alloy.createCollection('products'); 
var mod_resources = Alloy.createCollection('resources'); 
Ti.App.Properties.setString('parent',"");
var pHeight = Ti.Platform.displayCaps.platformHeight; 
if(Ti.Platform.osname == "android"){
	$.assignmentView.height = pHeight;
	$.detailScrollView.height =  PixelsToDPUnits( parseInt(pHeight) ) - 230;
}else if (Ti.Platform.name === 'iPhone OS'){
	$.assignmentView.height = pHeight;
	$.detailScrollView.height = pHeight - 230;	
}

var containerView = Ti.UI.createView({
	layout: "composite",
	height:"100%",
	width:"100%",
	backgroundColor: "black"
}); 


checkActionEligible();
if(iCard !== null){
	populateData();
}

function populateData(){
	
	iCard = Ti.App.Properties.getString("iCard");
  
	if(iCard === null && iCard == "undefined"){
		return;	
	}
	 
	checkActionEligible();
	removeAllChildren($.resource_info);
	var det = mod_products.getProductDetails(iCard);
	var res_det = mod_resources.getResourcesByicard(iCard);
	var prod_det = mod_InventoryProd.getProductDetails(det.product); 
	 
	if(det.done == "1"){  
		$.infoContainer.backgroundColor = "#375540";
		$.infoLabel.text = "COMPLETED";
		$.infoContainer.color = "#FFFFFF";
	}else{ 
		$.infoLabel.text = "";
	}
 	$.productImage.image = prod_det.image;
 	$.iCard_no.text = det.code;
 	$.iCard_name.text = prod_det.name;
	//$.iCard_info.text =  prod_det.name + " ("+det.code+") at " + timeFormat(det.updated); 
	for(var i=0; i < res_det.length; i++){ 
		var textColor = "#9D001D"; 
		if(res_det[i].status > 1){
			var textColor = "#365640";
		}
		var resource_label = $.UI.create('Label', {
			
		  classes : ['gray_text'], 
		  color : textColor,
		  text: res_det[i].name	+ " ("+res_det[i].code+") at "+ timeFormat(res_det[i].updated),  
		  width: Ti.UI.SIZE, 
		  height: Ti.UI.SIZE, 
		  left:0,
		  textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		  top: 5
		});
		$.resource_info.add(resource_label);
	} 
} 

function checkActionEligible(){
	iCard = Ti.App.Properties.getString("iCard");
	  
	if(iCard !== null && iCard != "undefined"){
	 
		var lastScan = mod_resources.getLastScan({code:iCard });
		if(lastScan != ""){
			$.undo_btn.visible = true;
			$.done_btn.visible = true;
		}else{
			$.undo_btn.visible = false;
			$.done_btn.visible = false;
		}
	}else{
		$.undo_btn.visible = false;
		$.done_btn.visible = false;
	}
}

function done(e){ 
	mod_resources.confirmScan({code:Ti.App.Properties.getString("iCard") });
	setTimeout(function(){   
		var data = mod_resources.getResourcesToSync({iCard: iCard});
		API.updatedCombination({
				iCard : iCard,
				data : data,
		});
	}, 300);  
	 
	removeAllChildren(containerView);
	//var det = mod_products.getProductDetails(iCard);
	var confirmView = Ti.UI.createView({
		layout: "vertical",
		height:"100%",
		width:"100%"
	});
	var titleView = Ti.UI.createView({
		layout: "composite",
		height:"20%",
		width:"100%",
		backgroundColor:"#375540"
	});
	var titleLabel = Ti.UI.createLabel({
			color: '#ffffff',
			font: { fontSize:16 },
			text: 'Resources Attached',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			width: Ti.UI.SIZE, 
			height: Ti.UI.SIZE
		});
		
		var contentView = Ti.UI.createView({
			layout: "vertical",
			height:"85%",
			width:"100%",
			backgroundColor:"#EFEFEF", 
		});
		var msgLabel = Ti.UI.createLabel({
			color: 'black',
			font: { fontSize:14 },
			text: 'All scanned resources attached to ' + iCard,
			width: "80%" ,
			top:15
		});
		var centerImageView = Ti.UI.createView({
			layout: "composite",
			height:"80",
			width: "100%",
		});
		
		var imageView = Ti.UI.createView({
			layout: "horizontal",
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE,
			top:20
		});
		
		 
		okayBtn = Ti.UI.createImageView({
			image:'/images/Button_OK.png', 
			width: 60,
			height: 60,
			left: 10
		});
		 
		contentView.add(msgLabel);
		titleView.add(titleLabel); 
		imageView.add(okayBtn);
		centerImageView.add(imageView);
		confirmView.add(titleView);
		confirmView.add(contentView);
		contentView.add(centerImageView);
		containerView.add(confirmView);
		var config = [];
		config.width = "70%";
		config.height = "35%";
		//$.mainView.add(containerView);
		pop = COMMON.popup(containerView,config);
		pop.open({fullscreen:true, navBarHidden: true}); 
		addDoneEvent(okayBtn,pop);  
		populateData();
		checkActionEligible();
}

function undo(e){ 
	var lastScan = mod_resources.getLastScan({code:Ti.App.Properties.getString("iCard") });
	if(lastScan !== null){
		removeAllChildren(containerView);
		var confirmView = Ti.UI.createView({
			layout: "vertical",
			height:"100%",
			width:"100%"
		});
		var titleView = Ti.UI.createView({
			layout: "composite",
			height:"20%",
			width:"100%",
			backgroundColor:"#375540"
		});
		var titleLabel = Ti.UI.createLabel({
			color: '#ffffff',
			font: { fontSize:16 },
			text: 'Undo Confirmation',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			width: Ti.UI.SIZE, 
			height: Ti.UI.SIZE
		});
		
		var contentView = Ti.UI.createView({
			layout: "vertical",
			height:"85%",
			width:"100%",
			backgroundColor:"#EFEFEF", 
		});
		var msgLabel = Ti.UI.createLabel({
			color: 'black',
			font: { fontSize:14 },
			text: 'Are you sure want to undo last scan?',
			width: "80%" ,
			top:15
		});
		var centerImageView = Ti.UI.createView({
			layout: "composite",
			height:"80",
			width: "100%",
		});
		
		var imageView = Ti.UI.createView({
			layout: "horizontal",
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE,
			top:20
		});
		
		cancelBtn = Ti.UI.createImageView({
			image:'/images/Button_Cancel.png',
			btnAction : "cancel",
			width: 60,
			height: 60,
			right: 10
		});
	
		confirmBtn = Ti.UI.createImageView({
			image:'/images/Button_Confirm.png',
			btnAction : "confirm",
			width: 60,
			height: 60,
			left: 10
		});
		 
		contentView.add(msgLabel);
		titleView.add(titleLabel);
		imageView.add(cancelBtn);
		imageView.add(confirmBtn);
		centerImageView.add(imageView);
		confirmView.add(titleView);
		confirmView.add(contentView);
		contentView.add(centerImageView);
		containerView.add(confirmView);
		var config = [];
		config.width = "70%";
		config.height = "35%";
		//$.mainView.add(containerView);
		pop = COMMON.popup(containerView,config);
		pop.open({fullscreen:true, navBarHidden: true}); 
		addClickEvent(cancelBtn,pop,lastScan); 
		addClickEvent(confirmBtn,pop,lastScan);  
	}else{
		
	}
	 
}

function addDoneEvent(myView, popView){
	myView.addEventListener('click', function(e){
		pop.close();
	});
}
function addClickEvent(myView, popView,data){
	myView.addEventListener('click', function(e){
		if(e.source.btnAction == "cancel"){
			pop.close();
		}else{  
			mod_resources.removeScanById({id:data['id'] });
			checkActionEligible();
			populateData();
			pop.close();
			
		}
	});
}



/***Create Scanner View***/
// Create a window to add the picker to and display it. 
var window = MODULE.createScannerWindow();

// create start scanner button
var button = MODULE.createScannerButton();

button.addEventListener('click', function() {
	MODULE.openScanner("1");
});

if(Ti.Platform.osname == "android"){
	$.detailScrollView.overScrollMode = Titanium.UI.Android.OVER_SCROLL_NEVER;
}

Ti.App.addEventListener('populateData', populateData);

MODULE.init(window); 
$.scanner.add(button);
 