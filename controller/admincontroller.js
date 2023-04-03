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
let id2
let edit
let categorymsg
let productData
require('dotenv').config()


const adminlogin = function (req, res, next) {
    try {
        
        res.render('adminlogin')
    } catch (error) {
        console.log(error.message)
    }

}
const adminhome =async function (req, res, next) {
    try {
        
        res.render('adminhome')
    } catch (error) {
       
    }
}
const productadd = async function (req, res, next) {
    try {
        const categorynew = await categoryinfo.find({ status: true })
        const subcategorynew = await subcategoryinfo.find({ status: true })
        res.render('addproduct', { categorynew, subcategorynew })
    } catch (error) {
        console.log(error.message)
    }

}
const adminlogout = function (req, res, next) {
    try {
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
    }
}
const productall = async function (req, res, next) {
    try {
        let addnew = await productinfo.find()
        res.render('allproducts', { addnew })
        
    } catch (error) {
        console.log(error.message)
    }
}
const productdelete = async function (req, res, next) {
    try {
        let id1 = req.params.id
        await productinfo.deleteOne({ _id: id1 })
    
    
        res.redirect('/allproducts')
        
    } catch (error) {
        console.log(error.message)
    }
}
const productRedirct = async function (req, res, next) {
    try {
        id2 = req.params.id
        edit = await productinfo.findOne({ _id: id2 })
        res.redirect('/editproduct')
    } catch (error) {
        console.log(error.message)
    }
}
const productedit = async function (req, res, next) {
    try {
        const categorynew = await categoryinfo.find({ status: true })
        const subcategorynew = await subcategoryinfo.find({ status: true })
        
    
        res.render("editproduct", {edit, subcategorynew, categorynew })
        
    } catch (error) {
        console.log(error.message)
    }
}

const categoryadd = async function (req, res, next) {
    try {
        const categorynew = await categoryinfo.find()
        res.render('addcategory', { categorynew,categorymsg })
        categorymsg=null
        
    } catch (error) {
        console.log(error.message)
    }
}
const addsubcategory = async function (req, res, next) {
    try {
        const subcategorynew = await subcategoryinfo.find()
        res.render('subcategory', { subcategorynew })
        
    } catch (error) {
        console.log(error.message)
    }

}

const manageuser = async function (req, res, next) {
    try {
        
        const finduser = await userinfo.find()
        res.render('usermanage', { finduser })
    } catch (error) {
        console.log(error.message)
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
        console.log(error.message)
    }
}
const unblock = async function (req, res, next) {
    try {
        unblockstatus = req.params.id
        await userinfo.updateOne({ _id: unblockstatus }, { $set: { status: true } })
        res.redirect('/usermanage')
        
    } catch (error) {
        console.log(error.message)
    }
}
// const deleteOne = async function (req, res, next) {
//     try {
//         userdelete = req.params.id
//         await userinfo.deleteOne({ _id: userdelete })
//         res.redirect('/usermanage')
        
//     } catch (error) {
//         console.log(error.message)
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
                res.redirect('/adminhome')
            } else {
                res.redirect('/admin')
            }
        }
        
    } catch (error) {
        console.log(error.message)
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
                image[i].mv('./public/productimages/' + addproductdata.productId + i + '.jpg')
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
        console.log(error.message)
    }
}

const editexistproductpost = async function (req, res, next) {
    try {
        
        id = req.params.id
        let items = req.body
    
        let image = []
    
        image = req.files.image
        console.log(req.files);
        let imagesize = image.length
    
    
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
        console.log(error.message)
    }
}
const newcategoryaddpost = async function (req, res, next) {
    try {
        
        const addcategorynew = req.body
      const  categoryExist=await categoryinfo.findOne({name:req.body.category})
            if(categoryExist){
                res.redirect('/addcategory')
               categorymsg="Category alredy exist"
            }else{
                 categoryinfo.insertMany({ name: req.body.category, status: true })
            res.redirect('/addcategory')
            }
    } catch (error) {
        console.log(error.message)

    }
 
    
}
const newsubcategorypost = async function (req, res, next) {
    try {
        const addsubcategorynew = req.body
        addsubcategorynew.subName = req.body.subcategory
        await subcategoryinfo.insertMany({ subName: req.body.subcategory, status: true })
    
        res.redirect('/subcategory')
        
    } catch (error) {
        console.log(error.message)
    }
}
const desable = async function (req, res, next) {
    try {
        
        desableStatus = req.params.id
        await categoryinfo.updateOne({ _id: desableStatus }, { $set: { status: false } })
        res.redirect('/addcategory')
    } catch (error) {
        console.log(error.message)

    }
}
const enable = async function (req, res, next) {
    try {
        
        enableStatus = req.params.id
        await categoryinfo.updateOne({ _id: enableStatus }, { $set: { status: true } })
    
        res.redirect('/addcategory')
    } catch (error) {
        console.log(error.message)
    }
}
const subdesable = async function (req, res, next) {
    try {
        
        subdesableStatus = req.params.id
        await subcategoryinfo.updateOne({ _id: subdesableStatus }, { $set: { status: false } })
        res.redirect('/subcategory')
    } catch (error) {
        console.log(error.message)
    }
}
const subenable = async function (req, res, next) {
    try {
        
        subenableStatus = req.params.id
        await subcategoryinfo.updateOne({ _id: subenableStatus }, { $set: { status: true } })
        res.redirect('/subcategory')
    } catch (error) {
        console.log(error.message)
    }
}
const orderManagemnt=async function(req,res,next){
    try {
        
        const findUserDetail=await orderinfo.find()
        
        res.render('adminOrderManagemant',{findUserDetail})
    } catch (error) {
        console.log(error.message)
    }
    

}
const adminOrderView=function(req,res,next){
    try {
        const productData=req.session.productData
        res.render("adminOrderedProduct",{productData})
    } catch (error) {
        console.log(error.message)
    }
    
}

const orderProductDetail=async function(req,res,next){
    try {
        
        
        const orderId=req.params.id
        req.session.orderId=orderId
    
    
     const    productData=await orderinfo.aggregate([{$unwind:"$products"},{$match:{orderedUser:orderId}},{$project:{product:"$products.product"}}])
    req.session.productData=productData
         console.log(productData);
    
    
        res.redirect("/adminOrderedProduct")
    } catch (error) {
        console.log(error.message)
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
        console.log(error.message)
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
 
    const couponData=await couponinfo.find()

    res.render('coupon',{couponData})
}
const addCoupon=async function(req,res,next){
const couponDetaile=req.body
console.log(couponDetaile);
await  couponinfo.insertMany([couponDetaile])

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
    addCoupon
}