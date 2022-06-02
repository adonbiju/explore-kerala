const MongoClient=require('mongodb').MongoClient;
const state={
    db:null,
}
module.exports.connect=function(done){
    
    const url = process.env.mongoDb_url;
    const dbname='kerala'
    MongoClient.connect(url, {useUnifiedTopology: true } ,function(err, data) {
        if (err) return done(err);
        state.db=data.db(dbname)
        done()
      },);
     
}
module.exports.get=function(){
    return state.db
}
