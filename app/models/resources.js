exports.definition = {
	config: {
		columns: {
			"id": "INTEGER",
			"iCard": "TEXT",
			"resource": "TEXT",
		    "prefix": "TEXT",
		    "item_id": "INTEGER",
		    "name": "TEXT",
		    "code": "TEXT",
		    "status": "TEXT",
		    "created" : "TEXT",
		    "updated" : "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "resources"
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
			getResourcesByicard : function(code){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE iCard='"+code+"' " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = {
						id: res.fieldByName('id'),
					    iCard: res.fieldByName('iCard'),
					    prefix: res.fieldByName('prefix'),
					    item_id: res.fieldByName('item_id'),
					    name: res.fieldByName('name'),
					    resource : res.fieldByName('resource'),
					    code: res.fieldByName('code'),
					    status: res.fieldByName('status'),
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
			getTotaliCardByResource : function(e){
				var collection = this;
                var sql = "SELECT  COUNT(DISTINCT(code)) as total FROM " + collection.config.adapter.collection_name + " WHERE resource='"+e.id+"' " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var arr = []; 
                
                if (res.isValidRow()){
					arr = { 
					    total: res.fieldByName('total')
					};
				}  
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getResourcesByCode : function(code){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE code='"+code+"' " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                
 				var arr = []; 
               
                if (res.isValidRow()){
					arr = {
					    id: res.fieldByName('id'),
					    iCard: res.fieldByName('iCard'),
					    prefix: res.fieldByName('prefix'),
					    item_id: res.fieldByName('item_id'),
					    name: res.fieldByName('name'),
					    resource : res.fieldByName('resource'),
					    code: res.fieldByName('code'),
					    status: res.fieldByName('status'),
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated') 
					};
					
				} 
				res.close(); 
                db.close();
                collection.trigger('sync');
                return arr;
			},
			addUpdateResources : function(e) {
                var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE code='"+ e.code + "' AND iCard='"+e.iCard+"' " ;
                 
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                
                if (res.isValidRow()){
             		sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET updated='"+e.updated+"' WHERE code='"+ e.code + "' AND id='"+e.id+"'";
                }else{
                	sql_query = "INSERT INTO " + collection.config.adapter.collection_name + " (id, iCard, prefix, item_id, name,code,resource, `status`, created, updated) VALUES ('"+e.id+"','"+e.iCard+"','"+e.prefix+"','"+e.item_id+"','"+e.name+"','"+e.code+"','"+e.resource+"', '"+e.status+"', '"+e.created+"','"+e.updated+"')" ;
				}
           		
	            db.execute(sql_query);
	            db.close();
	            collection.trigger('sync');
            },
            addUpdateResourcesById : function(e) {
                var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ e.id+"' AND iCard='"+e.iCard+"' " ;
                 
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                
                if (res.isValidRow()){
             		sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET updated='"+e.updated+"' WHERE id='"+e.id+"' AND iCard='"+e.iCard+"' ";
                }else{
                	sql_query = "INSERT INTO " + collection.config.adapter.collection_name + " (id, iCard, prefix, item_id, name,code,resource, `status`, created, updated) VALUES ('"+e.id+"','"+e.iCard+"','"+e.prefix+"','"+e.item_id+"','"+e.name+"','"+e.code+"','"+e.resource+"', '"+e.status+"', '"+e.created+"','"+e.updated+"')" ;
				}
           		
	            db.execute(sql_query);
	            db.close();
	            collection.trigger('sync');
            },
            confirmScan : function(e){
            	var collection = this;
                var sql = "UPDATE " + collection.config.adapter.collection_name + " SET `status`='2', updated='"+currentDateTime()+"' WHERE iCard='" +e.code+"'";
                db = Ti.Database.open(collection.config.adapter.db_name);
                 
                db.execute(sql);
                db.close();
                collection.trigger('sync');
            },
            updatedSync : function(e){
            	var collection = this;
                var sql = "UPDATE " + collection.config.adapter.collection_name + " SET `status`='3', updated='"+currentDateTime()+"' WHERE prefix='" +e.prefix+"' AND item_id='"+e.item_id+"' ";
                db = Ti.Database.open(collection.config.adapter.db_name);
               
                db.execute(sql);
                db.close();
                collection.trigger('sync');
            },
            getResourcesToSync : function(e){
            	var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE iCard='"+e.iCard+"' AND status=2" ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = {
						id: res.fieldByName('id'),
					    iCard: res.fieldByName('iCard'),
					    prefix: res.fieldByName('prefix'),
					    item_id: res.fieldByName('item_id'),
					    name: res.fieldByName('name'),
					    resource : res.fieldByName('resource'),
					    code: res.fieldByName('code'),
					    status: res.fieldByName('status'),
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
            getLastScan : function(e){
            	var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE iCard='"+ e.code + "' AND `status`='1' ORDER BY updated DESC LIMIT 1 " ;
                 
                db = Ti.Database.open(collection.config.adapter.db_name);
              	var res = db.execute(sql); 
                var arr = [];  
                if (res.isValidRow()){
					arr = {
					    id: res.fieldByName('id'),
					    item_id: res.fieldByName('item_id'),
					    name: res.fieldByName('name'),
					    resource : res.fieldByName('resource'),
					    code: res.fieldByName('code'), 
					    status : res.fieldByName('status'), 
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated') 
					};
					
				} 
				res.close();
	            db.close();
	            collection.trigger('sync');
	            return arr;
            } ,
            removeScanById : function(e){
            	var collection = this;
                var sql = "DELETE FROM " + collection.config.adapter.collection_name + " WHERE id='"+e.id+"' ";
                db = Ti.Database.open(collection.config.adapter.db_name);
                db.execute(sql);
                db.close();
                collection.trigger('sync');
            }
			 
		});

		return Collection;
	}
};