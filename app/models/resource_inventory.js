exports.definition = {
	config: {
		columns: {
			"id": "INTEGER",
			"name" : "TEXT",
		    "type": "TEXT",
		    "code": "TEXT", 
		    "depth": "TEXT", 
		    "width": "TEXT", 
		    "height": "TEXT", 
		    "weight": "TEXT", 
		    "supplier": "TEXT", 
		    "quantity": "TEXT", 
		    "image": "TEXT",  
		    "status": "TEXT",  
		    "created" : "TEXT",
		    "updated" : "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "resource_inventory"
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
			getResourcesCategory : function(){ 
				var collection = this;
				var sql = "SELECT `type`,COUNT(1) AS total FROM " + collection.config.adapter.collection_name + " WHERE `status` = 1 GROUP BY `type`" ;
                 
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = { 
						type: res.fieldByName('type'),
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
			getResourceByCategory : function(cate){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE `type`='"+cate+"' AND `status` = 1 " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = {
					    
					    id: res.fieldByName('id'),
						name : res.fieldByName('name'),
						type: res.fieldByName('type'),
						code: res.fieldByName('code'),  
						depth: res.fieldByName('depth'), 
						width: res.fieldByName('width'), 
						height: res.fieldByName('height'), 
						weight: res.fieldByName('weight'),  
						quantity: res.fieldByName('quantity'), 
						supplier: res.fieldByName('supplier'), 
						image: res.fieldByName('image'),  
						position: count,
						created : res.fieldByName('created'),
						updated : res.fieldByName('updated')
					};
					res.next();
					count++;
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getResourceList : function(contentOffset){
				if(contentOffset == ""){
					contentOffset = 0;
				}
				
				var collection = this;
				if(contentOffset == "all"){
					var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE `status` = 1 ORDER BY updated DESC";
				}else{
					var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE `status` = 1 ORDER BY updated DESC LIMIT "+contentOffset +", 30" ;
                }
                 
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = {
					    id: res.fieldByName('id'),
						name : res.fieldByName('name'),
						type: res.fieldByName('type'),
						code: res.fieldByName('code'),  
						depth: res.fieldByName('depth'), 
						width: res.fieldByName('width'), 
						height: res.fieldByName('height'), 
						weight: res.fieldByName('weight'),  
						quantity: res.fieldByName('quantity'), 
						supplier: res.fieldByName('supplier'), 
						image: res.fieldByName('image'),  
						position: count,
						created : res.fieldByName('created'),
						updated : res.fieldByName('updated')
					};
					res.next();
					count++;
				} 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			searchResources : function(searchKey,cate){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE (`status` = 1) AND (`type`='"+cate+"') AND (name LIKE '%"+searchKey+"%' OR supplier LIKE '%"+searchKey+"%' OR code LIKE '%"+searchKey+"%') ORDER BY updated DESC " ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = {
					    id: res.fieldByName('id'),
						name : res.fieldByName('name'),
						type: res.fieldByName('type'),
						code: res.fieldByName('code'),  
						depth: res.fieldByName('depth'), 
						width: res.fieldByName('width'), 
						height: res.fieldByName('height'), 
						weight: res.fieldByName('weight'),  
						quantity: res.fieldByName('quantity'), 
						supplier: res.fieldByName('supplier'), 
						image: res.fieldByName('image'),  
						position: count,
						created : res.fieldByName('created'),
						updated : res.fieldByName('updated')
					};
					res.next();
					count++;
				} 
		 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getResourceDetails : function(id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+id+"' " ;
        console.log(sql);
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql); 
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
					    id: res.fieldByName('id'),
						name : res.fieldByName('name'),
						type: res.fieldByName('type'),
						code: res.fieldByName('code'),  
						depth: res.fieldByName('depth'), 
						width: res.fieldByName('width'), 
						height: res.fieldByName('height'), 
						weight: res.fieldByName('weight'),  
						quantity: res.fieldByName('quantity'), 
						supplier: res.fieldByName('supplier'), 
						image: res.fieldByName('image'),   
						created : res.fieldByName('created'),
						updated : res.fieldByName('updated')
					};
					
				} 
				 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			addUpdateResource : function(e) {
                var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ e.id + "' " ;
                 
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                
                if (res.isValidRow()){
             		sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET   name='"+e.name+"',  type='"+e.type+"',code='"+e.code+"',supplier='"+e.supplier+"',depth='"+e.depth+"',width='"+e.width+"',height='"+e.height+"',weight='"+e.weight+"' ,quantity='"+e.quantity+"' ,image='"+e.image+"',status='"+e.status+"', created='"+e.created+"',updated='"+e.updated+"' WHERE id='" +e.id+"'";
                }else{
                	sql_query = "INSERT INTO " + collection.config.adapter.collection_name + " (id, name,type,code, supplier, depth, width,height,weight ,quantity, image,status, created, updated) VALUES ('"+e.id+"','"+e.name+"','"+e.type+"','"+e.code+"','"+e.supplier+"','"+e.depth+"','"+e.width+"','"+e.height+"','"+e.weight+"' ,'"+e.quantity+"', '"+e.image+"', '"+e.status+"' , '"+e.created+"','"+e.updated+"')" ;
				}
           
	            db.execute(sql_query);
	            db.close();
	            collection.trigger('sync');
            } 
			 
		});

		return Collection;
	}
};