var mainView = null;
var mod_InventoryProd = Alloy.createCollection('product_inventory');  
var mod_product = Alloy.createCollection('products'); 
exports.construct = function(mv){
	mainView = mv;
};

function viewDetails(e, orderNo){
	DRAWER.navigation("stockoutDetails",1 ,{order: e.source.source, orderNo: orderNo});
}

function displayList(list){
	var data=[]; 
	 //hide loading bar
	COMMON.hideLoading();
   	var counter = 0;
   	if(list.length < 1){
		var noRecord = Ti.UI.createLabel({ 
			text: "No record found", 
			color: '#375540', 
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		 	font:{fontSize:14,fontStyle:'italic'},
			top: 15,
			width: "100%"
		});
		mainView.orderView.add(noRecord);
	}else{
		var counter =1;
		 	
		list.forEach(function(entry) {
			 
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
				source: entry.id, 
				left: 5,
		    	top: 5, 
		    	right: 5,
		    	bottom: 5,
		    	height: 80,
		    	width: Ti.UI.FILL,
		    	layout: "horizontal",
			});
			
			var horiViewHeight = "40";
			if(Ti.Platform.osname == "android"){ 
				horiViewHeight = "60";	
			} 
			var horiView = Ti.UI.createView({
				source: entry.id, 
				layout: "horizontal",
				height:horiViewHeight,
				width:"auto" 
			}); 
			
			var tblViewLeft = Ti.UI.createView({
				source: entry.id, 
				layout: "vertical",
				left: 10,
				height:"80",
				width:"69%",
			}); 
			
			var tblViewRight = Ti.UI.createView({
				source: entry.id, 
				layout: "vertical",
				height:"40",
				top: 0,
				width:"20%",
			}); 
			
			var tblViewBottom = Ti.UI.createView({
				source: entry.id, 
				layout: "vertical",
				left: 10,
				height:"40",
				width:"100%",
			}); 
			
			var orderLabel =  Titanium.UI.createLabel({
				text:"ORDER #",
				source: entry.id,
				font:{fontSize:11},
				color: "#848484",
				textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
			});
			  
			var popUpTitle = Titanium.UI.createLabel({
				text:entry.sales_order,
				font:{fontSize:14, fontWeight:'bold'},
				source: entry.id,
				color: "#848484",
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
				textAlign:Titanium.UI.TEXT_ALIGNMENT_LEFT,
				wordwrap: false,
				ellipsize : true
			});
			
			var customer =  Titanium.UI.createLabel({
				text:entry.customer_name,
				source: entry.id,
				font:{fontSize:13},
				color: "#848484",
				textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
			});
			
			var company =  Titanium.UI.createLabel({
				text:entry.company_name,
				source: entry.id,
				font:{fontSize:11},
				color: "#848484",
				textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
			}); 
			
			var lastUpdatedHoriView = Ti.UI.createView({
				layout: "horizontal",
				height:20,
				source: entry.id, 
				width:"100%" 
			}); 
			
			var lastUpdatedLabel =  Titanium.UI.createLabel({
				text:"Last Updated",
				source: entry.id,
				font:{fontSize:11},
				color: "#848484",
				textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
				width: "30%",
				height: Ti.UI.SIZE 
			});
			
			var lastUpdated =  Titanium.UI.createLabel({
				text: " : " +timeFormat(entry.updated),
				source: entry.id,
				font:{fontSize:11},
				color: "#848484",
				textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE 
			});  
			var deliveryOrderHoriView = Ti.UI.createView({
				layout: "horizontal",
				source: entry.id, 
				height:20,
				width:"100%",
			}); 
			var deliveryOrderLabel =  Titanium.UI.createLabel({
				text:"Delivery Order #",
				source: entry.id,
				font:{fontSize:11},
				color: "#848484",
				textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
				width: "30%",
				height: Ti.UI.SIZE,
			});
			
			if(entry.delivery_order == ""){
				entry.delivery_order = "N/A";
			}
			var deliveryOrder =  Titanium.UI.createLabel({
				text:" : " +entry.delivery_order,
				source: entry.id,
				font:{fontSize:11},
				color: "#848484",
				textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.SIZE,
				height: Ti.UI.SIZE,
			}); 
			
			row.addEventListener('click', function(e) {
			 	viewDetails(e, entry.sales_order);
			});
		 	
		 	tblViewLeft.add(customer);
		 	tblViewLeft.add(company); 
		 	tblViewRight.add(orderLabel);
			tblViewRight.add(popUpTitle);
			horiView.add(tblViewLeft); 
			horiView.add(tblViewRight); 
			lastUpdatedHoriView.add(lastUpdatedLabel);
			lastUpdatedHoriView.add(lastUpdated);
			deliveryOrderHoriView.add(deliveryOrderLabel);
			deliveryOrderHoriView.add(deliveryOrder); 
		 	tblViewBottom.add(lastUpdatedHoriView); 
		 	tblViewBottom.add(deliveryOrderHoriView);
		 	
		 	row_view.add(horiView);
		 	row_view.add(tblViewBottom);
		 	row.add(row_view);
		 	data.push(row);
		 	counter++; 
		});
	 	
	 	if(Ti.Platform.osname == "android"){ 
			mainView.orderTable.height =   PixelsToDPUnits(Ti.Platform.displayCaps.platformHeight)  -100;  
		}
		//mainView.prodTable.height = rowHeight + 150;
		//mainView.productView.height = rowHeight + 150;
		mainView.orderTable.setData(data); 
		mainView.orderView.add(mainView.orderTable);
	}
}

function displayDetails(order_id){
	var list = mod_product.getProductByOrder(order_id); 
	var data=[]; 
	var compile = [];
	 //hide loading bar
	COMMON.hideLoading();
   	var counter = 0;
   	if(list.length < 1){
		var noRecord = Ti.UI.createLabel({ 
			text: "No record found", 
			color: '#375540', 
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		 	font:{fontSize:14,fontStyle:'italic'},
			top: 15,
			width: "100%"
		});
		mainView.orderView.add(noRecord);
	}else{
		var mainContentView = Titanium.UI.createView({
			layout : "vertical",  
			backgroundColor: "#ffffff",
			top:0,
			height:Ti.UI.SIZE
		});
		var counter =1;
		var obj = {}; 	
		var tableData = [];
		list.forEach(function(entry) { 
			var product_id = entry.product;  
			 if(typeof obj[product_id] === 'undefined'){
			   obj[product_id]= []; 
			 }
			obj[product_id].push(entry.code);
		});
		
		for (var k in obj){
			var productInfo = mod_InventoryProd.getProductDetails(k);
			console.log(productInfo);
			var row = Titanium.UI.createTableViewRow({
			    touchEnabled: false,  
			    backgroundColor: "#ffffff",
			    backgroundSelectedColor: "#ffffff",
		    });
			 
			var horiView = Ti.UI.createView({ 
				layout: "horizontal",
				top : 2,
				height:"50",
				width:"100%" 
			}); 
			
			var imageContainer = Ti.UI.createView({
				height:"100%",
				top: 0,
				width:"20%" ,
				left: 0 
			});
			var prodImage = Titanium.UI.createImageView({
				image: productInfo.image, 
				top:0,
				left:0,
				width:"100%"
			});
			
			var titleLabelView = Titanium.UI.createView({
				backgroundColor: "#375540", 
				top:0,
				width: "55%",
				height:"100%"
			});
			 
			 var titleLabel = mainView.UI.create('Label',{
			 	classes: ['white_text'],
				text:  productInfo.name,  
			});	
			
			var qtyLabelView = Titanium.UI.createView({ 
				top:0,
				width: "25%",
				height:"100%"
			});
			 
			var qtyLabel = mainView.UI.create('Label',{
			 	classes: ['gray_text'],
			 	font: { fontSize:26 },
				text:  obj[k].length,  
			});	
			qtyLabelView.add(qtyLabel);
			titleLabelView.add(titleLabel);
			imageContainer.add(prodImage);
			horiView.add(imageContainer); 
			horiView.add(titleLabelView);
			horiView.add(qtyLabelView);
			row.add(horiView);
			tableData.push(row);  
			for(var i=0; i < obj[k].length; i++){
				var row2 = Titanium.UI.createTableViewRow({
				    touchEnabled: false,  
				    height:30,
				    backgroundColor: "#ffffff",
				    backgroundSelectedColor: "#ECFFF9",
			    });
				var icardView = Ti.UI.createView({
					layout: "vertical",
					height:30,
					width:"100%" 
				}); 
				
				var icardLabel =  Titanium.UI.createLabel({
					text: obj[k][i], 
					font:{fontSize:13},
					color: "#848484",
					textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
					width: "80%",
					top:5,
					left: 10,
					height: Ti.UI.SIZE 
				});
				icardView.add(icardLabel);
				row2.add(icardView);
				tableData.push(row2);
			}
			
		}  
		mainView.orderDetailsTable.setData(tableData);
		mainView.orderDetailsView.add(mainView.orderDetailsTable);
	}
}

exports.displayList = function(list){
	displayList(list);
};

exports.displayDetails = function(list){
	displayDetails(list);
};
 