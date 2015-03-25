exports.definition = {
	config: {
		columns: {
			"id": "INTEGER",
			"product" : "TEXT",
		    "prefix": "TEXT",
		    "item_id": "INTEGER", 
		    "code": "TEXT", 
		    "done" : "TEXT",
		    "orders" : "TEXT",
		    "myScan" : "TEXT",
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
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE myScan='1' ORDER BY updated DESC " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = {
					    
					    prefix: res.fieldByName('prefix'),
					    item_id: res.fieldByName('item_id'),
					    product: res.fieldByName('product'),
					    code: res.fieldByName('code'), 
					    orders: res.fieldByName('orders'), 
					    myScan: res.fieldByName('myScan'), 
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
			getTotaliCardByProduct : function(e){
				var collection = this;
                var sql = "SELECT COUNT(*) as total FROM " + collection.config.adapter.collection_name + " WHERE product='"+e.id+"' " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
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
			countProducts : function(){
				var collection = this;
                var sql = "SELECT  product , COUNT(DISTINCT(code)) as total FROM " + collection.config.adapter.collection_name + " GROUP BY product " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
                var arr = []; 
                var count = 0; 
				while (res.isValidRow()){
					arr[count] = {
						product : res.fieldByName('product'),
					    total: res.fieldByName('total')
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
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE item_id LIKE '%"+searchKey+"%' OR code LIKE '%"+searchKey+"%' ORDER BY updated DESC " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = {
					    
					    prefix: res.fieldByName('prefix'),
					    item_id: res.fieldByName('item_id'), 
					    code: res.fieldByName('code'),
					    product: res.fieldByName('product'),
					    done : res.fieldByName('done'),
					    orders: res.fieldByName('orders'), 
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
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql); 
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
					    prefix: res.fieldByName('prefix'),
					    item_id: res.fieldByName('item_id'), 
					    code: res.fieldByName('code'),
					    product: res.fieldByName('product'),
					    done : res.fieldByName('done'),
					    orders: res.fieldByName('orders'), 
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated') 
					};
					
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getProductByOrder : function(order){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE orders='"+order+"' " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql); 
                 var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = {
					    
					    prefix: res.fieldByName('prefix'),
					    item_id: res.fieldByName('item_id'), 
					    code: res.fieldByName('code'),
					    product: res.fieldByName('product'),
					    done : res.fieldByName('done'),
					    orders: res.fieldByName('orders'), 
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
			resetScanHistory : function(e){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE myScan='1' ORDER BY updated DESC " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
                if (res.isValidRow()){
                	while (res.isValidRow()){
		               	sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET   myScan= null  WHERE id='" +res.fieldByName('id')+"'";
						db.execute(sql_query);
						res.next();
					} 
				}
				
				
	            db.close();
	            collection.trigger('sync');
			},
			updateDoneProduct :function(e){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+e.id+"' " ;
 
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
                if (res.isValidRow()){
	            	sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET  done='1', updated='"+currentDateTime()+"' WHERE id='"+e.id+"' " ;
	            	db.execute(sql_query);
	            }
	            
	            db.close();
	            collection.trigger('sync');
			},
			getList : function(e) {
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name  ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql); 
                 var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = {
					    
					    prefix: res.fieldByName('prefix'),
					    item_id: res.fieldByName('item_id'), 
					    code: res.fieldByName('code'),
					    product: res.fieldByName('product'),
					    done : res.fieldByName('done'),
					    orders: res.fieldByName('orders'), 
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
			updateProductById : function(e) {
                var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ e.id + "' " ;
 
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
                 
                if (res.isValidRow()){
	             	sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET  item_id='"+e.item_id+"', updated='"+e.updated+"' WHERE id='" +e.id+"'";
	            }else{
	              	sql_query = "INSERT INTO " + collection.config.adapter.collection_name + " (id, prefix, item_id, product,code, created, updated) VALUES ('"+e.id+"','"+e.prefix+"','"+e.item_id+"','"+e.product+"','"+e.code+"' , '"+e.created+"','"+e.updated+"')" ;
				}
                 
	            db.execute(sql_query);
	            db.close();
	            collection.trigger('sync');
            } ,
			addUpdateProduct : function(e) {
                var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ e.id + "' " ;
 
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
                 
                if(e.myScan != ""){
                	
					if (res.isValidRow()){
	             		sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET  item_id='"+e.item_id+"', orders='"+e.order+"', myScan='"+e.myScan+"', updated='"+e.updated+"' WHERE id='" +e.id+"'";
	                }else{
	                	sql_query = "INSERT INTO " + collection.config.adapter.collection_name + " (id, prefix, item_id, product,code,done,orders, myScan,created, updated) VALUES ('"+e.id+"','"+e.prefix+"','"+e.item_id+"','"+e.product+"','"+e.code+"', 0, '"+e.order+"', '"+e.myScan+"', '"+e.created+"','"+e.updated+"')" ;
					}
                }else{
                	if (res.isValidRow()){
	             		sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET  item_id='"+e.item_id+"', orders='"+e.order+"', updated='"+e.updated+"' WHERE id='" +e.id+"'";
	                }else{
	                	sql_query = "INSERT INTO " + collection.config.adapter.collection_name + " (id, prefix, item_id, product,code,done,orders, created, updated) VALUES ('"+e.id+"','"+e.prefix+"','"+e.item_id+"','"+e.product+"','"+e.code+"', 0, '"+e.order+"', '"+e.created+"','"+e.updated+"')" ;
					}
                }
                 
	            db.execute(sql_query);
	            db.close();
	            collection.trigger('sync');
            } 
			 
		});

		return Collection;
	}
};