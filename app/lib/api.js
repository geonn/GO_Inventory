/*********************
*** SETTING / API ***
**********************/
var API_DOMAIN = "goinventory.freejini.com.my";
var XHR = require("xhr");
var xhr = new XHR();

// APP authenticate user and key
var USER  = 'goInventory';
var KEY   = '06b53047cf294f7207789ff5293ad2dc'; 
var loginUrl            = "http://"+API_DOMAIN+"/api/loginUser?user="+USER+"&key="+KEY;
var logoutUrl			= "http://"+API_DOMAIN+"/api/logoutUser?user="+USER+"&key="+KEY+"&skipSession=1";
var changePwdUrl        = "http://"+API_DOMAIN+"/api/changePassword?user="+USER+"&key="+KEY;
var updateProfileUrl    = "http://"+API_DOMAIN+"/api/updateUserProfile?user="+USER+"&key="+KEY;
var announcementUrl     = "http://"+API_DOMAIN+"/api/getAnnoucement?user="+USER+"&key="+KEY;
var categoryUrl         = "http://"+API_DOMAIN+"/api/getCategory?user="+USER+"&key="+KEY;
var updateCombinationUrl= "http://"+API_DOMAIN+"/api/updateCombination?user="+USER+"&key="+KEY;
var syncScanByUserUrl   = "http://"+API_DOMAIN+"/api/syncDataFromServer?user="+USER+"&key="+KEY;
var inventoryProductsUrl= "http://"+API_DOMAIN+"/api/getInventoryProducts?user="+USER+"&key="+KEY;
var inventoryResourcesUrl= "http://"+API_DOMAIN+"/api/getInventoryResources?user="+USER+"&key="+KEY;
var iCardResourcesUrl   = "http://"+API_DOMAIN+"/api/getiCard?user="+USER+"&key="+KEY+"&cardType=1";
var iCardProductsUrl    = "http://"+API_DOMAIN+"/api/getiCard?user="+USER+"&key="+KEY+"&cardType=2";
var addProductUrl       = "http://"+API_DOMAIN+"/api/addProduct?user="+USER+"&key="+KEY;
var addResourceUrl		= "http://"+API_DOMAIN+"/api/addResource?user="+USER+"&key="+KEY;
var updateDoneProductUrl= "http://"+API_DOMAIN+"/api/assignDone?user="+USER+"&key="+KEY;
var stockOutUrl         = "http://"+API_DOMAIN+"/api/getStockOutList?user="+USER+"&key="+KEY;
var uploadImageUrl 		= "http://"+API_DOMAIN+"/api/uploadMedia?user="+USER+"&key="+KEY;
/*********************
**** API FUNCTION*****
**********************/
exports.uploadImage = function(ex){
	 
	var url = uploadImageUrl+"&type="+ex.type+"&u_id="+Ti.App.Properties.getString("user_id")+"&item_id="+ ex.item_id+"&session="+Ti.App.Properties.getString("session");
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) { 
	        API.getInventoryResources(); 
	        API.getInventoryProducts(); 
	        COMMON.hideLoading(); 
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	console.log(e); 
	     },
	     timeout : 10000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
	 client.open("POST", url); 
	 client.send({Filedata: ex.image}); 
};

//login to app
exports.login = function (ex){ 
	var url = loginUrl+"&username="+ex.username+"&password="+ex.password; 
 console.log(url);
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	     	var res = JSON.parse(this.responseText); 
	        if(res.status == "success"){
	        	var entry = res.user;
	        	if( entry.roles != "admin"){
	        		if(entry.last_login == "0000-00-00 00:00:00"){
	        			/***User Info***/
					    var mod_user = Alloy.createModel('user', { 
					    	id: entry.u_id, 
							fullname: entry.fullname, 
							username: entry.username,
							password: ex.password,
							mobile: entry.mobile,
							email : entry.email,
							lastlogin :  currentDateTime()
						});
						mod_user.save();
					 
						Ti.App.Properties.setString("session",res.data );
						var myses = Ti.App.Properties.getString("session"); 
						Ti.App.Properties.setString("user_id",entry.u_id );
			        	DRAWER.navigation("home",1);
	        		}else{
	        			COMMON.createAlert('Authentication warning',"This account has been used by another devices. Please logout from the device that used this account and try login again.");
	        			Ti.App.fireEvent('hideLoading');
	        		}
	        		
	        	}else{
	        		COMMON.createAlert('Authentication warning',"Your user account doesn't have permission to access this app.");
	        		Ti.App.fireEvent('hideLoading');
	        	}	  
	        }else{
	        	COMMON.createAlert('Authentication warning',res.data);
	        	Ti.App.fireEvent('hideLoading');
	        }
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	alert("Unable to login");
	     	
	     },
	     timeout : 10000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send(); 
};

exports.logoutUser = function(ex){
	var url = logoutUrl+"&session="+Ti.App.Properties.getString("session");
 
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	     	var res = JSON.parse(this.responseText); 
	        if(res.status == "success"){ 
	        	Ti.App.Properties.setString("user_id","" );
				Ti.App.Properties.setString('module',"");
				Ti.App.Properties.setString('session',"");
				var mod_product = Alloy.createCollection('products'); 
				mod_product.resetScanHistory(); 
				DRAWER.navigation("login",2);
	        }else{
	        	COMMON.createAlert('Authentication warning',res.data);
	        	Ti.App.fireEvent('hideLoading');
	        }
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	alert("Unable to login");
	     	
	     },
	     timeout : 10000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send(); 
};

//Add product
exports.addProduct = function(ex){
	var url = addProductUrl + "&name="+ex.name + "&code="+ex.code + "&set="+ex.set + "&category="+ex.category + "&depth="+ex.depth
			  + "&width="+ex.width + "&height="+ex.height + "&surface_habitable="+ex.surface_habitable + "&weight="+ex.weight 
			  + "&fabric_used="+ex.fabric_used + "&quantity="+ex.quantity + "&photoLoad="+ex.photoLoad+ "&type=TPI"+
			  "&u_id="+Ti.App.Properties.getString("user_id") +"&session="+Ti.App.Properties.getString("session");
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	      
	       var res = JSON.parse(this.responseText); 
	      
	        if(res.status == "success"){ 
	        	 API.getInventoryProducts(); 
	        	 DRAWER.navigation("productLists",1 ,{category: ex.curCate});
	        }else{
				COMMON.createAlert('Fail Add Product',res.data);
			}
			COMMON.hideLoading();
	     
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	//alert("An error occurs");
	     },
	     timeout : 10000  // in milliseconds
	 });
	 
	 client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	 client.open("POST", url);  
	 if(ex.photoLoad == "1"){
	 	client.send({Filedata: ex.photo}); 
	 }else{
	 	client.send(); 
	 }
	 
};

//Add Resource
exports.addResource = function(ex){
	 
	var url = addResourceUrl + "&name="+ex.name + "&code="+ex.code + "&cate="+ex.category + "&depth="+ex.depth
			  + "&width="+ex.width + "&height="+ex.height + "&supplier="+ex.supplier + "&weight="+ex.weight + 
			  "&photoLoad="+ex.photoLoad + "&type="+ex.type + "&u_id="+Ti.App.Properties.getString("user_id") 
			  +"&session="+Ti.App.Properties.getString("session");
 
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	     	var res = JSON.parse(this.responseText);  
	        if(res.status == "success"){
	        	 API.getInventoryResources(); 
	        	 DRAWER.navigation("resourceLists",1 ,{type: ex.curCate});
	        }else{
				COMMON.createAlert('Fail Add Resource',res.data);
			}
			COMMON.hideLoading();
	     
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	//alert("An error occurs");
	     },
	     timeout : 10000  // in milliseconds
	 });
 
	 client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	 client.open("POST", url); 
	 if(ex.photoLoad == "1"){ 
	 	client.send({Filedata: ex.photo}); 
	 }else{
	 	client.send(); 
	 }
};

//update done product
exports.updateDoneProduct = function(ex){
	var url = updateDoneProductUrl+ "&iCard="+ex.iCard+"&session="+Ti.App.Properties.getString("session");
	var client = Ti.Network.createHTTPClient({ 
	     onload : function(e) {
	       var res = JSON.parse(this.responseText); 
	       
	        if(res.status == "success"){
	        	//update to local Db
	        	var mod_products = Alloy.createCollection('products'); 
				mod_products.updateDoneProduct({id: res.data});
				COMMON.createAlert("Success","Product has marked as completed!");
	        }
	     
	     }, 
	     onerror : function(e) {
	     	//alert("An error occurs");
	     },
	     timeout : 10000  
	 }); 
	 client.open("GET", url); 
	 client.send(); 
};

//check Announcement
exports.getAnnouncement = function (ex){
	var url = announcementUrl+"&session="+Ti.App.Properties.getString("session");
	  
	var client = Ti.Network.createHTTPClient({ 
	     onload : function(e) {
	       var res = JSON.parse(this.responseText); 
	       
	        if(res.status == "success"){
	        	var checker = Alloy.createCollection('updateChecker'); 
				var isUpdate = checker.getCheckerById("1"); 
			 	 if(isUpdate	 !== "" || (res.last_updated != isUpdate.updated)){ 
			 		checker.updateModule("1","announcement",res.last_updated);
			 		/**reset current category**/
			       	var library = Alloy.createCollection('announcement'); 
					library.resetAnnouncement();
					
					/**load new set of category from API**/
			       	var arr = res.data;
			      
					library.addAnnouncement(arr);
			 	 }else{
			 		// alert("?");
			 	 }
	        }
	     
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	//alert("An error occurs");
	     },
	     timeout : 10000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send(); 
};

exports.getResourcesiCardList = function(){
	var url = iCardResourcesUrl +"&session="+Ti.App.Properties.getString("session");
	  
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	       var res = JSON.parse(this.responseText); 
	       
	        if(res.status == "success"){	
	        	var listData = res.data;
	        	var mod_resources = Alloy.createCollection('resources'); 
	        	
	        	listData.forEach(function(code) { 
				 	mod_resources.addUpdateResourcesById({
							id : code['id'], 
							prefix : code['r_prefix'],
							item_id : code['item_id'],
							name : code['name'],
							code : code['code'],
							resource: code['resource'],
							status : 1,
							created : currentDateTime(),
							updated : currentDateTime()
					});
				});
	        }
	     
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	//alert("An error occurs");
	     },
	     timeout : 10000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send(); 	
};


exports.getProductiCardList = function(){
	var url = iCardProductsUrl +"&session="+Ti.App.Properties.getString("session");
	  
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	       var res = JSON.parse(this.responseText); 
	       
	        if(res.status == "success"){	
	        	var listData = res.data;
	        	var mod_products = Alloy.createCollection('products'); 
	        	
	        	listData.forEach(function(code) { 
				 	mod_products.updateProductById({
							id : code['id'], 
							prefix : code['prefix'],
							item_id : code['item_id'],
							product : code['product'],
							code : code['code'], 
							created : currentDateTime(),
							updated : currentDateTime()
					});
				});
	        }
	     
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	//alert("An error occurs");
	     },
	     timeout : 10000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send(); 	
};
//check Category
exports.getCategory = function (ex){
	var url = categoryUrl +"&session="+Ti.App.Properties.getString("session");
	  
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	       var res = JSON.parse(this.responseText); 
	       
	        if(res.status == "success"){	 
			 	/**reset current category**/
			    var library = Alloy.createCollection('category'); 
				library.resetCategory();
					
				/**load new set of category from API**/
			    var categoriestypes = res.data; 
			    for (var key in categoriestypes) {
			    	
			    	var arrList = categoriestypes[key]; 
			    	//for(var i=1; i <= arrList.length; i++) {
			     	for (var sub in arrList) { 
				    	var category_type = Alloy.createModel('category', { 
							cateType: key, 
							cateKey: sub,
							cateValue: arrList[sub]
						}); 
						category_type.save();  
			    	}  
			    }
	        }
	     
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	//alert("An error occurs");
	     },
	     timeout : 10000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send(); 
};

exports.updateSettings = function(){
	var settings = Alloy.createCollection('settings'); 
	var is1Update = settings.getSettingById("1");
	if(is1Update == ""){
		settings.updateSettings("1","sync","true");
	}
	
	var is2Update = settings.getSettingById("2");
	if(is2Update == ""){
		settings.updateSettings("2","push","true");
	}
};

//submit resources with iCard
exports.updatedCombination = function(ex){
	var res_data = ex.data; 
	var count = 0; 
	res_data.forEach(function(reso) { 
		var url = updateCombinationUrl + "&iCard="+ex.iCard +"&prefix="+reso.prefix+"&resource="+reso.id+"&updated="+reso.updated+"&session="+Ti.App.Properties.getString("session");
  		
		var client = Ti.Network.createHTTPClient({
		     onload : function(e) {
		       var res = JSON.parse(this.responseText);  
		        if(res.status == "success"){
					var mod_products = Alloy.createCollection('products'); 
					var mod_resources = Alloy.createCollection('resources'); 
		        	mod_resources.updatedSync({
		        		prefix : reso.prefix,
		        		item_id : reso.item_id
		        	});
		        	count++; 
		        	if(res_data.length == count){ 
		        		Ti.App.fireEvent("refreshTableList");
		        	}
		        }
		     },
		     // function called when an error occurs, including a timeout
		     onerror : function(e) {
		     	//alert("An error occurs");
		     },
		     timeout : 10000  // in milliseconds
		 });
		 // Prepare the connection.
		 client.open("GET", url);
		 // Send the request.
		 client.send();
	});
  	
	
};

exports.updateUserProfile = function(ex){
	var url = updateProfileUrl +"&u_id="+Ti.App.Properties.getString("user_id")+"&field="+ex.field+"&value="+ex.value+"&session="+Ti.App.Properties.getString("session");
 
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	         var res = JSON.parse(this.responseText);
	         
	         if(res.status == "success"){
	         	
				var mod_users = Alloy.createCollection('user'); 
				var details = mod_users.changeProfile({
					id: Ti.App.Properties.getString("user_id"),
					field :  ex.field,
					value :  ex.value
				}); 
	         	 
	         	COMMON.hideLoading();
	         }else{
	         	COMMON.createAlert('Update failed',res.data.error_msg);
	         }
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	COMMON.hideLoading();
	     	isSubmit = 0;
	        COMMON.createAlert('Network declined','Failed to contact with server. Please make sure your device are connected to internet.');
	     },
	     timeout : 10000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send(); 
};

exports.changePassword= function(ex){
	
	var url = changePwdUrl +"&u_id="+Ti.App.Properties.getString("user_id")+"&current_password="+ex.current_password+"&password="+ex.password+"&session="+Ti.App.Properties.getString("session");
 
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	         var res = JSON.parse(this.responseText);
	         
	         if(res.status == "success"){
	         	
				var mod_users = Alloy.createCollection('user'); 
				var details = mod_users.changePassword({
					id: Ti.App.Properties.getString("user_id"),
					password :  ex.password
				}); 
	         	COMMON.createAlert('Change Password','Password updated successfully.');
	         	COMMON.hideLoading();
	         }else{
	         	COMMON.createAlert('Update failed',res.data.error_msg);
	         }
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	COMMON.hideLoading();
	     	isSubmit = 0;
	        COMMON.createAlert('Network declined','Failed to contact with server. Please make sure your device are connected to internet.');
	     },
	     timeout : 10000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send(); 
};

exports.getInventoryResources = function(ex){
	var checker = Alloy.createCollection('updateChecker'); 
	var isUpdate = checker.getCheckerById("3");
	var last_updated ="";
	 
	if(isUpdate != "" ){
		last_updated = isUpdate.updated;
	} 
	var url =inventoryResourcesUrl+"&last_updated="+last_updated+"&session="+Ti.App.Properties.getString("session");
 	 console.log(url);
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	     	var res = JSON.parse(this.responseText);
	    
	        if(res.status == "success"){ 
				var mod_InventoryRes = Alloy.createCollection('resource_inventory'); 
				var resource  = res.data;
	         	resource.forEach(function(resDetail){
	     
	         		mod_InventoryRes.addUpdateResource({
		       			id: resDetail.id, 
						name: resDetail.name,
						type: resDetail.type,
						code: resDetail.code,
						supplier: resDetail.supplier,
						image: resDetail.image,
						depth: resDetail.depth,
						width: resDetail.width,
						height: resDetail.height,
						weight: resDetail.weight,
						status: resDetail.status,
						quantity: resDetail.quantity,
						created: resDetail.created,
						updated: resDetail.updated
	         			 
	        		});	
	         		
	         	});
	       		checker.updateModule("3","inventoryResources",currentDateTime()); 
	       		COMMON.hideLoading();
	        }else{
	        	Ti.App.Properties.setString("user_id","" );
				Ti.App.Properties.setString('module',"");
				Ti.App.Properties.setString('session',"");
				var mod_product = Alloy.createCollection('products'); 
				mod_product.resetScanHistory(); 
	        	DRAWER.navigation("login",1);
	        }
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	//alert("An error occurs");
	     },
	     timeout : 10000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send(); 
};

exports.getInventoryProducts = function(ex){
	var checker = Alloy.createCollection('updateChecker'); 
	var isUpdate = checker.getCheckerById("2");
	var last_updated ="";
 
	if(isUpdate != "" ){
		last_updated = isUpdate.updated;
	}
	 
	var url =inventoryProductsUrl+"&last_updated="+last_updated+"&session="+Ti.App.Properties.getString("session");
	  console.log(url);
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	     	var res = JSON.parse(this.responseText);
	       
	        if(res.status == "success"){ 
				var mod_InventoryProd = Alloy.createCollection('product_inventory'); 
				var product  = res.data;
	         	product.forEach(function(prodDetail){
	         	
	         		mod_InventoryProd.addUpdateProduct({
		       			id: prodDetail.id, 
						name: prodDetail.name,
						prodSet: prodDetail.set,
						code: prodDetail.code,
						category: prodDetail.category,
						image: prodDetail.image,
						depth: prodDetail.depth,
						width: prodDetail.width,
						height: prodDetail.height,
						weight: prodDetail.weight,
						surface_habitable: prodDetail.surface_habitable,
						fabric_used: prodDetail.fabric_used,
						quantity: prodDetail.quantity,
						status: prodDetail.status,
						created: prodDetail.created,
						updated: prodDetail.updated
	         			 
	        		});	
	         		
	         	});
	       		checker.updateModule("2","inventoryProduct",currentDateTime()); 
	        }
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	//alert("An error occurs");
	     },
	     timeout : 10000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send(); 
};

exports.getStockOutList = function(ex){
	var checker = Alloy.createCollection('updateChecker'); 
	var isUpdate = checker.getCheckerById("4");
	var last_updated ="";
 
	if(isUpdate != "" ){
		last_updated = isUpdate.updated;
	}
	 
	var url =stockOutUrl+"&last_updated="+last_updated+"&session="+Ti.App.Properties.getString("session");
	 
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	     	var res = JSON.parse(this.responseText);
	       
	        if(res.status == "success"){ 
				var mod_stockout = Alloy.createCollection('stockout'); 
				var mod_product = Alloy.createCollection('products'); 
				var stockOut  = res.data;
	         	stockOut.forEach(function(entry){ 
	         		mod_stockout.addUpdateStockOut({
		       			id: entry.id, 
						sales_order: entry.sales_order,
						delivery_order: entry.delivery_order,
						customer_name: entry.customer_name,
						company_name: entry.company_name,
						remark: entry.remark, 
						created: entry.created,
						updated: entry.updated
	         			 
	        		});	
	         	 	
	         	 	var productInfo  = entry.product; 
	         		productInfo.forEach(function(prodDetail){ 
		         		mod_product.addUpdateProduct({
						    id: prodDetail.id,
		         			prefix : prodDetail.prefix,
						    item_id : prodDetail.itemId,
						    product : prodDetail.product,
						    code : prodDetail.code, 
						    order : prodDetail.order,
						    done : prodDetail.done,
						    created : prodDetail.updated,
						    updated : prodDetail.updated,
		         		});
	         		});
	         	});
	       		checker.updateModule("4","stockOut",currentDateTime()); 
	        }
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	//alert("An error occurs");
	     },
	     timeout : 10000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send(); 
};

exports.syncScanByUser= function(ex){
	var url = syncScanByUserUrl + "&u_id="+Ti.App.Properties.getString("user_id")+"&session="+Ti.App.Properties.getString("session");
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	     	var res = JSON.parse(this.responseText);
	         
	     	if(res.status == "success"){
	       		//console.log(res.data);
	         	var mod_product = Alloy.createCollection('products'); 
	         	var mod_resources = Alloy.createCollection('resources'); 
	         
	         	var product  = res.data;
	         	product.forEach(function(prodDetail){
	         		 
	         		mod_product.addUpdateProduct({
					    id: prodDetail.id,
	         			prefix : prodDetail.prefix,
					    item_id : prodDetail.item_id,
					    product : prodDetail.product,
					    code : prodDetail.code,
					    order : prodDetail.order,
					    myScan : "1",
					    created : prodDetail.updated,
					    updated : prodDetail.updated,
	         		});
	         		
	         		var prod_resource = prodDetail.resource;
	         		prod_resource.forEach(function(resoDetail){
	         			mod_resources.addUpdateResources({
	         				id   	: resoDetail.id,
	         				iCard   : prodDetail.code,
		         			prefix  : resoDetail.r_prefix, 
		         			item_id : resoDetail.code,
						    name    : resoDetail.name,
						    code    : resoDetail.item_id, 
						    status  : 3,
						    created : resoDetail.scandate,
						    updated : resoDetail.scandate,
		         		});
	         		});
	         	});
	       }
	      
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	//alert("An error occurs");
	     },
	     timeout : 10000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send(); 
};
 
exports.getDomain = function(){
	return "http://"+API_DOMAIN+"/";	
};

//private function
function onErrorCallback(e) { 
	// Handle your errors in here
	COMMON.createAlert("Error", e);
};