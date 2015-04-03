var mainView = null; 
var blobContainer = [];
function displayCategory(){
	var data=[]; 
	var mod_InventoryRes = Alloy.createCollection('resource_inventory'); 
	var category = mod_InventoryRes.getResourcesCategory(); 
	mainView.resTable.data = []; 
	if(category.length < 1){ 
		mainView.resTable.setData(COMMON.noRecord());
	}else{
		var counter =1;
		
		category.forEach(function(entry) {
			 
			var row = Titanium.UI.createTableViewRow({
		    touchEnabled: true,
		    source: entry.type,  
		    backgroundColor: "#ffffff",
		    backgroundSelectedColor: "#ECFFF9",
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
		    	height: 30,
		    	width: Ti.UI.FILL,
		    	source: entry.type,  
		    	layout: "horizontal",
			});
			
			var tblView = Ti.UI.createView({
				layout: "vertical",
				source: entry.type,  
				height:"30",
				width: "90%",
			}); 
			
			 
			var popUpTitle = Titanium.UI.createLabel({
				text:entry.type + " ("+entry.total+")",
				font:{fontSize:14, fontWeight:'bold'},
				source: entry.type,
				color: "#848484",
				width: "90%",
				height: Ti.UI.SIZE,
				textAlign:Titanium.UI.TEXT_ALIGNMENT_LEFT,
				wordwrap: false,
				ellipsize : true
			});
			
			var rightImage =  Titanium.UI.createImageView({
				image:"/images/btn-forward",
				source: entry.type,
				width: 20,
				right: 10,
				height: 20,
			});	
			
			row.addEventListener('click', function(e) {
			 	viewResourcesList(e);
			});
		 	
			tblView.add(popUpTitle); 
		 	
		 	row_view.add(tblView);
		 	row_view.add(rightImage);
		 	row.add(row_view);
		 	data.push(row); 
		}); 
		mainView.resTable.setData(data);  
	}
}

exports.construct = function(mv){
	mainView = mv;
};
 
exports.deconstruct = function(){ 
	blobContainer = null;
	mainView = null;
};

exports.displayResources = function(resource){
 	 
	if(resource == "1"){
		var mod_InventoryRes = Alloy.createCollection('resource_inventory'); 
		var details = mod_InventoryRes.getResourceList(0); 
		resource = details;
	}
 
	var data=[]; 
	mainView.resTable.data = []; 
	//hide loading bar
	COMMON.hideLoading();
   	var counter = 0;
   	if(resource.length < 1){ 
		mainView.resTable.setData(COMMON.noRecord());
	}else{
		var counter =1;
		 
		resource.forEach(function(entry) {
			 
			var row = Titanium.UI.createTableViewRow({
		    touchEnabled: true,
		    source: entry.id,
		    position: counter,
		    backgroundSelectedColor: "#ECFFF9",
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
			
			var imageContainer = Ti.UI.createView({
				height:80,
				source: entry.id, 
				width:112 
			});
			
			if(entry.image == ""){
				var leftImage = Ti.UI.createImageView({
					image: "/images/noImage.png", 
					source: entry.id, 
					width:"80%"
				});
			}else{
				var leftImage = Ti.UI.createImageView({
					image: entry.image, 
					source: entry.id, 
					defaultImage: "/images/warm-grey-bg.png",
					width:"80%"
				});
			}
			
			var activityIndicator = COMMON.showImageIndicator(); 
			imageContainer.add(leftImage); 
			imageContainer.add(activityIndicator);
			COMMON.imageIndicatorEvent(leftImage,activityIndicator); 
			  
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
			
			var supplier =  Titanium.UI.createLabel({
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
				source: entry.id,
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
			 
			if(entry.quantity == ""){
				entry.quantity = "N/A";
			}
			
			var quantity_text_input = Titanium.UI.createLabel({
				borderColor: "#375540",
				height: 20,
				source: entry.id,
				width: 100,
				text:  entry.quantity,
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
		 	tblView.add(supplier);  
		 	tblView.add(quantity_view);
		 	
		 	row_view.add(imageContainer);
		 	row_view.add(tblView);
		 	row.add(row_view);
		 	data.push(row);
		 	counter++;
		});
		
		if(Ti.Platform.osname == "android"){ 
		//	mainView.resTable.height =   PixelsToDPUnits(Ti.Platform.displayCaps.platformHeight)  -100;  
		} 
		mainView.resTable.setData(data);  
		data= null;
	}
};

function loadPhoto(preview, removeBtn,saveBtn){
	var dialog = Titanium.UI.createOptionDialog({ 
	    title: 'Choose an image source...', 
	    options: ['Camera','Photo Gallery', 'Cancel'], 
	    cancel:2 //index of cancel button
	});
	  
	dialog.addEventListener('click', function(e) { 
	     
	    if(e.index == 0) { //if first option was selected
	        //then we are getting image from camera
	        Titanium.Media.showCamera({ 
	            success:function(event) { 
	                var image = event.media; 
	                
	                if(image.width > image.height){
	        			var newWidth = 320;
	        			var ratio =   320 / image.width;
	        			var newHeight = image.height * ratio;
	        		}else{
	        			var newHeight = 320;
	        			var ratio =   320 / image.height;
	        			var newWidth = image.width * ratio;
	        		}
	        		
	        		image = image.imageAsResized(newWidth, newHeight);

	                if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
	                   //var nativePath = event.media.nativePath; 
		            	preview.image = image;
			            blobContainer = image;
			            	
		            	removeBtn.visible = true; 
		            	if(saveBtn != ""){
				            saveBtn.visible = true;
				        }
			            
			            //mainView.undoPhoto.visible = true;
	                }
	            },
	            cancel:function(){
	                //do somehting if user cancels operation
	            },
	            error:function(error) {
	                //error happend, create alert
	                var a = Titanium.UI.createAlertDialog({title:'Camera'});
	                //set message
	                if (error.code == Titanium.Media.NO_CAMERA){
	                    a.setMessage('Device does not have camera');
	                }else{
	                    a.setMessage('Unexpected error: ' + error.code);
	                }
	 
	                // show alert
	                a.show();
	            },
	            allowImageEditing:true,
	            mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
	            saveToPhotoGallery:true
	        });
	    } else if(e.index == 1){
	    	 
	    	//obtain an image from the gallery
	        Titanium.Media.openPhotoGallery({
	            success:function(event){
	            	// set image view
	            	var image = event.media;  
	            	if(image.width > image.height){
	        			var newWidth = 320;
	        			var ratio =   320 / image.width;
	        			var newHeight = image.height * ratio;
	        		}else{
	        			var newHeight = 320;
	        			var ratio =   320 / image.height;
	        			var newWidth = image.width * ratio;
	        		}
	        		
					image = image.imageAsResized(newWidth, newHeight);
	            	preview.image = image;
		            blobContainer = image; 
		            	
	            	removeBtn.visible = true; 
	            	if(saveBtn != ""){
			            saveBtn.visible = true;
			        }
	            },
	            cancel:function() {
	               
	            },
	            
	            mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
	        });
	    } else {
	        
	    }
	});
	 
	//show dialog
	dialog.show();
}

function viewResourcesList(e){
	DRAWER.navigation("resourceLists",1 ,{type: e.source.source});
}

function viewDetails(e){
	DRAWER.navigation("resourceDetails",1 ,{p_id: e.source.source});
}
 

exports.loadPhoto = function(preview,removeBtn,saveBtn){
	loadPhoto(preview,removeBtn,saveBtn);	
};

exports.displayCategory = function(){
	displayCategory();	
};

exports.getImageData = function(){
	return blobContainer;	
};

exports.refreshTableList = function(){ 
	mainView.resTable.data = []; 
	displayResources(details);	  
};

 

