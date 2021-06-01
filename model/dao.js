const MongoClient=require('mongodb').MongoClient;
const url="mongodb://localhost:27017";

function connect(callback){
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        callback(db);
    });
}

module.exports.insert=(dbname,col,data,callback)=>{
    connect(db=>{
        var insertdbo=db.db(dbname);
        data=(data instanceof Array)?data:[data];
        insertdbo.collection(col).insertMany(data,(err,res1)=>{
            if(err) throw err;
            db.close();
            callback(data);
        });
    })
}
module.exports.find=(dbname,col,callback,condition={},mysort={},myskip=0,mylimit=0)=>{
    connect(db=>{
        var finddbo=db.db(dbname);
        finddbo.collection(col).find(condition).sort(mysort).skip(myskip).limit(mylimit).toArray((err,result)=>{
            if(err) throw err;
            db.close();
            callback(result);
        });
    });
}
module.exports.update=(dbname,col,olddata,newdata,callback)=>{
    connect(db=>{
        //更新数据
        var updatedbo=db.db(dbname);
        var updateobj = {$set: newdata};
        updatedbo.collection(col).updateOne(olddata,updateobj,(err,obj)=>{
            if(err) throw err;
            db.close();
            callback(obj);
        });
    })
}
module.exports.delete=(dbname,col,deletedata,callback)=>{
    connect(db=>{
        //删除数据
        var deletedbo=db.db(dbname);
        deletedbo.collection(col).deleteOne(deletedata,(err,obj)=>{
            if(err) throw err;
            db.close();
            callback(obj);
        });
    })
}