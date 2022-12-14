var express = require('express');
var router = express.Router();
const userHelper = require('../helpers/user-helper');
const adminHelper=require('../helpers/admin-helper')
const fs=require('fs')
var db=require('../config/connection')

//twilio
const accountSid =process.env.accountSid
const authToken = process.env.authToken
const client = require('twilio')(accountSid,authToken); 
const verificationToken=process.env.verificationToken

//Using of midelware
const verifyLogin=(req,res,next)=>{
   if(req.session.logedIn)
   {
   next();
   }else{
     res.redirect('/login')
     
   }
}

router.get('/',async(req,res)=>{
  if(db.get()===null){
    res.render('user/something-went-wrong')
  }else{
    let user_login=req.session.user;
    allCategory=await adminHelper.getALLCategory() 
    userHelper.getALLBlogs().then((blogs)=>{
      res.render('user/home',{user:true,user_login,blogs,allCategory})
    })
  }
 
})


router.get('/login', (req, res) => {
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('user/login',{user:true,"logedinErr":req.session.logedinErr, blockuser: req.session.blockuser})
    req.session.logedinErr=false
    req.session.blockuser=false
  } 
})

router.get('/signup', (req, res) => {
  emailExist=req.session.emailExist
  res.render('user/signup',{user:true,emailExist})
  req.session.emailExist=false
})

router.post('/signup',(req,res)=>{
  userHelper.doSignup(req.body).then((response)=>{
  //console.log(response.emailExist);
   if(response.emailExist){
    req.session.emailExist = "Email is already Exist!!!";
    res.redirect('/signup')
   }else{
   req.session.user=response;
   req.session.logedIn=true;
   res.redirect('/')
   }
 })
})

router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      /* Here we create an session for single user with its all details */
      req.session.user=response.user;
      req.session.logedIn=true;
      res.redirect('/')
    }else{
      if(response.blockuser){
        req.session.blockuser=response.blockuser
        res.redirect('/login')
      }else{
        req.session.logedinErr=true;
        res.redirect('/login')
      }
      
    }
    
  })
})

router.get('/mobile-number', (req, res) => {
  if(req.session.logedIn){
    res.redirect('/')
  }
  else{
    res.render('user/mobile-number',{user:true,"nouser":req.session.noUser,"accoutBlocked": req.session.accountBlocked})
    req.session.noUser = false
    req.session.accountBlocked=false
}
})

router.post('/mobile-number', (req, res) => {
  let mobileNo = req.body.mobile
  userHelper.getMobileDetails(mobileNo).then((user) => {
   // console.log(user)
   if(user){
     if(user. blockuser===false){
         client.verify.services(verificationToken).verifications.create({
           to: `+91${req.body.mobile}`,
            channel: "sms"
         }).then((resp) => {
              req.session.mobileNumber = resp.to
              res.redirect('/otp-verification')
    }).catch((err) => {
      console.log(err)
    })
  }
    else{
      req.session.accountBlocked=true
      res.redirect('/mobile-number')
      console.log("account is blocked")
  }
    
   }else{
    req.session.noUser = true
    res.redirect('/mobile-number')
     console.log("No user found111111")
   }

  })
})

router.post('/mobile-number1', (req, res) => {
  let mobileNo = req.body.mobile
  userHelper.getMobileDetails(mobileNo).then((user) => {
   // console.log(user)
   if(user){
     if(user. blockuser===false){
         client.verify.services(verificationToken).verifications.create({
           to: `+91${req.body.mobile}`,
            channel: "call"
         }).then((resp) => {
              req.session.mobileNumber = resp.to
              res.redirect('/otp-verification')
    }).catch((err) => {
      console.log(err)
    })
  }
    else{
    req.session.accountBlocked=true
    res.redirect('/mobile-number')
    console.log("account is blocked")
  }
    
   }else{
    req.session.noUser = true
    res.redirect('/mobile-number')
     console.log("No user found111111")
   }

  })
})


router.get('/otp-verification', async (req, res) => {
  if(req.session.logedIn){
    res.redirect('/')
    } else {
      mobileNumber = req.session.mobileNumber
      res.render('user/otp-verification',{user:true,mobileNumber,"invalidOtp":req.session.invalidOtp})
      req.session.invalidOtp=false
      
  }
})
router.post('/otp-verification', (req, res) => {
  let otp= req.body.otp
  let number = req.session.mobileNumber
  client.verify
    .services(verificationToken)
    .verificationChecks.create({
      to: number,
      code: otp
    }).then((response) => {
      if (response.valid) {
        number = number.slice(3);
        userHelper.getMobileDetails(number).then(async (user) => {
          req.session.user = user
          req.session.logedIn=true;
          res.redirect('/')
        })
      } else {
        console.log("otp entered is not valid");
        req.session.invalidOtp=true
        res.redirect('/otp-verification')
      }
    }).catch((err) => {
      req.session.invalidOtp=true
      console.log(err)
      res.redirect('/otp-verification')
    })
})

router.get('/logout',(req,res)=>{
  req.session.user = null;
  req.session.logedIn = false;
  res.redirect('/');
})

router.get('/write-blog',verifyLogin,async(req,res)=>{
  let user_login=req.session.user;
  allCategory=await adminHelper.getALLCategory()
  res.render('user/write-blog',{user:true,user_login,allCategory})
})

router.post('/write-blog',verifyLogin,function(req,res){
  userHelper.writeBlog(req.body).then((id)=>{
    let image=req.files.image;
    image.mv('./public/images/'+id+'.jpg')
    res.redirect('/write-blog')
  })
});

router.get('/destinations',async(req,res)=>{
  let user_login=req.session.user;
  allCategory=await adminHelper.getALLCategory() 
  userHelper.getALLBlogs().then((blogs)=>{
    res.render('user/destinations',{user:true,user_login,blogs,allCategory})
  })
})

router.get('/blog-details/:id',async(req,res)=>{
  let user_login=req.session.user;
  blogComments= await userHelper.getComment(req.params.id)
  commentCount=blogComments.length
  allCategory=await adminHelper.getALLCategory() 
  userHelper.getBlogDetails(req.params.id).then((blogDetails)=>{
    res.render('user/blog-details',{user:true,user_login,blogDetails,blogComments,commentCount,allCategory})
  })
})

router.get('/my-blogs',verifyLogin,(req,res)=>{
  let user_login=req.session.user;
  userHelper.getALLMyBlogs(req.session.user._id).then((myBlogDetails)=>{
   if(myBlogDetails.length===0){
     res.redirect('/empty-blog')
   }else{
    res.render('user/my-blogs',{user:true,user_login,myBlogDetails})
   }
   
})
})

router.get('/edit-blog-details/:id',verifyLogin,async(req,res)=>{
  let user_login=req.session.user;
  allCategory=await adminHelper.getALLCategory()
  userHelper.getBlogDetails(req.params.id).then((blogDetails)=>{
    res.render('user/edit-blog-details',{user:true,user_login,blogDetails,allCategory})
  })
})

router.post('/edit-blog-details/:id',(req,res)=>{
  userHelper.updateBlogDetails(req.params.id,req.body).then((response)=>{
    //console.log(response);
    if(req.files){
      if(req.files.image){
        let image=req.files.image
       image.mv('./public/images/'+req.params.id+'.jpg');
      }
    }
    res.redirect('/my-blogs')
  })
})

router.get('/delete-blog/:id',verifyLogin,(req,res)=>{
  blogId=req.params.id;
  userHelper.deleteBlog(blogId).then((blogDetails)=>{
    fs.unlinkSync('./public/images/'+blogId+'.jpg')
     res.redirect('/my-blogs')
  })
})

router.get('/profile',verifyLogin,async(req, res) => {
  user_login=req.session.user
  userHelper.getProfileDetails(user_login._id).then((profileDetails)=>{
    console.log(profileDetails)
    res.render('user/profile',{user:true,user_login,profileDetails})
   })  
})

router.post('/profile/:id',(req,res)=>{
  userHelper.updateProfileDetails(req.params.id,req.body).then((response)=>{
    if(req.files){
      if(req.files.image){
        let image=req.files.image
       image.mv('./public/profile/'+req.params.id+'.jpg');
      } 
    }
    res.redirect('/')
  })
})

router.get("/change-password",verifyLogin,(req, res) => {
  user_login=req.session.user
  passwordmessage= req.session.passwordmessage
  res.render("user/change-password",{user:true,user_login,passwordmessage})
  req.session.passwordmessage = false;
})

router.post("/change-password/:id",verifyLogin, (req, res) => {
 userHelper.changePassword(req.params.id,req.body).then((response)=>{
   if (response.status){
    res.redirect("/profile");
   }else{
    req.session.passwordmessage= "You have entered a wrong password";
    res.redirect("/change-password");
   }
 })
})

router.get('/empty-blog',verifyLogin,async(req,res)=>{
  let user_login=req.session.user;
  res.render('user/empty-blog',{user:true,user_login})
})

router.post("/comment",(req, res) => {
  if(req.session.user){
    userHelper.insertComment(req.body.userId,req.body.blogId,req.body).then(()=>{
      var url_blogId = encodeURIComponent(req.body.blogId);
      res.redirect('/blog-details/'+url_blogId)})
  }else{
    //if user not login
    res.redirect('/login')
  }
})

router.get('/district-detail/:districtName',async(req, res) => {
  user_login=req.session.user
  let districtName=req.params.districtName
  distict=await userHelper.getDistrict(districtName)
  allCategory=await adminHelper.getALLCategory()  
  res.render('user/category',{user:true,user_login,distict,districtName,allCategory})
})

module.exports = router;
