var mainView = null;

var blobContainer = []; 
function displayCategory(){
	var data=[]; 
	var mod_InventoryProd = Alloy.createCollection('product_inventory');  
	var category = mod_InventoryProd.getProductCategory();  
	mainView.prodTable.data = []; 
	if(category.length < 1){ 
		mainView.prodTable.setData(COMMON.noRecord());
	}else{
		var counter =1;
		
		category.forEach(function(entry) {
			 
			var row = Titanium.UI.createTableViewRow({
		    touchEnabled: true,
		    source: entry.category,  
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
		    	source: entry.category,  
		    	layout: "horizontal",
			});
			
			var tblView = Ti.UI.createView({
				layout: "vertical",
				source: entry.category,  
				height:"30",
				width: "90%",
			}); 
			 
			var popUpTitle = Titanium.UI.createLabel({
				text:entry.category + " ("+entry.total+")",
				font:{fontSize:14, fontWeight:'bold'},
				source: entry.category,
				color: "#848484",
				width: "90%",
				height: Ti.UI.SIZE,
				textAlign:Titanium.UI.TEXT_ALIGNMENT_LEFT,
				wordwrap: false,
				ellipsize : true
			});
			
			var rightImage =  Titanium.UI.createImageView({
				image:"/images/btn-forward",
				source: entry.category,
				width: 20,
				right: 10,
				height: 20,
			});	
			
			row.addEventListener('click', function(e) {
			 	viewProductList(e);
			});
		 	
			tblView.add(popUpTitle); 
		 	
		 	row_view.add(tblView);
		 	row_view.add(rightImage);
		 	row.add(row_view);
		 	data.push(row);
		  
		});
	 
		mainView.prodTable.setData(data); 
		//mainView.productView.add(mainView.prodTable);
	}
}

function displayProduct(products){
	if(products == "1"){
		var mod_InventoryProd = Alloy.createCollection('product_inventory');  
		var details = mod_InventoryProd.getProductList(0); 
		products = details;
	}
 	var data=[]; 
 	mainView.prodTable.data = [];
   	var counter = 0;
   	if(products.length < 1){ 
		mainView.prodTable.setData(COMMON.noRecord());
	}else{
		var counter =1;
		 	
		products.forEach(function(entry) {
			 
			var row = Titanium.UI.createTableViewRow({
		    touchEnabled: true,
		    source: entry.id, 
		    position: counter,
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
		    	source: entry.id,
		    	height: 80,
		    	width: Ti.UI.FILL,
		    	layout: "horizontal",
			});
			
			var tblView = Ti.UI.createView({
				layout: "vertical",
				height:"80",
				source: entry.id,
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
					width:"80%"
				});
			}
			imageContainer.add(leftImage); 
		
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
				text:entry.category,
				source: entry.id,
				font:{fontSize:11},
				color: "#848484",
				textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
			});
			
			var pCode =  Titanium.UI.createLabel({
				text:entry.code,
				source: entry.id,
				font:{fontSize:11},
				color: "#848484",
				textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
			}); 
			
			var quantity_view = Ti.UI.createView({
				layout: "horizontal",
				source: entry.id,
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
			 
			if(entry.quantity == "0"){
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
			
			quantity_text = null;
			quantity_text_view = null;
			quantity_text_input = null;
			
			row.addEventListener('click', function(e) {
			 	viewDetails(e);
			});
		 	
			tblView.add(popUpTitle);
			tblView.add(category);
		 	tblView.add(pCode);  
		 	tblView.add(quantity_view);
		 	
		 	row_view.add(imageContainer);
		 	row_view.add(tblView);
		 	row.add(row_view);
		 	data.push(row);
		 	counter++; 
		});
	 	
	 	if(Ti.Platform.osname == "android"){ 
			//mainView.prodTable.height =   PixelsToDPUnits(Ti.Platform.displayCaps.platformHeight)  -100;  
		} 
		mainView.prodTable.setData(data); 
		data = null; 
	} 
	//hide loading bar
	COMMON.hideLoading();
} 


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
	                  console.log(image);
	                if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
	                   //var nativePath = event.media.nativePath;
	                   
						
		            	if(Ti.Platform.osname == "android"){
			            	//mainView.previewImage.image = image.nativePath;
			            	preview.image = image;
			            	blobContainer = image;
			            }else{
			            	//iOS
			            	//mainView.previewImage.image = image;
			            	preview.image = image;
			            	blobContainer = image;
			            }
		            	removeBtn.visible = true; 
		            	if(saveBtn != ""){
				            saveBtn.visible = true;
				        }
			            console.log(blobContainer);
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
					
	            	if(Ti.Platform.osname == "android"){
		            	//mainView.previewImage.image = image.nativePath;
		            	preview.image = image;
		            	blobContainer = image; 
		            }else{
		            	//iOS
		            	//mainView.previewImage.image = image;
		            	preview.image = image;
		            	blobContainer = image;
		            }
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

function viewProductList(e){
	DRAWER.navigation("productLists",1 ,{category: e.source.source});
}

function viewDetails(e){
	DRAWER.navigation("productDetails",1 ,{p_id: e.source.source});
}
 
exports.construct = function(mv){
	mainView = mv;
};

exports.deconstruct = function(){ 
 	blobContainer = null;
	mainView = null;
};

exports.displayProduct = function(products){
	//removeAllChildren(mainView.prodTable);  
	displayProduct(products);
};

exports.displayCategory = function(){
	displayCategory();	
};

exports.refreshTableList = function(){ 
	displayProduct(products);	  
};
 
exports.loadPhoto = function(preview,removeBtn,saveBtn){
	loadPhoto(preview,removeBtn,saveBtn);	
};

exports.getImageData = function(){ 
	return blobContainer;	
};
