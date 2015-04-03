var args = arguments[0] || {}; 
var news_id = args.news_id || "";
var pop;
var mod_announcement = Alloy.createCollection('announcement'); 
Ti.App.Properties.setString('parent',"");
var listing = mod_announcement.getAnnouncementList();

COMMON.construct($);
COMMON.showLoading();
setTimeout(function(){ 
	displayAnnouncement(listing);
	if(news_id != ""){
		viewDetails("");
	}
}, 1000);

function displayAnnouncement(listing){
	var data=[]; 
		//hide loading bar 
 		COMMON.hideLoading();
   		var counter = 0;
   		
   		if(listing.length < 1){ 
			$.newsTable.setData(COMMON.noRecord());
		}else{

	   		listing.forEach(function(entry) {
	   			var row = Titanium.UI.createTableViewRow({
			    touchEnabled: true,
			    height: 80,
			    source: entry.id, 
			   // layout: "vertical",
			    selectedBackgroundColor: "#ECFFF9",
				backgroundGradient: {
			      type: 'linear',
			      colors: ['#FEFEFB','#F7F7F6'],
			      startPoint: {x:0,y:0},
			      endPoint:{x:0,y:80},
			      backFillStart:false},
			   });
				
				var tblView = Ti.UI.createView({
					layout: "vertical",
					height:"80",
					width:"100%" 
				}); 
				
				var title = entry.title;
				title = title.replace(/&quot;/g,"'");
				//title = title.slice(0,40);
				var message = entry.message;
				message = message.replace(/&quot;/g,"'");
				
				var popUpTitle = Titanium.UI.createLabel({
					text: title,
					font:{fontSize:16},
					source: entry.id,
					color: "#848484",
					width:'90%',
					textAlign:'left',
					top:5,
					left:20, 
					height:Ti.UI.SIZE
				});
				
				var category =  Titanium.UI.createLabel({
					text: message,
					source: entry.id,
					font:{fontSize:12,fontWeight:'bold'},
					width:'auto',
					color: "#848484",
					textAlign:'left',
					width:'90%',
					//bottom:23,
					left:20,
					height:15
				});
				
				var distance =  Titanium.UI.createLabel({
					text:timeFormat(entry.updated),
					source: entry.id,
					font:{fontSize:12,fontWeight:'bold'},
					width:'auto',
					color: "#848484",
					textAlign:'left', 
					left:20,
					height:Ti.UI.SIZE
				}); 
				
				row.addEventListener('click', function(e) {
				 	viewDetails(e);
				});
			  
				tblView.add(popUpTitle);
				tblView.add(category);
			 	tblView.add(distance);  
			 	row.add(tblView);
				data.push(row);
	   		});
	   		
	   		$.newsTable.setData(data);  
		} 
		// removeAllChildren($.aView);
		// var calendar = require('calendar');
		// $.aView.add(calendar.getCalendar());
};

function viewDetails(e){  
	if(news_id != ""){
		var res_news = mod_announcement.getAnnouncementById(news_id);
	}else{
		var res_news = mod_announcement.getAnnouncementById(e.rowData.source);
	}
	
	var title = res_news.title;
	title = title.replace(/&quot;/g,"'");
				
	var message = res_news.message;
	var msg_arr = message.split("[nl]");
	console.log(msg_arr);
	var containerView = Ti.UI.createView({
		layout: "composite",
		height:"100%",
		width:"100%",
		backgroundColor: "#EFEFEF"
	}); 

	var confirmView = Ti.UI.createView({
		layout: "vertical",
		height:"100%",
		width:"100%"
	});
	var titleView = Ti.UI.createView({
		layout: "composite",
		height:"15%",
		width:"100%",
		backgroundColor:"#375540"
	});
		
	var titleLabel = Ti.UI.createLabel({
		color: '#ffffff',
		font: { fontSize:16 },
		text:  title,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		width: Ti.UI.SIZE, 
		height: Ti.UI.SIZE
	});
	
	var contentView = Ti.UI.createScrollView({
		layout: "vertical",
		height:"74.5%",
		backgroundColor:"#EFEFEF", 
		width:"95%" 
	});
 	 
 	for(var i=0; i < msg_arr.length; i++){
 		var msg = msg_arr[i].trim();
 		if(msg != ""){ 
			msg = msg.replace(/&quot;/g,"'"); 
 			var resource_label = $.UI.create('Label', {
				//classes : ['gray_text'], 
				font: { fontSize:12 },
				text: msg,  
				width: "100%",   
				height: Ti.UI.SIZE,
				color: 'black',
				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
				top: 2,
				bottom: 1
			});
			contentView.add(resource_label);
 		} 
 	} 
  
	var centerImageView = Ti.UI.createView({
		layout: "composite",
		height:"10%",
		bottom:5, 
		width: "100%",
		backgroundColor:"#EFEFEF", 
	});
	
	okayBtn = Ti.UI.createImageView({
		image:'/images/Button_OK.png',  
		height: "90%",
		bottom: 5 
	});
	 
	
	titleView.add(titleLabel);  
	centerImageView.add(okayBtn);
	confirmView.add(titleView);
	confirmView.add(contentView);
	confirmView.add(centerImageView);
	containerView.add(confirmView);
	var config = [];
	config.width = "70%";
	config.height = "75%";
	pop = COMMON.popup(containerView,config);
	pop.open({fullscreen:true, navBarHidden: true}); 
	addDoneEvent(okayBtn,pop);  
}

function addDoneEvent(myView, popView){
	myView.addEventListener('click', function(e){
		pop.close();
	});
}

/***SEARCH PRODUCTS***/
$.searchItem.addEventListener('focus', function(e){
	$.searchItem.showCancel =  true; 
	$.announcementScrollView.opacity = 1;
	$.announcementScrollView.height = "auto";
});

$.searchItem.addEventListener('blur', function(e){
	$.searchItem.showCancel =  false;
});

$.searchItem.addEventListener('cancel', function(e){
	$.searchItem.blur();  
	var str = $.searchItem.getValue();
	if(str == ""){
		$.newsTable.data = [];
		displayAnnouncement(listing);	
	}
		
});

var searchResult = function(){
	COMMON.showLoading();
	$.searchItem.blur();
	var str = $.searchItem.getValue();
	 
	var searchResult = mod_announcement.searchAnnouncement(str); 
	$.newsTable.data = [];
	displayAnnouncement(searchResult);		
};
$.searchItem.addEventListener("return", searchResult);

$.newsView.addEventListener('touchend', function(e){
    $.searchItem.blur(); 
});