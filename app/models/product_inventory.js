exports.definition = {
	config: {
		columns: {
			"id": "INTEGER",
			"name" : "TEXT",
		    "prodSet": "TEXT",
		    "code": "TEXT", 
		    "category": "TEXT", 
		    "depth": "TEXT", 
		    "width": "TEXT", 
		    "height": "TEXT", 
		    "weight": "TEXT", 
		    "surface_habitable": "TEXT", 
		    "quantity": "TEXT", 
		    "fabric_used": "TEXT", 
		    "image": "TEXT",  
		    "created" : "TEXT",
		    "updated" : "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "product_inventory"
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
			getProductCategory : function(){ 
				var collection = this;
				var sql = "SELECT category,COUNT(1) AS total FROM " + collection.config.adapter.collection_name + " GROUP BY category" ;
                
                console.log(sql);
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = { 
						category: res.fieldByName('category'),
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
			getProductByCategory : function(cate){
				 
				var collection = this;
				var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE category='"+cate+"' " ;
                 
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = { 
						id: res.fieldByName('id'),
						name : res.fieldByName('name'),
						prodSet: res.fieldByName('prodSet'),
						code: res.fieldByName('code'), 
						category: res.fieldByName('category'), 
						depth: res.fieldByName('depth'), 
						width: res.fieldByName('width'), 
						height: res.fieldByName('height'), 
						weight: res.fieldByName('weight'), 
						surface_habitable: res.fieldByName('surface_habitable'), 
						quantity: res.fieldByName('quantity'), 
						fabric_used: res.fieldByName('fabric_used'), 
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
			getProductList : function(contentOffset){
				if(contentOffset == ""){
					contentOffset = 0;
				}
				
				var collection = this;
				if(contentOffset == "all"){
					var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " ORDER BY updated DESC";
				}else{
					var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " ORDER BY updated DESC LIMIT "+contentOffset +", 30" ;
                }
                 
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = {
					    
					    id: res.fieldByName('id'),
						name : res.fieldByName('name'),
						prodSet: res.fieldByName('prodSet'),
						code: res.fieldByName('code'), 
						category: res.fieldByName('category'), 
						depth: res.fieldByName('depth'), 
						width: res.fieldByName('width'), 
						height: res.fieldByName('height'), 
						weight: res.fieldByName('weight'), 
						surface_habitable: res.fieldByName('surface_habitable'), 
						quantity: res.fieldByName('quantity'), 
						fabric_used: res.fieldByName('fabric_used'), 
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
			searchProducts : function(searchKey,cate){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE (category='"+cate+"') AND (name LIKE '%"+searchKey+"%' OR category LIKE '%"+searchKey+"%' OR code LIKE '%"+searchKey+"%') ORDER BY updated DESC " ;
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
					arr[count] = {
					    id: res.fieldByName('id'),
						name : res.fieldByName('name'),
						prodSet: res.fieldByName('prodSet'),
						code: res.fieldByName('code'), 
						category: res.fieldByName('category'), 
						depth: res.fieldByName('depth'), 
						width: res.fieldByName('width'), 
						height: res.fieldByName('height'), 
						weight: res.fieldByName('weight'), 
						surface_habitable: res.fieldByName('surface_habitable'), 
						quantity: res.fieldByName('quantity'), 
						fabric_used: res.fieldByName('fabric_used'), 
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
			getProductDetails : function(id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+id+"' " ;
        
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql); 
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
					    id: res.fieldByName('id'),
						name : res.fieldByName('name'),
						prodSet: res.fieldByName('prodSet'),
						code: res.fieldByName('code'), 
						category: res.fieldByName('category'), 
						depth: res.fieldByName('depth'), 
						width: res.fieldByName('width'), 
						height: res.fieldByName('height'), 
						weight: res.fieldByName('weight'), 
						surface_habitable: res.fieldByName('surface_habitable'), 
						quantity: res.fieldByName('quantity'), 
						fabric_used: res.fieldByName('fabric_used'), 
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
			addUpdateProduct : function(e) {
                var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ e.id + "' " ;
                 
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                
                if (res.isValidRow()){
             		sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET   name='"+e.name+"',  prodSet='"+e.prodSet+"',code='"+e.code+"',category='"+e.category+"',depth='"+e.depth+"',width='"+e.width+"',height='"+e.height+"',weight='"+e.weight+"',surface_habitable='"+e.surface_habitable+"',quantity='"+e.quantity+"',fabric_used='"+e.fabric_used+"',image='"+e.image+"', created='"+e.created+"',updated='"+e.updated+"' WHERE code='" +e.code+"'";
                }else{
                	sql_query = "INSERT INTO " + collection.config.adapter.collection_name + " (id, name,prodSet,code, category, depth, width,height,weight,surface_habitable,quantity,fabric_used,image, created, updated) VALUES ('"+e.id+"','"+e.name+"','"+e.prodSet+"','"+e.code+"','"+e.category+"','"+e.depth+"','"+e.width+"','"+e.height+"','"+e.weight+"','"+e.surface_habitable+"','"+e.quantity+"','"+e.fabric_used+"','"+e.image+"' ,   '"+e.created+"','"+e.updated+"')" ;
				}
           
	            db.execute(sql_query);
	            db.close();
	            collection.trigger('sync');
            } 
			 
		});

		return Collection;
	}
};