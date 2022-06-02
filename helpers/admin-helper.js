var db=require('../config/connection');
var collections=require('../config/collection')
var objectId=require('mongodb').ObjectID;
var bcrypt=require('bcrypt')
const moment = require('moment')

module.exports={
 
getALLusers:()=>{
   return new Promise(async(resolve,reject)=>{
       let usersList=await db.get().collection(collections.USER_COLLECTION).find().toArray()
        resolve(usersList)
   })
}
,deleteUser:(userId)=>{
   return new Promise((resolve,reject)=>{
      db.get().collection(collections.USER_COLLECTION).removeOne({_id:objectId(userId)}).then((response)=>{
         resolve(response);
      })

   })
}
,doLogin:(data)=>{
   return new Promise(async(resolve,reject)=>{
       let response={}
       let admin = {}
       admin.email = "abcd@gmail.com"
       admin.password = "$2a$10$0GacidLXw.NVGMi7EA8zb.A3MCyYIsuPgn6Ar.sXDjX6zpJIrkfeG"
      if(admin.email===data.email){ 
       bcrypt.compare(data.password,admin.password).then((status)=>{
               if(status){
               response.admin=admin
               response.status=true
               resolve(response)
           }else{
               resolve({status:false})
           }
           })}else{
            resolve({status:false})
           }
   })

} 
,blockUser:(userId)=>{
   return new Promise((resolve,reject)=>{
       db.get().collection(collections.USER_COLLECTION).updateOne({_id:objectId(userId)},
       {$set:{
         blockuser:true
       }}).then((response)=>{
           resolve()
       })
   })
},
unblockUser:(userId)=>{
   return new Promise((resolve,reject)=>{
       db.get().collection(collections.USER_COLLECTION).updateOne({_id:objectId(userId)},
       {$set:{
        blockuser:false
       }}).then((response)=>{  
           resolve()
       })
   })
},
addCategory:(category)=>{
   return new Promise(async(resolve,reject)=>{
        let categoryData=await db.get().collection(collections.CATEGORY_COLLECTIONS).insertOne(category);
        resolve(categoryData.ops[0]._id);
   })
 },
 getALLCategory:()=>{
   return new Promise(async(resolve,reject)=>{
       let allCategory=await db.get().collection(collections.CATEGORY_COLLECTIONS).find().toArray()
      resolve(allCategory)
   })
 },
 deleteCategory:(categoryId)=>{
   return new Promise((resolve,reject)=>{
      db.get().collection(collections.CATEGORY_COLLECTIONS).removeOne({_id:objectId(categoryId)}).then((response)=>{
         resolve(response);
      })
 
   })
 },
 getCategoryDetail:(categoryId)=>{
   return new Promise(async(resolve,reject)=>{
     await db.get().collection(collections.CATEGORY_COLLECTIONS).findOne({_id:objectId(categoryId)}).then((categoryDetail)=>{
         resolve(categoryDetail)
      })
   })
 },
 updateCategory:(categoryId,categoryDetail)=>{
   return new Promise(async(resolve,reject)=>{
       await db.get().collection(collections.CATEGORY_COLLECTIONS).updateOne({_id:objectId(categoryId)},{
         $set:{
            categoryName:categoryDetail.categoryName,
            description:categoryDetail.description
         }
      }).then((response)=>{
         resolve(response)
      })
   })
},

getUserCount: () => {
   return new Promise(async (resolve, reject) => {
       let usercount = await db.get().collection(collections.USER_COLLECTION).count()
       resolve(usercount)
   })
},

getBlogCount: () => {
   return new Promise(async (resolve, reject) => {
       let blogcount = await db.get().collection(collections.BLOG_COLLECTION).count()
       resolve(blogcount)
   })
},
getCategoryCount: () => {
   return new Promise(async (resolve, reject) => {
       let categorycount = await db.get().collection(collections.CATEGORY_COLLECTIONS).count()
       resolve(categorycount)
   })
},

}