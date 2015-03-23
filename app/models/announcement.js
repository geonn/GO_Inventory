exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER",
		    "title": "TEXT",
		    "message": "TEXT",
		    "startdate": "TEXT",
		    "enddate": "TEXT", 
		    "created": "TEXT",
		    "updated": "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "announcement"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			getAnnouncementList: function(){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name +"  order by updated DESC";
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                db.file.setRemoteBackup(false);
                var res = db.execute(sql);
                var listArr = []; 
                var count = 0;
                while (res.isValidRow()){ 
					listArr[count] = { 
							id: res.fieldByName('id'),
						    title: res.fieldByName('title'),
						    message: res.fieldByName('message'),
						    startdate: res.fieldByName('startdate'),
						    enddate: res.fieldByName('enddate'),
						    created: res.fieldByName('created'),
						    updated: res.fieldByName('updated') 
					};	
					 
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                collection.trigger('sync');
                return listArr;
			},
			getAnnouncementById : function(id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ id+ "'" ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                db.file.setRemoteBackup(false);
                var res = db.execute(sql);
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
					    id: res.fieldByName('id'),
						title: res.fieldByName('title'),
						message: res.fieldByName('message'),
						startdate: res.fieldByName('startdate'),
						enddate: res.fieldByName('enddate'),
						created: res.fieldByName('created'),
						updated: res.fieldByName('updated') 
					};
					
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			resetAnnouncement : function(){
				var collection = this;
                var sql = "DELETE FROM " + collection.config.adapter.collection_name;
                db = Ti.Database.open(collection.config.adapter.db_name);
                db.file.setRemoteBackup(false);
                db.execute(sql);
                db.close();
                collection.trigger('sync');
			},
			searchAnnouncement: function(query){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE title LIKE '%"+ query+ "%' OR message LIKE '%"+ query+"%'" ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                db.file.setRemoteBackup(false);
                var res = db.execute(sql);
                var listArr = []; 
                var count = 0;
                while (res.isValidRow()){
					listArr[count] = {
						id: res.fieldByName('id'),
						title: res.fieldByName('title'),
						message: res.fieldByName('message'),
						startdate: res.fieldByName('startdate'),
						enddate: res.fieldByName('enddate'),
						created: res.fieldByName('created'),
						updated: res.fieldByName('updated') 
					};
					res.next();
					count++;
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return listArr;
			},
			addAnnouncement : function(arr) {
				var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
	            db.file.setRemoteBackup(false);
	            db.execute("BEGIN");
				arr.forEach(function(entry) {
					var title = entry.title;
					title = title.replace(/["']/g, "&quot;");
					
					var message = entry.message;
					message = message.replace(/["']/g, "&quot;"); 
		       		sql_query = "INSERT INTO "+ collection.config.adapter.collection_name + "(id, title,message,startdate, enddate,created, updated ) VALUES ('"+entry.id+"', '"+title+"', '"+message+"', '"+entry.startdate+"', '"+entry.enddate+"', '"+entry.created+"', '"+entry.updated+"')";
					 
				    db.execute(sql_query);
				});
                db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
            }
		});

		return Collection;
	}
};