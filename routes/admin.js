var express = require('express');
var router = express.Router();
var adminHelper=require('../helpers/admin-helper')
const userHelper = require('../helpers/user-helper');
const fs=require('fs');

const verifyLogin = (req, res, next) => {
  if (req.session.adminloggedIn) {
    next();
  } else {
    res.redirect("/admin");
  }
}

router.get("/", async(req, res) => {
  let admin = req.session.adminloggedIn;
  if (admin) {
      let userCount=await adminHelper.getUserCount();
      let blogCount=await adminHelper.getBlogCount();
      let categoryCount=await adminHelper.getCategoryCount();
      let allCategory=await adminHelper.getALLCategory() 
      res.render('admin/dashboard',{admin:true,userCount,blogCount,categoryCount,allCategory})
 
  } else {
    res.render("admin/adminlogin", { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
});

router.post("/", (req, res) => {
  adminHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.adminloggedIn = true;
      req.session.admin = response.admin;
      res.redirect("/admin");
    } else {
      req.session.loginErr = "Invalid Username or Password!!";
      res.redirect("/admin");
    }
  });
});



router.get("/adminlogout", (req, res) => {
  req.session.admin=null;
  req.session.adminloggedIn = false;
  res.redirect("/admin");
});



router.get('/users-list',verifyLogin,async(req,res)=>{
  userlist=await adminHelper.getALLusers()
  //console.log(userlist)
  res.render('admin/users-list',{userlist,admin:true})
})

router.get('/delete-user/:id',(req,res)=>{
  let userId=req.params.id
  console.log(userId)
  adminHelper.deleteUser(userId).then((response)=>{
    const pathToFile = './public/profile/'+userId+'.jpg'
    if (fs.existsSync(pathToFile)) {
    fs.unlink(pathToFile, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("Successfully deleted the file.");
      }
    });
    res.redirect('/admin/users-list')
  }else{
    res.redirect('/admin/users-list')
  }
  })
})

router.get('/block-user/:id',(req,res)=>{
  userId=req.params.id
  adminHelper.blockUser(userId).then(()=>{
    res.redirect('/admin/users-list')
  })
})
router.get('/unblock-user/:id',(req,res)=>{
  userId=req.params.id
  adminHelper.unblockUser(userId).then(()=>{
    res.redirect('/admin/users-list')
  })
})


router.get("/all-blog",verifyLogin,async(req, res) => {
  userHelper.getALLBlogs().then((blogs)=>{
  res.render('admin/view-allblogs',{blogs,admin:true})
})

});

router.get('/delete-blog/:id',verifyLogin,(req,res)=>{
  blogId=req.params.id;
  userHelper.deleteBlog(blogId).then((blogDetails)=>{
    fs.unlinkSync('./public/images/'+blogId+'.jpg')
     res.redirect('/admin/all-blog')
  })
})

router.get('/add-category',verifyLogin,async(req,res)=>{
allCategory=await adminHelper.getALLCategory()
res.render('admin/add-category',{admin:true,allCategory})
})

router.post('/add-category',verifyLogin,function(req,res){
  adminHelper.addCategory(req.body).then((id)=>{
    let image=req.files.image
    image.mv('./public/category/'+id+'.jpg')
    res.redirect('/admin/add-category')
  })
})

router.get('/delete-category/:id',verifyLogin,(req,res)=>{
  let categoryId=req.params.id;
  adminHelper.deleteCategory(categoryId).then((categoryDetails)=>{
    fs.unlinkSync('./public/category/'+categoryId+'.jpg')
     res.redirect('/admin/add-category')
  })
})

router.get('/edit-category/:id',(req,res)=>{
  let categoryId=req.params.id;
  adminHelper.getCategoryDetail(categoryId).then((categoryDetail)=>{
    res.render('admin/edit-category',{admin:true,categoryDetail})
  })
})

router.post('/edit-category/:id',(req,res)=>{
  console.log(req.body)
  adminHelper.updateCategory(req.params.id,req.body).then((response)=>{
    if(req.files){
      if(req.files.image){
        let image=req.files.image
       image.mv('./public/category/'+req.params.id+'.jpg');
      }
    }
    res.redirect('/admin/add-category')
  })
})


module.exports = router;
