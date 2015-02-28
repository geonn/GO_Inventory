exports.definition = {
	config: {
		columns: {
		    "id": "string",
		    "fullname": "string",
		    "username": "string",
		    "password": "string",
		    "email": "string",
		    "mobile": "string",
		    "lastlogin" : "string"
		},
		adapter: {
			type: "sql",
			collection_name: "user"
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
			getUserById : function(id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ id+ "'" ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
					    id: res.fieldByName('id'),
						fullname: res.fieldByName('fullname'),
						username: res.fieldByName('username'),
						email: res.fieldByName('email'),
						mobile: res.fieldByName('mobile'),
						password: res.fieldByName('password'),
						lastlogin: res.fieldByName('lastlogin') 
					};
					
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			changeProfile : function(e){
				var collection = this; 
                var sql_query =  "";
                db = Ti.Database.open(collection.config.adapter.db_name);
                sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET "+e.field+"='"+e.value+"' WHERE id='" +e.id+"'";
       
	            db.execute(sql_query);
	            db.close();
	            collection.trigger('sync');
			},
			changePassword : function(e){
				var collection = this; 
                var sql_query =  "";
                db = Ti.Database.open(collection.config.adapter.db_name);
                sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET password='"+e.password+"' WHERE id='" +e.id+"'";
       
	            db.execute(sql_query);
	            db.close();
	            collection.trigger('sync');
			}
		});

		return Collection;
	}
};