const admininfo = require('../model/adminmodel').adminlogin
const productinfo = require('../model/productmodel').addnewproduct
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

        
        let revenue;
        let UserTotalCount=await userinfo.find().count()

        let BannedUser=await userinfo.find({status:false}).count()

        let totalOrder=await orderinfo.find({orderStatus:"Delivered"}).count()
        let pendingOrder=await orderinfo.find({orderStatus:"orderConfirmed"}).count()

        let totalRvenue=await orderinfo.aggregate([{$match:{orderStatus:"Delivered"}},{$group:{_id:null,sum:{$sum:"$grandTotal"}}},{$project:{_id:0}}])
        console.log(totalRvenue[0]);
        if(totalRvenue.length!=0){
             revenue=totalRvenue[0].sum
        }else{
            revenue=0
        }
        res.render('adminhome',{UserTotalCount,BannedUser,totalOrder,revenue,pendingOrder})
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
       
        console.log(req.body);
        addproductdata.productId = uuidv4()
    
    
    
        let image = []
        req.files.forEach(file => {
            
            image.push(file.filename)
        });
        addproductdata.image=image
        // image = req.files.image    
//         let imagesize = image.length
    
//         if (imagesize) {
//             for (i = 0; i < image.length; i++) {

                
//                 let path = "" + image[i].tempFilePath
//                 console.log(path);
//                 await sharp(path)
//                   .rotate()
//                   .resize(1000, 1500)
//                   .jpeg({ mozjpeg: true })
//                   .toFile('./public/productimages/' + addproductdata.productId + i + '.jpg')
//                 image[i] = addproductdata.productId + i + '.jpg'
//             }
//             addproductdata.image = image
//         }
//         else {
//             image.mv('./public/productimages/' + addproductdata.productId + '.jpg')
    
//             image = addproductdata.productId + '.jpg'
//             addproductdata.image = image
//         }
    
        await productinfo.insertMany([addproductdata])
    
    
        res.redirect('/allproducts')
    } catch (error) {
        console.log(error)
        next()
    }
}


const editexistproductpost = async function (req, res, next) {
    try {

        if(req.files){
            const id2=req.session.id2
        
           let id = req.params.id
            let items = req.body
            let editImage=req.files
            let image = []
            req.files.forEach(file => {
                
                image.push(file.filename)
            });
            
           
        
            console.log(image);
            await productinfo.updateOne({ _id: id2 }, {
                $set: {
                    productName: req.body.productname,
                    category: req.body.category,
                    subCategory: req.body.subcategory,
                    price: req.body.price,
                    stock: req.body.stock,
                    brand: req.body.brand,
                    
                    discription: req.body.discription
                }
            })
            await productinfo.updateOne({_id:new ObjectId(id2)},{$push:{"image":image}})
          
            res.redirect('/allproducts')
        }else{
            await productinfo.updateOne({ _id: id2 }, {
                $set: {
                    productName: req.body.productname,
                    category: req.body.category,
                    subCategory: req.body.subcategory,
                    price: req.body.price,
                    stock: req.body.stock,
                    brand: req.body.brand,
                   
                    discription: req.body.discription
                }
            })
            
            res.redirect('/allproducts')
        }
       
    } catch (error) {
        console.log(error)
        next()
    }
}
const newcategoryaddpost = async function (req, res, next) {
    try {
        
       let regex = new RegExp(req.body.category,"i")
        const  categoryExist=await categoryinfo.findOne({name:{$regex:regex}})
        console.log(categoryExist);
            if(categoryExist){
                res.redirect('/addcategory')
             let  categorymsg="Category alredy exist"
             req.session.categorymsg=categorymsg
            }
          
            else{
                 categoryinfo.insertMany({ name: req.body.category, status: true })
                }
                res.redirect('/addcategory')
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
        let categorname=await categoryinfo.find({_id:desableStatus})
       
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
const adminOrderView=async function(req,res,next){
    try {
        const productData=req.session.productData
        const productDataDetails=req.session.productDataDetails
        let orderConfirmed=req.session.orderConfirmed


        const dropDownRemove=await orderinfo.findOne()

        let removeStat=dropDownRemove.orderStatus
      
        if(removeStat=='return confirmed'){
          removeStat=null
          console.log(removeStat);
        }
        req.session.removeStat=removeStat
        
        res.render("adminOrderedProduct",{productData,productDataDetails,orderConfirmed,removeStat})
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
        req.files.forEach(file => {
            
            image.push(file.filename)
        });
        bannerDetails.image=image
        // image=req.files.image
        
        //     image.mv('./public/bannerImages/' + bannerDetails.bannerId + '.jpg')
    
        //     image = bannerDetails.bannerId + '.jpg'
        //     bannerDetails.image = image
       
    
        await bannerinfo.insertMany([bannerDetails])
    
    
        res.redirect('/Banner')
    } catch (error) {
        console.log(error)
        next()
    }
}
        
const desableBanner=async function(req,res,next){
    try {
        
        bannerDesableStatus=req.params.id
      
        await bannerinfo.updateOne({_id:bannerDesableStatus},{$set:{status:false}})
          res.redirect('/Banner')
    } catch (error) {
        next()
    }
}

const enableBanner=async function(req,res,next){
    try {
        bannerEnableStatus=req.params.id
    
        await bannerinfo.updateOne({_id:bannerEnableStatus},{$set:{status:true}})
    
        res.redirect("/Banner")
        
    } catch (error) {
        next()
    }
}
const adminCoupon=async function(req,res,next){
    try {
        let couponerr=req.session.couponerr
           const couponData=await couponinfo.find()
       
           res.render('coupon',{couponData,couponerr})
        
    } catch (error) {
        console.log(error)
        next()
    }
}
const addCoupon=async function(req,res,next){
    try {
        
        const couponDetaile=req.body
        
        const regex=new RegExp(req.body.couponCode,"i")

  const couponExist=await couponinfo.findOne({couponCode:{$regex:regex}})

  if(couponExist){
    res.redirect('/coupon')
    let couponerr="coupon is already exist"

    req.session.couponerr=couponerr
  }else{

      await  couponinfo.insertMany([couponDetaile])
      
          res.redirect('/coupon')
  }
    } catch (error) {
        console.log(error)
        next()
    }
}
const statusOrder=async function(req,res,next){

    try {
        
        const statusOrder=req.params.id
    const orderConfirmed=await orderinfo.updateOne({_id:statusOrder},{$set:{orderStatus:"Order Confirmed"}})
    req.session.orderConfirmed=orderConfirmed
    
        res.redirect('/adminOrderedProduct')
    } catch (error) {
        next()
    }

  }

 const  editCoupon=async function(req,res,next){

    try {
        
        let coupondatas=req.params.id
        req.session.coupondatas=coupondatas
    
    const couponupdate=await couponinfo.find({_id:coupondatas})
        res.render('couponEdit',{couponupdate})
    } catch (error) {
        
    }

}
    
const proceedCouponUpdate=async function(req,res,next){
    try {
        
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
    } catch (error) {
        next()
        
    }
  }
  const adminConfirmReturn=async function(req,res,next){
    try {
        

        const adminRerurnConfirmationId=req.params.id
         
      
          await  orderinfo.updateOne({_id:new ObjectId(adminRerurnConfirmationId)},{$set:{orderStatus:"return confirmed"}})
      
          await orderinfo.updateOne({_id:new ObjectId(adminRerurnConfirmationId)},{$set:{newReturnStats:"retrn confirmed"}})
      
          await orderinfo.updateOne({_id:new ObjectId(adminRerurnConfirmationId)},{$set:{ConfirmReturnStatus:"confirmed"}})

    
          res.redirect('/orderManagement')
    } catch (error) {
        
        next()
    }

}
const deliveredOrder=async function(req,res,next){
    try {
        
        const DeliveredOrderId=req.params.id

        const salesDate=new Date().toLocaleString()
    
        await orderinfo.updateOne({_id:new ObjectId(DeliveredOrderId) },{$set:{orderStatus:"Delivered"}})
    
         await orderinfo.updateOne({_id:new ObjectId(DeliveredOrderId)},{$set:{deliveredStatus:"Delivered"}})

         await orderinfo.updateOne({_id:new ObjectId(DeliveredOrderId)},{$set:{salesDate:salesDate}})
    
        res.redirect('/orderManagement')
    } catch (error) {
        next()
    }

}
const deleteEditImg=async function(req,res,next){
    try {
        
        const editImgDelete=req.query.index
        const editImgDeleteId=req.query.productId
        const image=req.files
    
       await productinfo.updateOne({productId:editImgDeleteId},{$pull:{image:image}})
    
        // const imageEditSelect=editImageFind[editImgDelete]
    
        
    
        res.redirect('/editproduct')
    } catch (error) {
        next()
    } 

}

const salesReport=async function(req,res,next){
    try {
        
        let salesDatas=await orderinfo.aggregate([{$match:{orderStatus:"Delivered"}},{$unwind:"$products"},{$project:{product:"$products.product",quantity:"$products.quantity",totalPrice:"$products.totalPrice",orderedUser:"$orderedUser",grandTotal:"$grandTotal",deliveryDate:"$deliveryDate",salesDate:"$salesDate",user:"$deliveryAddress.name"}}])

        if(req.session.report){
            salesDatas=req.session.report
            res.render('salesReport',{salesDatas})
            req.session.report=null
        }else{

            res.render('salesReport',{salesDatas})
        }
    
    } catch (error) {
        console.log(error);
        next()
    }
 
  }
  const allSalesReport=async function(req,res,next){
    try {
        
        const salesParams=req.query.name
        const startDate=req.query.startDate
        const endDate=req.query.endDate
       
if(startDate&&endDate){


        const startDateObj=new Date(startDate).toLocaleDateString()
        const endDateObj=new Date(endDate).toLocaleDateString()

    //    endDateObj.setDate(endDateObj.getDate()+1)

const wholeSalesReport= await orderinfo.aggregate([
    {
        $unwind: "$products"
    },
    {
        $match: {
            orderStatus: "Delivered",
            salesDate: {
                $gte: startDateObj,
                $lte: endDateObj
            }
        }
    },
    {
        $project: {product: "$products.product",quantity: "$products.quantity",totalPrice: "$products.totalPrice",orderedUser: "$orderedUser",grandTotal: "$grandTotal",deliveryDate: "$deliveryDate",salesDate: "$salesDate",user: "$deliveryAddress.name"}
    }
]);
req.session.report=wholeSalesReport
console.log(wholeSalesReport);

} else if(salesParams=="day"){
            const today=new Date()
            const todayDate=today.toLocaleDateString()
    
            const tomorrow=new Date(today)
            tomorrow.setDate(today.getDate()+1)
            const tomorrowDate=tomorrow.toLocaleDateString()
    
    
    
            const dailySalesReport=await orderinfo.aggregate([{
                $unwind:"$products"
            },
            {
                $match:{orderStatus:"Delivered"}
            },
            {
                $match:{
                    salesDate:{$gte:todayDate,$lte:tomorrowDate}
                }
            },
            {$project:{product:"$products.product",quantity:"$products.quantity",totalPrice:"$products.totalPrice",orderedUser:"$orderedUser",grandTotal:"$grandTotal",deliveryDate:"$deliveryDate",salesDate:"$salesDate",user:"$deliveryAddress.name"}}
        ])
       
    req.session.report=dailySalesReport
    
        }else if(salesParams=="month"){
        
            const currentDate=new Date()
            const currentMonth= currentDate.getMonth()
            const currentYear= currentDate.getFullYear()
    
            const firstDayOfMonth=new Date(currentYear,currentMonth,1).toLocaleDateString()
            const lastDayOfMonth=new Date(currentYear,currentMonth+1,0).toLocaleDateString()
    
    
    
            const monthlySalesReport=await orderinfo.aggregate([{
                $unwind:"$products"
            },
            {
                $match:{orderStatus:"Delivered"}
            },
            {
                $match:{salesDate:{$gte:firstDayOfMonth,$lte:lastDayOfMonth}}
            },
            {$project:{product:"$products.product",quantity:"$products.quantity",totalPrice:"$products.totalPrice",orderedUser:"$orderedUser",grandTotal:"$grandTotal",deliveryDate:"$deliveryDate",salesDate:"$salesDate",user:"$deliveryAddress.name"}}
              
        ])
       
        req.session.report=monthlySalesReport
        }else{
           const  yearlySalesReport=await orderinfo.aggregate([{
            $unwind:"$products"
           },
           {
            $match:{orderStatus:"Delivered"}
           },
           
            {$project:{product:"$products.product",quantity:"$products.quantity",totalPrice:"$products.totalPrice",orderedUser:"$orderedUser",grandTotal:"$grandTotal",deliveryDate:"$deliveryDate",salesDate:"$salesDate",user:"$deliveryAddress.name"}}
           
        ])
        }
    
    
    
        res.redirect('/adminSalesReport')
    } catch (error) {
        next()
    }
   
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
    proceedCouponUpdate,
    adminConfirmReturn,
    deliveredOrder,
    deleteEditImg,
    salesReport,
    allSalesReport
}