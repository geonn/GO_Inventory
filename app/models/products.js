exports.definition = {
	config: {
		columns: {
			"id": "INTEGER PRIMARY KEY AUTOINCREMENT",
		    "prefix": "TEXT",
		    "item_id": "INTEGER",
		    "name": "TEXT",
		    "code": "TEXT",
		    "image": "TEXT",
		    "done" : "TEXT",
		    "created" : "TEXT",
		    "updated" : "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "products"
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
			getScanProduct : function(){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " ORDER BY updated DESC " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = {
					    
					    prefix: res.fieldByName('prefix'),
					    item_id: res.fieldByName('item_id'),
					    name: res.fieldByName('name'),
					    code: res.fieldByName('code'),
					    image: res.fieldByName('image'),
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated') 
					};
					res.next();
					count++;
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			searchProducts : function(searchKey){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE name LIKE '%"+searchKey+"%' OR code LIKE '%"+searchKey+"%' ORDER BY updated DESC " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = {
					    
					    prefix: res.fieldByName('prefix'),
					    item_id: res.fieldByName('item_id'),
					    name: res.fieldByName('name'),
					    code: res.fieldByName('code'),
					    image: res.fieldByName('image'),
					    done : res.fieldByName('done'),
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated') 
					};
					res.next();
					count++;
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getProductDetails : function(code){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE code='"+code+"' " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql); 
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
					    prefix: res.fieldByName('prefix'),
					    item_id: res.fieldByName('item_id'),
					    name: res.fieldByName('name'),
					    code: res.fieldByName('code'),
					    image: res.fieldByName('image'),
					    done : res.fieldByName('done'),
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated') 
					};
					
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			addUpdateProduct : function(e) {
                var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE code='"+ e.code + "' " ;
                 
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                
                if (res.isValidRow()){
             		sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET image = '"+e.image+"', updated='"+e.updated+"' WHERE code='" +e.code+"'";
                }else{
                	sql_query = "INSERT INTO " + collection.config.adapter.collection_name + " (prefix, item_id, name,code,image,done, created, updated) VALUES ('"+e.prefix+"','"+e.item_id+"','"+e.name+"','"+e.code+"','"+e.image+"', 0, '"+e.created+"','"+e.updated+"')" ;
				}
           		 
	            db.execute(sql_query);
	            db.close();
	            collection.trigger('sync');
            } 
			 
		});

		return Collection;
	}
};