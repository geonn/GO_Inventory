/**********************************
SETTING CONFIG 
ID       Name
------------------------------------
1		Auto Sync	 
2 		Push Notification 	 
3 		   
4 			
************************************/
exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER",
		    "name": "TEXT",
		    "value": "TEXT",
		    "updated" : "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "settings"
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
			getSettingById : function(id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ id+ "'" ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                db.file.setRemoteBackup(false);
                var res = db.execute(sql);
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
					    name: res.fieldByName('name'),
					    value: res.fieldByName('value'),
					};
				} 
				 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			updateSettings : function (id,name, value){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id="+ id ;
                var sql_query =  "";
                db = Ti.Database.open(collection.config.adapter.db_name);
                db.file.setRemoteBackup(false);
                var res = db.execute(sql);
             
                if (res.isValidRow()){
             		sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET value='"+value+"', updated='"+currentDateTime()+"' WHERE id='" +id+"'";
                }else{
                	sql_query = "INSERT INTO " + collection.config.adapter.collection_name + " (id, name, value, updated) VALUES ('"+id+"','"+name+"', '"+value+"', '"+currentDateTime()+"')" ;
				}
       
	            db.execute(sql_query);
	            db.close();
	            collection.trigger('sync');
			}
		});

		return Collection;
	}
};