var db = require("../config/connection");
var collections = require("../config/collection");
var bcrypt = require("bcrypt");
var objectId = require("mongodb").ObjectID;
const { resolve } = require("url");
const moment = require('moment')


module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      let emailExist = await db.get().collection(collections.USER_COLLECTION).findOne({ email: userData.email })
      if(emailExist){
        resolve({emailExist})
      }else{
      userData.password = await bcrypt.hash(userData.password, 10);
      userData.blockuser=false
      db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data) => {
          resolve(data.ops[0]);
        });
    }
    });
  },
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db.get().collection(collections.USER_COLLECTION).findOne({ email: userData.email });
      if (user) {
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            if (user.blockuser){
              response.blockuser=true
              resolve(response)
            }else{
              console.log("login successful");
              response.user = user;
              response.status = true;
              resolve(response);
            }
           
            //console.log(response);
          } else {
            console.log("login Failed");
            resolve({status:false});
          }
        });
      } else {
        console.log("login Failed/user blocked");
        resolve({status:false});
      }
    });
  }
//   ,getRandomBlogs:()=>{
//     return new Promise(async(resolve,reject)=>{
//         let blogs= await db.get().collection(collections.BLOG_COLLECTION).aggregate([{ $sample :{size :8}}]).toArray()
//         resolve(blogs)
//     })
//  }
 ,writeBlog:(blogDetail)=>{
  return new Promise(async(resolve,reject)=>{
       let  date= moment(new Date()).format('LLLL')
       blogDetail["date"]=date   
       let data=await db.get().collection(collections.BLOG_COLLECTION).insertOne(blogDetail);
       resolve(data.ops[0]._id);
  })
 },
 getALLBlogs:()=>{
  return new Promise(async(resolve,reject)=>{
      let allblogs=await db.get().collection(collections.BLOG_COLLECTION).find().toArray()
     resolve(allblogs)
  })
},
getBlogDetails:(blogId)=>{
  return new Promise(async(resolve,reject)=>{
    await db.get().collection(collections.BLOG_COLLECTION).findOne({_id:objectId(blogId)}).then((blogDetail)=>{
        resolve(blogDetail)
     })
  })
},
getALLMyBlogs:(userId)=>{
  return new Promise(async(resolve,reject)=>{
      let myBlogs=await db.get().collection(collections.BLOG_COLLECTION).find({userId:userId}).toArray()
      resolve(myBlogs)
  })
},
updateBlogDetails:(blogId,blogDetails)=>{
  return new Promise(async(resolve,reject)=>{
      let  date= moment(new Date()).format('LLLL')
      await db.get().collection(collections.BLOG_COLLECTION).updateOne({_id:objectId(blogId)},{
        $set:{
          destination:blogDetails.destination,
          district:blogDetails.district,
          paragraph1:blogDetails.paragraph1,
          paragraph2:blogDetails.paragraph2,
          paragraph3:blogDetails.paragraph3,
          placesToStay:blogDetails.placesToStay,
          thingstoDo:blogDetails.thingstoDo,
          popularTouristAttractions:blogDetails.popularTouristAttractions,
          bestTimeToVisit:blogDetails.bestTimeToVisit,
          nearestAirport:blogDetails.nearestAirport,
          nearestRailwayStation:blogDetails.nearestRailwayStation,
          date:date           
        }
     }).then((response)=>{
        resolve(response)
     })
  })
},
deleteBlog:(blogId)=>{
  return new Promise((resolve,reject)=>{
     db.get().collection(collections.BLOG_COLLECTION).removeOne({_id:objectId(blogId)}).then((response)=>{
        resolve(response);
     })

  })
},
getProfileDetails: (userId) => {
  return new Promise(async (resolve, reject) => {
    await db.get().collection(collections.USER_COLLECTION).findOne({ _id: objectId(userId) }).then((profileDetails) => {
        resolve(profileDetails);
      });
  });
},
updateProfileDetails: (userId, profiletDetail) => {
  return new Promise(async (resolve, reject) => {
    // console.log(userId);
    // console.log(profiletDetail);
    await db.get().collection(collections.USER_COLLECTION).updateOne({ _id: objectId(userId) },
        {
          $set: {
            name: profiletDetail.name,
            email: profiletDetail.email,
            mobile1: profiletDetail.mobile1,
            mobile2: profiletDetail.mobile2,
            city: profiletDetail.city,
            state: profiletDetail.state,
            pincode: profiletDetail.pincode,
            country: profiletDetail.country,
          },
        }
      )
      .then((response) => {
        resolve(response);
      });
  });
},
insertComment: (userId, blogId,comment) => {
  return new Promise((resolve, reject) => {
    var commentData = {
      userId: userId,
      userName:comment.username,
      blogId: blogId,
      comment:comment.comment,
      date: moment(new Date()).format('LLLL')
    };
    db.get().collection(collections.COMMENT_COLLECTION).insertOne(commentData).then(()=>{
      resolve()
    })
  })
},
getComment: (blogId) => {
  return new Promise(async (resolve, reject) => {
    comment=await db.get().collection(collections.COMMENT_COLLECTION).find({ blogId: blogId }).toArray();
   resolve(comment);
    
  });
},
  //Getting user details using mobile numbers 
  getMobileDetails: (mobileNumber) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.get().collection(collections.USER_COLLECTION).findOne({ mobile1: mobileNumber })
        if (user) {
            resolve(user)
        } else {
            resolve()
        }
    })
},
//geting diffrent blogs with same district name
getDistrict:(districtName)=>{
  return new Promise(async(resolve,reject)=>{
    let district=await db.get().collection(collections.BLOG_COLLECTION).find({district:districtName}).toArray()
   resolve(district)
  })
},
changePassword: (userId, password) => {
  let oldpassword = password.oldpassword;
  let newPassword = password.newpassword;
  return new Promise(async (resolve, reject) => {
    let user = await db.get().collection(collections.USER_COLLECTION).findOne({ _id: objectId(userId) });
    bcrypt.compare(oldpassword, user.password).then(async (status) => {
      if (status) {
        updatedpassword = await bcrypt.hash(newPassword, 10);
        db.get().collection(collections.USER_COLLECTION).updateOne({ _id: objectId(userId) },
            {
              $set: {
                password: updatedpassword,
              },
            }
          );
        resolve({ status: true });
      } else {
        resolve({ status: false });
      }
    });
  });
},


}
