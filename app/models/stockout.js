exports.definition = {
	config: {
		columns: {
			"id": "INTEGER",
			"sales_order" : "TEXT",
		    "delivery_order": "TEXT",
		    "customer_name": "INTEGER", 
		    "company_name": "TEXT", 
		    "remark" : "TEXT", 
		    "created" : "TEXT",
		    "updated" : "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "stockout"
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
			addColumn : function( newFieldName, colSpec) {
				var collection = this;
				var db = Ti.Database.open(collection.config.adapter.db_name);
				if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
				var fieldExists = false;
				resultSet = db.execute('PRAGMA TABLE_INFO(' + collection.config.adapter.collection_name + ')');
				while (resultSet.isValidRow()) {
					if(resultSet.field(1)==newFieldName) {
						fieldExists = true;
					}
					resultSet.next();
				}  
			 	if(!fieldExists) { 
					db.execute('ALTER TABLE ' + collection.config.adapter.collection_name + ' ADD COLUMN '+newFieldName + ' ' + colSpec);
				}
				db.close();
			},
			getStockOutList : function(){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + "  ORDER BY updated DESC " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = { 
					    id: res.fieldByName('id'),
					    sales_order: res.fieldByName('sales_order'), 
					    delivery_order: res.fieldByName('delivery_order'),
					    purchase_order : res.fieldByName('purchase_order'),
					    gon : res.fieldByName('gon'),
					    customer_name: res.fieldByName('customer_name'),
					    company_name : res.fieldByName('company_name'),
					    remark: res.fieldByName('remark'), 
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
			searchStockOut : function(searchKey){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE sales_order LIKE '%"+searchKey+"%' OR delivery_order LIKE '%"+searchKey+"%' OR customer_name LIKE '%"+searchKey+"%' OR company_name LIKE '%"+searchKey+"%' ORDER BY updated DESC " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = { 
					    id: res.fieldByName('id'),
					    sales_order: res.fieldByName('sales_order'), 
					    delivery_order: res.fieldByName('delivery_order'), 
					    purchase_order : res.fieldByName('purchase_order'),
					    gon : res.fieldByName('gon'),
					    customer_name: res.fieldByName('customer_name'),
					    company_name : res.fieldByName('company_name'),
					    remark: res.fieldByName('remark'), 
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
			getStockOutDetails : function(id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+id+"' " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql); 
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
					    id: res.fieldByName('id'),
					    sales_order: res.fieldByName('sales_order'), 
					    delivery_order: res.fieldByName('delivery_order'),
					    purchase_order : res.fieldByName('purchase_order'),
					    gon : res.fieldByName('gon'),
					    customer_name: res.fieldByName('customer_name'),
					    company_name : res.fieldByName('company_name'), 
					    remark: res.fieldByName('remark'), 
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated') 
					};
					
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			addUpdateStockOut : function(e) {
                var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ e.id + "' " ;
                 
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql);
                
                if (res.isValidRow()){
             		sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET  sales_order='"+e.sales_order+"',delivery_order='"+e.delivery_order+"',gon='"+e.gon+"',purchase_order='"+e.purchase_order+"',customer_name='"+e.customer_name+"',company_name='"+e.company_name+"',remark='"+e.remark+"',updated='"+e.updated+"'  WHERE id='" +e.id+"'";
                }else{ 
                	sql_query = "INSERT INTO " + collection.config.adapter.collection_name + " (id, sales_order, delivery_order,purchase_order,gon, customer_name,company_name,remark, created, updated) VALUES ('"+e.id+"','"+e.sales_order+"','"+e.delivery_order+"','"+e.purchase_order+"','"+e.gon+"','"+e.customer_name+"','"+e.company_name+"', '"+e.remark+"', '"+e.created+"','"+e.updated+"')" ;
				}
           		 
	            db.execute(sql_query);
	            db.close();
	            collection.trigger('sync');
            } 
		});

		return Collection;
	}
};