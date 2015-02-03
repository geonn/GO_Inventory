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
var changePwdUrl        = "http://"+API_DOMAIN+"/api/changePassword?user="+USER+"&key="+KEY;
var announcementUrl     = "http://"+API_DOMAIN+"/api/getAnnoucement?user="+USER+"&key="+KEY;
var updateCombinationUrl= "http://"+API_DOMAIN+"/api/updateCombination?user="+USER+"&key="+KEY;
var syncScanByUserUrl   = "http://"+API_DOMAIN+"/api/syncDataFromServer?user="+USER+"&key="+KEY;
var inventoryProductsUrl= "http://"+API_DOMAIN+"/api/getInventoryProducts?user="+USER+"&key="+KEY;

/*********************
**** API FUNCTION*****
**********************/
//login to app
exports.login = function (ex){ 
	var url = loginUrl+"&username="+ex.username+"&password="+ex.password; 
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	     	var res = JSON.parse(this.responseText); 
	        if(res.status == "success"){
	        	 
	        	var entry = res.user;
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
				Ti.App.Properties.setString("user_id",entry.u_id );
	        	DRAWER.navigation("home",1);
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

//check Announcement
exports.getAnnouncement = function (ex){
	var url = announcementUrl ;
	  console.log(announcementUrl);
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	       var res = JSON.parse(this.responseText); 
	       
	        if(res.status == "success"){
	        	var checker = Alloy.createCollection('updateChecker'); 
				var isUpdate = checker.getCheckerById("1");
				console.log("isUpdate "+isUpdate);
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
	     	alert("An error occurs");
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
		var url = updateCombinationUrl + "&iCard="+ex.iCard +"&prefix="+reso.prefix+"&resource="+reso.item_id+"&updated="+reso.updated+"&u_id="+Ti.App.Properties.getString("user_id") ;
  		console.log(url);
		var client = Ti.Network.createHTTPClient({
		     // function called when the response data is available
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
		     	alert("An error occurs");
		     },
		     timeout : 10000  // in milliseconds
		 });
		 // Prepare the connection.
		 client.open("GET", url);
		 // Send the request.
		 client.send();
	});
  	
	
};

exports.changePassword= function(ex){
	
	var url = changePwdUrl +"&u_id="+Ti.App.Properties.getString("user_id")+"&current_password="+ex.current_password+"&password="+ex.password;
 
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
	         	Ti.App.fireEvent('hideLoading');
	         }else{
	         	COMMON.createAlert('Update failed',res.data.error_msg);
	         }
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	$.activityIndicator.hide();
	     	$.loadingBar.opacity = "0";
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

exports.getInventoryProducts = function(ex){
	var checker = Alloy.createCollection('updateChecker'); 
	var isUpdate = checker.getCheckerById("2");
	checker.updateModule("2","inventoryProduct",currentDateTime()); 
	 
	var url =inventoryProductsUrl+"&last_updated="+currentDateTime();
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
						qty: prodDetail.quantity,
						created: prodDetail.created,
						updated: prodDetail.updated
	         			 
	        		});	
	         		
	         	});
	       		
	        }
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	alert("An error occurs");
	     },
	     timeout : 10000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send(); 
};

exports.syncScanByUser= function(ex){
	var url = syncScanByUserUrl + "&u_id="+Ti.App.Properties.getString("user_id");  
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
					    created : prodDetail.updated,
					    updated : prodDetail.updated,
	         		});
	         		
	         		var prod_resource = prodDetail.resource;
	         		prod_resource.forEach(function(resoDetail){
	         			mod_resources.addUpdateResources({
	         				iCard   : prodDetail.code,
		         			prefix  : resoDetail.r_prefix, 
		         			item_id : resoDetail.code,
						    name    : resoDetail.name,
						    code    : resoDetail.item_id, 
						    status  : 3,
						    created : resoDetail.stock_out_date,
						    updated : resoDetail.stock_out_date,
		         		});
	         		});
	         	});
	         
	       }
	      
	      
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	     	alert("An error occurs");
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
	var common = require('common');
	// Handle your errors in here
	common.createAlert("Error", e);
};