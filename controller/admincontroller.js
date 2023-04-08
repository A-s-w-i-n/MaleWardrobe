const admininfo = require('../model/adminmodel').adminlogin
const productinfo = require('../model/productmodel').addnewproduct
const { AwsInstance } = require('twilio/lib/rest/accounts/v1/credential/aws')
const { v4: uuidv4 } = require('uuid')
const categoryinfo = require('../model/categorymodel').addnewcategory
const subcategoryinfo = require('../model/subcategory').addsubcategory
const userinfo = require('../model/usermodel').usersignin
const orderinfo=require('../model/orderModal').orderManagement
const bannerinfo=require('../model/bannerModel').addBanner
const couponinfo=require('../model/couponModel').adminCoupon
 const {ObjectId}=require('mongodb')
const sharp=require('sharp')
const { response } = require('express')
// let id2
// let edit
// let categorymsg
// let productData
require('dotenv').config()


const adminlogin = function (req, res, next) {
    try {
        
        res.render('adminlogin')
    } catch (error) {
        console.log(error)
        next()
    }

}
const adminhome =async function (req, res, next) {
    try {
        
        res.render('adminhome')
    } catch (error) {
        console.log(error)
        next()
    }
}
const productadd = async function (req, res, next) {
    try {
        const categorynew = await categoryinfo.find({ status: true })
        const subcategorynew = await subcategoryinfo.find({ status: true })
        res.render('addproduct', { categorynew, subcategorynew })
    } catch (error) {
        console.log(error)
        next()
    }

}
const adminlogout = function (req, res, next) {
    try {
        res.redirect('/admin')
    } catch (error) {
        console.log(error)
        next()
    }
}
const productall = async function (req, res, next) {
    try {
        let addnew = await productinfo.find()
        res.render('allproducts', { addnew })
        
    } catch (error) {
        console.log(error)
        next()

    }
}
const productdelete = async function (req, res, next) {
    try {
        let id1 = req.params.id
        await productinfo.deleteOne({ _id: id1 })
    
    
        res.redirect('/allproducts')
        
    } catch (error) {
        console.log(error)
        next()
    }
}
const productRedirct = async function (req, res, next) {
    try {
       let id2 = req.params.id
      let  edit = await productinfo.findOne({ _id: id2 })
    
      if(edit.image){
        
      }
        req.session.id2=id2
        req.session.edit=edit
        res.redirect('/editproduct')
    } catch (error) {
        console.log(error)
        next()
    }
}
const productedit = async function (req, res, next) {
    try {
        let updationImagesId=req.params.id
        const edit=req.session.edit
        const categorynew = await categoryinfo.find({ status: true })
        const subcategorynew = await subcategoryinfo.find({ status: true })
        const updationImages=await productinfo.find({_id:updationImagesId})

       
        
    
        res.render("editproduct", {edit, subcategorynew, categorynew,updationImages })
        
    } catch (error) {
        console.log(error)
        next()
    }
}

const categoryadd = async function (req, res, next) {
    try {
        let categorymsg=req.session.categorymsg
        const categorynew = await categoryinfo.find()
        res.render('addcategory', { categorynew,categorymsg })
        categorymsg=null
        
    } catch (error) {
        console.log(error)
        next()
    }
}
const addsubcategory = async function (req, res, next) {
    try {
        const subcategorynew = await subcategoryinfo.find()
        res.render('subcategory', { subcategorynew })
        
    } catch (error) {
        console.log(error)
        next()
    }

}

const manageuser = async function (req, res, next) {
    try {
        
        const finduser = await userinfo.find()
        res.render('usermanage', { finduser })
    } catch (error) {
        console.log(error)
        next()
    }
}
const block = async function (req, res, next) {
    try {
        
        blockstatus = req.params.id
      const currentUser=  await userinfo.updateOne({ _id: blockstatus }, { $set: { status: false } })
        if(currentUser){
            req.session.user=null
        }

        res.redirect('/usermanage')
        
    } catch (error) {
        console.log(error)
        next()
    }
}
const unblock = async function (req, res, next) {
    try {
        unblockstatus = req.params.id
        await userinfo.updateOne({ _id: unblockstatus }, { $set: { status: true } })
        res.redirect('/usermanage')
        
    } catch (error) {
        console.log(error)
        next()
    }
}
// const deleteOne = async function (req, res, next) {
//     try {
//         userdelete = req.params.id
//         await userinfo.deleteOne({ _id: userdelete })
//         res.redirect('/usermanage')
        
//     } catch (error) {
//         console.log(error)
//     }
// }

//    post req

const adminloginvalidationpost = async function (req, res, next) {
    try {
        let data = {
            name: req.body.name,
            password: req.body.password
        }
        let adminvalidate = await admininfo.findOne({ name: data.name })
    
        if (adminvalidate == null) {
            res.redirect('/admin')
        } else {
            if (data.password == adminvalidate.password) {
                req.session.admin=adminvalidate
                res.redirect('/adminhome')
            } else {
                res.redirect('/admin')
            }
        }
        
    } catch (error) {
        console.log(error)
        next()
    }


}

const newproductpost = async function (req, res, next) {
    try {
        
        let addproductdata = req.body
        addproductdata.productName = req.body.productname
        addproductdata.discription = req.body.discription
        addproductdata.subCategory = req.body.subcategory
        addproductdata.productId = uuidv4()
    
    
    
        let image = []
        image = req.files.image
    
        let imagesize = image.length
    
        if (imagesize) {
            for (i = 0; i < image.length; i++) {

                
                let path = "" + image[i].tempFilePath
                console.log(path);
                await sharp(path)
                  .rotate()
                  .resize(1000, 1500)
                  .jpeg({ mozjpeg: true })
                  .toFile('./public/productimages/' + addproductdata.productId + i + '.jpg')
                image[i] = addproductdata.productId + i + '.jpg'
            }
            addproductdata.image = image
        }
        else {
            image.mv('./public/productimages/' + addproductdata.productId + '.jpg')
    
            image = addproductdata.productId + '.jpg'
            addproductdata.image = image
        }
    
        await productinfo.insertMany([addproductdata])
    
    
        res.redirect('/allproducts')
    } catch (error) {
        console.log(error)
        next()
    }
}

const editexistproductpost = async function (req, res, next) {
    try {
         const id2=req.session.id2
        
        id = req.params.id
        let items = req.body
    
        let image = []
    
        image = req.files.image
        console.log(req.files);
        let imagesize = image.length
        response.status=true
        // const productobj=req.files
        // console.log(productobj);
        // if(productobj){
        //     count=Object.keys(productobj).length
        //     console.log(count);
        //     for(i=0;i<count;i++){
        //         imageId=Object.keys(productobj)[i]
        //         img=Object.values(productobj)[i]
        //         console.log(img);
        //     }
        // }

        
        if (imagesize > 1) {
            for (i = 0; i < image.length; i++) {
                image[i].mv('./public/productimages/' + id + i + '.jpg')
                image[i] = id + i + '.jpg'
    
            }
            items.image = image
        }
        else {
            image.mv('./public/productimages/' + id + '.jpg')
            items.image = id + '.jpg'
        }
    
        console.log(image);
        await productinfo.updateOne({ _id: id2 }, {
            $set: {
                productName: req.body.productname,
                category: req.body.category,
                subCategory: req.body.subcategory,
                price: req.body.price,
                stock: req.body.stock,
                brand: req.body.brand,
                image: req.body.image,
                discription: req.body.discription
            }
        })
        res.redirect('/allproducts')
    } catch (error) {
        console.log(error)
        next()
    }
}
const newcategoryaddpost = async function (req, res, next) {
    try {
        
        const addcategorynew = req.body
        const  categoryExist=await categoryinfo.findOne({name:req.body.category})
        var results = new RegExp('[\\?&]' + req.body.category + '=([^&#]*)', "i")
            if(categoryExist||results){
                res.redirect('/addcategory')
             let  categorymsg="Category alredy exist"
             req.session.categorymsg=categorymsg
            }else{
                 categoryinfo.insertMany({ name: req.body.category, status: true })
            res.redirect('/addcategory')
            }
    } catch (error) {
        console.log(error)
        next()

    }
 
    
}
const newsubcategorypost = async function (req, res, next) {
    try {
        const addsubcategorynew = req.body
        addsubcategorynew.subName = req.body.subcategory
        await subcategoryinfo.insertMany({ subName: req.body.subcategory, status: true })
    
        res.redirect('/subcategory')
        
    } catch (error) {
        console.log(error)
        next()
    }
}
const desable = async function (req, res, next) {
    try {
        
        desableStatus = req.params.id
        await categoryinfo.updateOne({ _id: desableStatus }, { $set: { status: false } })
        res.redirect('/addcategory')
    } catch (error) {
        console.log(error)
        next()

    }
}
const enable = async function (req, res, next) {
    try {
        
        enableStatus = req.params.id
        await categoryinfo.updateOne({ _id: enableStatus }, { $set: { status: true } })
    
        res.redirect('/addcategory')
    } catch (error) {
        console.log(error)
        next()
    }
}
const subdesable = async function (req, res, next) {
    try {
        
        subdesableStatus = req.params.id
        await subcategoryinfo.updateOne({ _id: subdesableStatus }, { $set: { status: false } })
        res.redirect('/subcategory')
    } catch (error) {
        console.log(error)
        next()
    }
}
const subenable = async function (req, res, next) {
    try {
        
        subenableStatus = req.params.id
        await subcategoryinfo.updateOne({ _id: subenableStatus }, { $set: { status: true } })
        res.redirect('/subcategory')
    } catch (error) {
        console.log(error)
        next()
    }
}
const orderManagemnt=async function(req,res,next){
    try {
        
        const findUserDetail=await orderinfo.find()
        
        res.render('adminOrderManagemant',{findUserDetail})
    } catch (error) {
        console.log(error)
        next()
    }
    

}
const adminOrderView=function(req,res,next){
    try {
        const productData=req.session.productData
        const productDataDetails=req.session.productDataDetails
        let orderConfirmed=req.session.orderConfirmed
        
        res.render("adminOrderedProduct",{productData,productDataDetails,orderConfirmed})
    } catch (error) {
        console.log(error)
        next()
    }
    
}

const orderProductDetail=async function(req,res,next){
    try {
        
        const orderedId=req.query._id
        const orderId=req.query.orderedUser
        req.session.orderId=orderId
    
        const productDataDetails=await orderinfo.aggregate([{$unwind:"$products"},{$match:{orderedUser:orderId}},{$match:{_id:new ObjectId(orderedId)}}])

    req.session.productDataDetails=productDataDetails
     const  productData=await orderinfo.aggregate([{$unwind:"$products"},{$match:{orderedUser:orderId}},{$project:{product:"$products.product"}},{$match:{_id:new ObjectId(orderedId)}}])
    req.session.productData=productData
         console.log(productData);
    
    
        res.redirect("/adminOrderedProduct")
    } catch (error) {
        console.log(error)
        next()
    }
}
const bannerAdmin=async function(req,res,next){

    let newBanner=await bannerinfo.find({}).toArray()

    res.render('adminBanner',{newBanner})
  }
  
  const addBanner=async function(req,res,next){
    try {
        const bannerDetails=req.body
        bannerDetails.bannerId=uuidv4()
        bannerDetails.status=true

        let image = []
        image=req.files.image
        
            image.mv('./public/bannerImages/' + bannerDetails.bannerId + '.jpg')
    
            image = bannerDetails.bannerId + '.jpg'
            bannerDetails.image = image
       
    
        await bannerinfo.insertMany([bannerDetails])
    
    
        res.redirect('/Banner')
    } catch (error) {
        console.log(error)
        next()
    }
}
        
const desableBanner=async function(req,res,next){
  bannerDesableStatus=req.params.id

  await bannerinfo.updateOne({_id:bannerDesableStatus},{$set:{status:false}})
    res.redirect('/Banner')
}

const enableBanner=async function(req,res,next){
    bannerEnableStatus=req.params.id

    await bannerinfo.updateOne({_id:bannerEnableStatus},{$set:{status:true}})

    res.redirect("/Banner")
}
const adminCoupon=async function(req,res,next){
    try {
        
           const couponData=await couponinfo.find()
       
           res.render('coupon',{couponData})
        
    } catch (error) {
        console.log(error)
        next()
    }
}
const addCoupon=async function(req,res,next){
    try {
        
        const couponDetaile=req.body
        console.log(couponDetaile);
        await  couponinfo.insertMany([couponDetaile])
        
            res.redirect('/coupon')
    } catch (error) {
        console.log(error)
        next()
    }
}
const statusOrder=async function(req,res,next){

    const statusOrder=req.params.id

    
const orderConfirmed=await orderinfo.updateOne({_id:statusOrder},{$set:{orderStatus:"Order Confirmed"}})


req.session.orderConfirmed=orderConfirmed

    res.redirect('/adminOrderedProduct')
  }

 const  editCoupon=async function(req,res,next){

    let coupondatas=req.params.id
    req.session.coupondatas=coupondatas

const couponupdate=await couponinfo.find({_id:coupondatas})




    res.render('couponEdit',{couponupdate})
}
    
const proceedCouponUpdate=async function(req,res,next){
let coupondatas=req.session.coupondatas
    await couponinfo.updateOne({_id:coupondatas},{$set:{

   couponCode:req.body.couponcode,
   discountPrice:req.body.discountprice,
   createDate:req.body.createdate,
   MinimumPrice:req.body.minimumprice,
   expireDate:req.body.expiredate,
   discountType:req.body.discounttype

    }})
    res.redirect('/coupon')
  }



module.exports = {
    adminlogin,
    adminhome,
    adminloginvalidationpost,
    adminlogout,
    productadd,
    newproductpost,
    productall,
    productdelete,
    productedit,
    editexistproductpost,
    categoryadd,
    newcategoryaddpost,
    addsubcategory,
    newsubcategorypost,
    manageuser,
    block,
    unblock,
    // deleteOne,
    desable,
    enable,
    subdesable,
    subenable,
    productRedirct,
    orderManagemnt,
    orderProductDetail,
    adminOrderView,
    bannerAdmin,
    addBanner,
    desableBanner,
    enableBanner,
    adminCoupon,
    addCoupon,
    statusOrder,
    editCoupon,
    proceedCouponUpdate
}