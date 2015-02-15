var mainView = null;
var mod_InventoryRes = Alloy.createCollection('resource_inventory'); 
var details = mod_InventoryRes.getResourceList(); 

exports.construct = function(mv){
	mainView = mv;
};
 
exports.displayResources = function(resource){
 
	if(resource == ""){
		resource = details;
	}
 
	var TheTable = Titanium.UI.createTableView({
		width:'100%',
		backgroundImage: "/images/bg.jpg",
		separatorColor: '#375540'
	});
	var data=[]; 
	//hide loading bar
	COMMON.hideLoading();
   	var counter = 0;
   	if(resource.length < 1){
		var noRecord = Ti.UI.createLabel({ 
			text: "No record found", 
			color: '#375540', 
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		 	font:{fontSize:14,fontStyle:'italic'},
			top: 15,
			width: "100%"
		});
		mainView.resourceView.add(noRecord);
	}else{
		var counter =1;
		resource.forEach(function(entry) {
			 
			var row = Titanium.UI.createTableViewRow({
		    touchEnabled: true,
		    source: entry.id,
		    position: counter,
		    selectedBackgroundColor: "#ECFFF9",
			backgroundGradient: {
			      type: 'linear',
			      colors: ['#fff','#F7F7F6'],
			      startPoint: {x:0,y:0},
			      endPoint:{x:"100%",y:0},
			      backFillStart:false
			    },
		    });
			
			var row_view = Ti.UI.createView({
				left: 5,
		    	top: 5, 
		    	right: 5,
		    	bottom: 5,
		    	height: 80,
		    	width: Ti.UI.FILL,
		    	layout: "horizontal",
			});
			
			var tblView = Ti.UI.createView({
				layout: "vertical",
				height:"80",
				width:"auto",
			}); 
			
			var leftImage =  Titanium.UI.createImageView({
				image:entry.image,
				source: entry.id,
				width: 112,
				right: 10,
				height: 80,
			});	
		
			var popUpTitle = Titanium.UI.createLabel({
				text:entry.name,
				font:{fontSize:14, fontWeight:'bold'},
				source: entry.id,
				color: "#848484",
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
				textAlign:Titanium.UI.TEXT_ALIGNMENT_LEFT,
				wordwrap: false,
				ellipsize : true
			});
			
			var category =  Titanium.UI.createLabel({
				text:entry.type,
				source: entry.id,
				font:{fontSize:11},
				color: "#848484",
				textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
			});
			
			var distance =  Titanium.UI.createLabel({
				text:entry.supplier,
				source: entry.id,
				font:{fontSize:11},
				color: "#848484",
				textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
			}); 
			
			var quantity_view = Ti.UI.createView({
				layout: "horizontal",
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
				top: 5,
			});
			
			var quantity_text_view = Ti.UI.createView({
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE,
				source: entry.id,
				backgroundColor: "#375540",
			});
			 
			var quantity_text =  Titanium.UI.createLabel({
				text: "QUANTITY",
				source: entry.id,
				font:{fontSize:14},
				left: 5,
				right: 5,
				color: "#ffffff",
				textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.SIZE,
				height: 20,
			});
			
			var quantity_text_input = Titanium.UI.createTextField({
				editable: false,
				borderColor: "#375540",
				height: 20,
				width: Ti.UI.FILL,
				value: entry.quantity,
				textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
			});
			
			quantity_text_view.add(quantity_text);
			quantity_view.add(quantity_text_view);
			quantity_view.add(quantity_text_input);
			
			row.addEventListener('click', function(e) {
			 	viewDetails(e);
			});
		 	
			tblView.add(popUpTitle);
			tblView.add(category);
		 	tblView.add(distance);  
		 	tblView.add(quantity_view);
		 	
		 	row_view.add(leftImage);
		 	row_view.add(tblView);
		 	row.add(row_view);
		 	data.push(row);
		 	counter++;
		});
		
		TheTable.setData(data); 
		mainView.resourceView.add(TheTable);
	}
};

function viewDetails(e){
	DRAWER.navigation("resourceDetails",1 ,{p_id: e.source.source});
}

exports.refreshTableList = function(){
	removeAllChildren(mainView.resourceView);
	displayResources(details);	  
};