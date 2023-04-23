const mongoose = require('mongoose')
const otpvalidation = require('./otp')
const otpval = require('./otp')
// const { search } = require('../routes/users')
const { categoryadd } = require('./admincontroller')
const { Grant } = require('twilio/lib/jwt/AccessToken')
const { checkout } = require('../routes/admin')
const { uuid } = require('uuidv4')
const userinfo = require('../model/usermodel').usersignin
const productinfo = require('../model/productmodel').addnewproduct
const categoryinfo = require('../model/categorymodel').addnewcategory
const cartInfo = require('../model/cartModel').addToCart
const addressinfo = require('../model/addressModel').addnewAddress
const orderinfo = require('../model/orderModal').orderManagement
const bannerinfo = require('../model/bannerModel').addBanner
const couponinfo = require('../model/couponModel').adminCoupon
const wishlistinfo=require('../model/wishListModel').addToWishList
const reviewinfo=require('../model/review').productReview
const Razorpay = require('razorpay')
const crypto = require('crypto')
const { ObjectId } = require('mongodb')
const multer=require('multer')
let orders
let hmac = crypto.createHmac('sha256', 'process.env.RAZORPAY_SECRET_KEY')
require('dotenv').config()
let random
let user
let data
// let sessionName
// let msg
// let addressPage
// let productCart





var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const usersignup = function (req, res, next) {
  try {

    res.render('signup')
  } catch (error) {

    console.log(error)
    next()
  }
}
const userlogin = async function (req, res, next) {
  try {
    let msg = req.session.msg
    user = req.session.user
    // if (user) {
    //   res.redirect('/')

    // } else {

    res.render('userlogin', { msg })
    msg = null

    // }
  } catch (error) {
    console.log(error)
    next()
  }

}
const userhome = async function (req, res, next) {
  try {
    let user = req.session.user
    let newProduct = await productinfo.find().limit(4)
    let addBanner = await bannerinfo.find().skip(1).toArray()
    let defaultImage = await bannerinfo.find().limit(1).toArray()

    defaultImage = defaultImage[0]
    res.render('userhome', { newProduct, user, addBanner, defaultImage })



  } catch (error) {
    console.log(error)
    next()
  }
}

const usershop = async function (req, res, next) {
  try {

    let selectone = req.session.selectone
    let lowToHighSort = req.session.lowToHighSort
    let highToLowSort = req.session.highToLowSort
    let newestFirst = req.session.newest
    let oldestSort = req.session.oldest
    let priceSortOne = req.session.priceSortOne
    let priceSortTwo = req.session.priceSortTwo
    let priceSortThree = req.session.priceSortThree
    let priceSortFour=req.session.priceSortFour
    let shopProducts=req.session.shopProducts
    let pages=req.session.pages
    // let pageNum=req.session.pageNum
    // let perpage=req.session.perpage

    let categoryFetch = await categoryinfo.find({ status: true })



    const categoryProduct = await productinfo.find()



    if (selectone == null || selectone == "allcategory") {
      let addnew = await productinfo.find()
      if(shopProducts){
        addnew=shopProducts
      }
      if (priceSortOne) {
        addnew = priceSortOne
        req.session.priceSortOne = null
      }
      if (priceSortTwo) {
        addnew = priceSortTwo
        req.session.priceSortTwo
      }
      if (priceSortThree) {
        addnew = priceSortThree
        req.session.priceSortThree = null
      }
      if(priceSortFour){
        addnew=null
        req.session.priceSortFour=null
      }
      if (lowToHighSort) {
        addnew = lowToHighSort
        req.session.lowToHighSort = null

      }
      if (highToLowSort) {
        addnew = highToLowSort
        req.session.highToLowSort = null

      }
      if (newestFirst) {
        addnew = newestFirst
        req.session.newest = null
      }
      if (oldestSort) {
        addnew = oldestSort
        req.session.oldest = null
      }
      

      req.session.addnew = addnew

      res.render('shop', { addnew, categoryFetch, lowToHighSort, highToLowSort,shopProducts,pages })
    } else {

      const addnew = await productinfo.find({ category: selectone })
      res.render('shop', { addnew, categoryFetch, lowToHighSort, highToLowSort,pages })
    }
  } catch (error) {
    console.log(error)
    next()

  }
}
const selectcategory = async function (req, res, next) {
  try {
    let selectone = req.params.category
    req.session.selectone = selectone
    res.redirect('/shop')

  } catch (error) {
    console.log(error)
    next()
  }
}

const userwishlist =async function (req, res, next) {
  try {

    user=req.session.user

    let wishlistDisplay=await wishlistinfo.aggregate([{$match:{user:user.name}},{$unwind:"$wishlistProduct"},{$project:{productId:"$wishlistProduct.productId"}},
  {
    $lookup:{
      from:"productdatas",
      localField:"productId",
      foreignField:"productId",
      as:"wishlistProducts"
    }
  },
    {
      $project:{productId:"$wishlistProduct.productId",wishlistProductView:{$arrayElemAt:["$wishlistProducts",0]}}
    },
  ]).toArray()

    res.render('wishlist',{wishlistDisplay})

  } catch (error) {
    console.log(error)
    next()
  }
}
const usercart = async function (req, res, next) {
  try {
    let couponId = req.session.coupon

    user = req.session.user.name
    let stockmsg = req.session.stockmsg
    // if (user) {
    let productCart = await cartInfo.aggregate([
      {

        $match: { user: user }
      },
      { $unwind: '$product' },

      { $project: { item: "$product.item", quantity: "$product.quantity" } },

      {
        $lookup: {
          from: "productdatas",
          localField: "item",
          foreignField: "productId",
          as: "products"
        }
      },
      { $project: { item: 1, quantity: 1, product: { $arrayElemAt: ['$products', 0] } } }
    ]).toArray()
    req.session.productCart = productCart
    

    for (var i = 0; i < productCart.length; i++) {
      totalPrice = productCart[i].quantity * productCart[i].product.price
    
      productCart[i].totalPrice = totalPrice
    }
    let grand_Total = 0
    for (i = 0; i < productCart.length; i++) {
      grand_Total += productCart[i].totalPrice
      req.session.grand_Total = parseInt(grand_Total)
    }
    let couponsId = req.session.coupon

    if (couponsId) {
      let couponVal = await couponinfo.find({ couponCode: couponsId })

      minimum = couponVal[0].MinimumPrice
      var couponerr = "placed by upto" + minimum
      couponerr = null
      if (grand_Total < minimum) {

      } else {
        console.log(couponVal);
        grand_Total -= couponVal[0].discountPrice
        couponerr = "coupon addedd successfully"
       

        await userinfo.updateOne({ name: user }, { $addToSet: { usedCoupon: couponId } })

        let couponTotal = couponVal[0].discountPrice


        req.session.couponTotal = couponTotal

      }
    }

    let couponerror = req.session.couponError

    let couponerror1 = req.session.couponerror1
 




    res.render('cart', { productCart, grand_Total, couponerror, couponerr, couponerror1, stockmsg })
    req.session.couponError=null
    req.session.couponerror1=null
    stockmsg = null
    req.session.couponError=null

    
  }
  // }
  catch (error) {
    console.log(error)
    next()

  }

}

const usercheckout = async function (req, res, next) {
  try {
    let grand_Total = req.session.grand_Total
    let productCart = req.session.productCart
    let couponTotal = req.session.couponTotal
    let addressPage = req.session.passAdd
    let addressIndex=req.query.index
    const user1 = req.session.user
    user = req.session.user.name
    let wall=await userinfo.findOne({name:user})
    let walletPass=wall.wallet
    // checkoutaProducts=req.params.id
    const addressPage1=  await addressinfo.find({ user: user })






    if (user) {
      let userCheck = await addressinfo.aggregate([{$match:{user: user }},{$unwind:"$address"}])
      

      if (userCheck == null) {
        res.redirect('/profile')
      } else {
        if (addressPage) {
          addressDetail = addressPage[0]
          addressPage = null
          
        } 
        else  {
          addressDetail = userCheck[0]

        }
        let walletPrice=await userinfo.findOne({name:user})

        let price=walletPrice.wallet

        let finalAmout=grand_Total

        if(price>finalAmout){
          price-=finalAmout
          req.session.walletPrice=price
          
          finalAmout=price
        }
        if(grand_Total>walletPass){

          walletPass=0
        }
        
        if (couponTotal) {
          grand_Total = 0
          for (var i = 0; i < productCart.length; i++) {
            totalPrice = productCart[i].quantity * productCart[i].product.price
            productCart[i].totalPrice = totalPrice
            grand_Total += totalPrice
          }
          grand_Total -=couponTotal

        } else {

          grand_Total = 0
          for (var i = 0; i < productCart.length; i++) {
            totalPrice = productCart[i].quantity * productCart[i].product.price
            productCart[i].totalPrice = totalPrice
            grand_Total += totalPrice
          }
        }
        const paymentTotal = grand_Total
        req.session.paymentTotal = paymentTotal
        res.render('checkout', { addressDetail, userCheck, productCart, grand_Total, user1, addressPage,addressPage1,walletPass })

      }
    } else {
      res.redirect('/login')
    }
    // const cartProductDetails=await productinfo.findOne({_id:checkoutaProducts})
  } catch (error) {

    console.log(error)
    next()

  }

}
const userprofile = async function (req, res, next) {
  try {
    let userProfile = req.session.user.name
    const profileDetail = await userinfo.find({ name: userProfile })
    const walletAmount=await userinfo.find({name:req.session.user.name})
    console.log(walletAmount);
    const wallet1=walletAmount[0].wallet
    res.render('profile', { profileDetail,wallet1 })
  
  } catch (error) {
    console.log(error)
    next()
  }
}

const usersignupval = async function (req, res, next) {
  try {

    data = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      confirmpassword: req.body.confirm,
      status: true,
      wallet:0
    }
    random = Math.floor(Math.random() * 9000) + 10000
    const email = req.body.email

    if (email) {
      otpvalidation(email, random)
    }

    let signupval = await userinfo.findOne({ name: data.name })

    if (signupval || data.password != data.confirmpassword) {
      res.redirect('/signup')

    } else {


      res.redirect('/signupotp')
    }
  } catch (error) {

    console.log(error)

  }
}
const userlogout = function (req, res, next) {
  try {
    req.session.user = null
    res.redirect('/login')

  } catch (error) {
    console.log(error)
    next()
  }
}

const signupotp = function (req, res, next) {

  try {
    user = req.session.user
    if (user) {
      res.redirect('/')


    } else {

      res.render('signupotp')
    }

  } catch (error) {
    console.log(error)
    next()
  }
}

const confirmotppost = async function (req, res, next) {
  try {
    if (req.body.signupotp == random) {

      userinfo.insertMany([data])
      req.session.user = data
      res.redirect('/')
    } else {
      res.redirect('/signupotp')
    }
  } catch (error) {
    console.log(error)
    next()
  }

}
const userloginval = async function (req, res, next) {
  try {
    
    const userloginvalidation = {
      name: req.body.name,
      password: req.body.password
    }
    let userloginfo = await userinfo.findOne({ name: userloginvalidation.name })
  
    let userstatus = await userinfo.findOne({ name: userloginfo.name, status: false })
  
    if (userloginfo == null || userstatus) {
      let msg = "User is Blocked"
  
      req.session.msg = msg
  
      res.redirect('/login')
  
    } else {
  
      if (userloginvalidation.password == userloginfo.password) {
        req.session.user = userloginfo
        sessionName = userloginfo.name
  
        req.session.sessionName = sessionName
  
        res.redirect('/')
      } else {
        res.redirect('/login')
  
      }
    }
  } catch (error) {
    
    next()
    
  }





}
const loginphone = function (req, res, next) {
  try {
    res.render('loginnumber')

  } catch (error) {
    console.log(error)
    next()
  }
}
const otplogin = function (req, res, next) {

  try {
    let errmsg = req.session.errmsg
    res.render('loginotp', { errmsg })
    errmsg = null

  } catch (error) {

    console.log(error)
    next()

  }

}
const loginuserone = function (req, res, next) {
  try {

    res.redirect('/loginnumber')
  } catch (error) {
    console.log(error)
    next()
  }

}
const userphoneconfirmationpost = function (req, res, next) {
  try {
    random = Math.floor(Math.random() * 9000) + 10000
    const email = req.body.email
    req.session.random = random

    if (userotpconfirmationpost) {
      otpvalidation(email, random)
      res.redirect('/loginotp')
    }

  } catch (error) {
    console.log(error)
    next()
  }
}
const userotpconfirmationpost = function (req, res, next) {
  try {
    const loginotp = req.body.loginotp
    const random = req.session.random

    if (loginotp == random) {

      res.redirect('/')
    } else {
      res.redirect('/loginotp')
      let errmsg = "invalid otp"
      req.session.errmsg = errmsg
    }

  } catch (error) {
    console.log(error)
    next()

  }
}

const productDetaile = async function (req, res, next) {
  try {
    const productview = req.session.productview
    const reviewProuctFindId=productview[0]._id 
    // const exstReview=req.session.exstReview
    user=req.session.user
   
   
     const reviewProduct=await reviewinfo.find({productId:reviewProuctFindId})
     const relatesProduct=await productinfo.find({}).skip(2).limit(4)

     res.render('productDetailes', { productview,user,reviewProduct ,reviewProuctFindId,relatesProduct})
  } catch (error) {
   
    next()
  }


}
const productAccsessget = async function (req, res, next) {
  try {
    const search = req.params.id
    req.session.search=search
   
    let productview = await productinfo.find({ _id: search })

    req.session.productview = productview

    res.redirect('/productDetails')

  } catch (error) {
  
    next()

  }
}
const cartManage = async function (req, res, next) {
  try {

    usersession = req.session.user
    if (usersession == null) {
      res.redirect('/login')
    } else {
      const proId = req.params.id
      let userId = req.session.user.name
      const proObj = {
        item: proId,
        quantity: 1
      }
      const userCart = await cartInfo.findOne({ user: userId })
      if (userCart) {
        let proExist = await cartInfo.findOne({ $and: [{ user: userId }, { "product.item": proId }] })
       
        if (proExist != null && proExist != "") {
          await cartInfo.updateOne({ "product.item": proId }, { $inc: { 'product.$.quantity': 1 } })

        } else {
          await cartInfo.updateOne({ user: userId }, { $push: { product: proObj } })
        }
      } else {
        let cartObj = {
          user: userId,
          product: [proObj]
        }
        await cartInfo.insertMany([cartObj])

      }
      res.redirect('/cart')
    }
  } catch (error) {
    console.log(error)
    next()
  }
}
const cartRemove = async function (req, res, next) {
  try {
    const cartId = req.params.id
    await cartInfo.updateOne({ user: req.session.user.name }, { $pull: { product: { item: cartId } } })
    res.redirect('/cart')

  } catch (error) {
    console.log(error)
    next()
  }
}
const changeQuantity = async function (req, res, next) {

  
  try {
    let productCart = req.session.productCart
    user = req.session.user.name
    cartItem = req.body
    cartItem.count = parseInt(cartItem.count)


    for (i = 0; i < productCart.length; i++) {
      if (productCart[i]['item'] == cartItem.product) {
        productCart[i]['quantity'] = productCart[i]['quantity'] + cartItem.count
      }
    }

    const cartQauntity = await cartInfo.findOneAndUpdate({ $and: [{ user: user }, { 'product.item': cartItem.product }] },
      { $inc: { 'product.$.quantity': cartItem.count } })
    let cartElements = []
    for (i = 0; i < cartQauntity.value.product.length; i++) {
      let cart = cartQauntity.value.product[i]
      const productData = await productinfo.findOne({ productId: cart.item })
      req.session.productData = productData
      let quantity

      if (cart.item == cartItem.product) {
        quantity = cart.quantity + cartItem.count
      }
      else {
        quantity = cart.quantity
      }
      let cartObj = {
        product: cart.item,
        quantity: quantity,
        price: productData.price,
        finalPrice: quantity * productData.price
      }
      cartElements.push(cartObj)
      req.session.quantity = quantity

    }
    let productData = req.session.productData
    let qaunt = req.session.quantity
    let stock = productData.stock
    let stockmsg
    let stockmessage
    if (qaunt <= stock) {

      carterror = null
      req.session.stockmsg = ""

    } else {
      stockmsg = "out of stock"
      req.session.stockmsg = stockmsg
    }
    if(stock==0){
      stockmessage="The stock is zero"
    }
    


    res.json({
      status: true,
      cartElements: cartElements,
      stock: carterror,
      stockmsg:stockmsg,
      stockmessage:stockmessage
    })

  } catch (error) {

    console.log(error)
    next()

  }
}
const userCheckout = function (req, res, next) {

  try {

    res.redirect('/checkout')
  } catch (error) {
    console.log(error)
    next()
  }

}

const AddressManage = async function (req, res, next) {
  try {
    user = req.session.user.name

    let addressPage = await addressinfo.find({ user: user })

    req.session.addressPage = addressPage
    res.render('userAddress', { addressPage })

  } catch (error) {
    console.log(error)
    next()
  }
}

const userAddress = async function (req, res, next) {
  try {

    user = req.session.user.name
    let details = req.body
    details.id = uuid()


    let userExt = await addressinfo.findOne({ user: user })
    if (userExt == null) {

      await addressinfo.insertMany([{ user: req.session.user.name, address: details }])

    } else {
      await addressinfo.updateOne({ user: user }, { $push: { address: details } })
    }




    res.redirect('/checkout')
  } catch (error) {

    console.log(error)
    next()
  }
}
const savedAddress = async function (req, res, next) {
  try {
    user = req.session.user.name
    const passId = req.query.index
    const passId2 = req.query.id
    req.session.passId2 = passId2


    
    let passAdd = await addressinfo.aggregate([{ $match: { user: user } }, { $unwind: "$address" }, { $match: { "address.id": passId2 } }])
  
    req.session.passAdd = passAdd

    res.redirect('/checkout')

  } catch (error) {
    console.log(error)
    next()
  }
}
const placeorder = async function (req, res, next) {
  try {
    user=req.session.user
    let productCart = req.session.productCart
    let orders=req.session.orders



    await orderinfo.insertMany([orders])
    await cartInfo.deleteOne({ user: req.session.user.name })

   


    for (i = 0; i < productCart.length; i++) {
      let quant = -productCart[i].quantity
      let proId = productCart[i].item
      await productinfo.updateOne({ productId: proId }, { $inc: { stock: quant } })
    }
    res.render('placeOrder')

  } catch (error) {
    console.log(error)
    next()
  }
}
const proceed = async function (req, res, next) {
  try {
    //  let grand_Total=req.session.grand_Total
    let productCart = req.session.productCart
    let paymentTotal = req.session.paymentTotal
    let userCoupon=req.session.couponcode
    user = req.session.user.name

    let status = req.body.paymentmethod === "COD" ? "orderConfirmed" : "orderConfirmed"

    let delivery = {

      name: req.body.name,
      housename: req.body.housename,
      citte: req.body.state,
      couy: req.body.city,
      stantry: req.body.country,
      postalCode: req.body.postalcode,
      email: req.body.email,
      phone: req.body.phone,

    }

    payment = req.body.paymentmethod,
      grand_Total = paymentTotal
   
    user = req.session.user
    products = productCart
    usedCoupon= userCoupon
    orderdate = new Date().toLocaleString()
    let delDate = new Date()
    let deliveryDate = new Date(delDate.setDate(delDate.getDate() + 7)).toLocaleString()
    status = status
    let orderId = uuid()

    if (payment === "onlinepayment") {
      


      orders = {
        deliveryAddress: delivery,
        paymentMethod: payment,
        grandTotal: paymentTotal,
        orderedUser: user,
        products: products,
        date: orderdate,
        orderStatus: status,
        deliveryDate: deliveryDate,
        userUsedCoupon: userCoupon

      }
      var options = {
        amount: grand_Total * 100,
        currency: "INR",
        receipt: "" + orderId
      }

      instance.orders.create(options,async  function (err, order) {
        
        if (err) {
          console.log(err);
        } else {
          req.session.orders=orders
          // await orderinfo.insertMany([orders])
          res.json({ status: true, order: order })
        }
      })
    } else if (payment==="COD"){
      await orderinfo.insertMany([{ deliveryAddress: delivery, paymentMethod: payment, grandTotal: paymentTotal, orderedUser: user, products: products, date: orderdate, orderStatus: status, deliveryDate: deliveryDate , userUsedCoupon: userCoupon}])
      await orderinfo.updateOne({$set:{userUsedCoupon:userCoupon}})

      res.json({ status: false })
    }else if (payment==="wallet"){
      await orderinfo.insertMany([{ deliveryAddress: delivery, paymentMethod: payment, grandTotal: paymentTotal, orderedUser: user, products: products, date: orderdate, orderStatus: status, deliveryDate: deliveryDate , userUsedCoupon: userCoupon}])
      await userinfo.updateOne({name:req.session.user.name},{$set:{wallet:price}})
     res.json({status:false})
    }else{

    }
    let price=req.session.walletPrice
   
   
  } catch (error) {
    console.log(error)
    next()
  }
}
const userOrder = async function (req, res, next) {
  try {
    const orderId = req.session.user._id
    const addReturnField=req.session.addReturnField
    
    const userOrders = await orderinfo.aggregate([{ $match: { orderedUser: orderId } },{$sort:{_id:-1}}])
     const returnConfirmation=await orderinfo.find()
    res.render("userOders", { userOrders,addReturnField })
    
  } catch (error) {
    next()
  }
}

const editProfile = async function (req, res, next) {
  try {
    
    const editProfileGet = req.session.user.name
    const profileEdit = await userinfo.find({ name: editProfileGet })
  
    res.render('editProfile', { profileEdit })
  } catch (error) {
    next()
  }
}

const updateProfile = async function (req, res, next) {
  try {
    
    user = req.session.user.name
    await userinfo.updateOne({ name: user }, {
      $set: {
        // name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
  
  
      }
    })
    res.redirect('/profile')
  } catch (error) {
    next()
  }
}
const extAddressEdit = async function (req, res, next) {
  try {

    user = req.session.user.name
    const addressEdit = req.session.user.addressEditId


    const adressEditExt = await addressinfo.aggregate([{$match:{user:user}},{$unwind:"$address"},{$match:{"address.id":addressEdit}}])
    res.render('editAddress', { adressEditExt })

  } catch (error) {
    console.log(error)
    next()
  }
}
const existAddress = async function (req, res, next) {
  try {
    user = req.session.user.name
    const addressEditId=req.params.id

    const addressEdit = await addressinfo.findOne({user:user})
  
    req.session.user.addressEditId = addressEditId
    res.redirect('/addressEdit')

  } catch (error) {
    console.log(error)
    next()
  }
}

const addressDelete = async function (req, res, next) {
  try {

    const addressDel = req.params.id

    await addressinfo.updateOne({ user: req.session.user.name }, { $pull: { address: { id: addressDel } } })


    res.redirect('/checkout')
  } catch (error) {

  }
}
const addressUpdate = async function (req, res, next) {
  try {
    user = req.session.user.name
    const editUserAddress = req.session.user.addressEditId

   

    await addressinfo.updateOne({ user: user, address: { $elemMatch: { id: editUserAddress } } },
      {
        $set:

        {
          "address.$.name": req.body.housename,
          "address.$.city": req.body.city,
          "address.$.state": req.body.state,
          "address.$.country": req.body.country,
          "address.$.postalcode": req.body.postalcode


        }
      })

    res.redirect('/checkout')

  } catch (error) {
    console.log(error)
    next()
  }
}

const search = async function (req, res, next) {
  try {
    
    let payload = req.body.payload.trim()
    let search = await productinfo.find({ productName: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
    search = search.slice(0, 10);
    res.send({ payload: search })
  } catch (error) {
    next()
  }

}
const applyCoupon = async function (req, res, next) {

  try {
    
    const couponId = req.body.couponcode
  
    req.body.couponcode=couponId
    user = req.session.user.name
    
    let usedCouponCheck = await userinfo.find({ name: user, usedCoupon: { $in: [couponId] } })
    
 
    if (usedCouponCheck=="") {
  
      let couponCheck = await couponinfo.findOne({ couponCode: couponId })
  
  
      await userinfo.updateOne({ name: user }, { $push: { usedCoupon: couponId } })
  
      if (couponCheck) {
        const date = new Date().toISOString().slice(0,10)
        
        
  
        if (date < couponCheck.expireDate) {
          req.session.coupon = couponId
         
          // await userinfo.updateOne({name:user},{$set:{userUsedCoupon:couponId}})
        } else  {
        let   couponError = "Coupon is alredy expierd"
          req.session.couponError = couponError
          couponError=null
          req.session.couponError=null
          
        }
      } else {
       let  couponError = "invalid Coupon code"
        req.session.couponError = couponError
       
      
      }
    } else {
      couponerr = "This coupon is alredy used"
      req.session.couponerror1 = couponerr
  
    }
  
  
    res.redirect('/cart')
  } catch (error) {
    next()
  }
  
}

const paymentVerification = async function (req, res, next) {
  try {

    user = req.session.user
    let userCoupon=req.session.couponcode
    // let orders=req.session.orders
  
    if (user) {
      raz = req.body
  
      hmac.update(raz['payment[razorpay_order_id]'] + '|' + raz['payment[razorpay_payment_id]'])
      hmac = hmac.digest('hex')
      if (hmac == raz['payment[razorpay_signature]']) {
       let order = orders
  
        order.orderdate = new Date()
        order.orderdate = order.orderdate.toLocalString()
        let dt = new Date()
        order.deliveryDate = new Date(dt.setDate(dt.getDate() + 7))
        order.deliveryDate = order.deliveryDate.toLocalString()
        order.products[0].product.paymentId = uuid()
  
  
        for (i = 0; i < products[0].product.length; i++) {
          order.products[0].product[i].paymentId = req.body['payment[razorpay_payment_id]']
  
        }
        await orderinfo.insertMany([orders])
        await orderinfo.update({user:req.session.user},{$set:{userUsedCoupon:userCoupon}})
        await cartInfo.deleteOne({ user: req.session.user.name })
        req.session.user.order = null
        res.json({ PaymentSuccsess})
      } else {
  
      }
      
      res.redirect('/')
    }
  } catch (error) {
    console.log(error);
    next()

  }
}
// const userProducrOrderGet =async function (req, res, next) {
//   try {
//     const orderedId = req.query._id
//     console.log(orderedId);
//    const orderId=req.query.orderedUser
//    console.log(orderId);
//    user=req.session.user.name
  
//     let userOrderDelivered=await orderinfo.find({})
  
//     let userOrderDeliveredId=userOrderDelivered.orderStatus
//    const productUserData = await orderinfo.aggregate([{$unwind:"$products"},{$match:{orderedUser:orderId}},{$project:{product:"$products.product"}},{$match:{_id:new ObjectId(orderedId)}}])
//    console.log(productUserData);
//     res.render("userOrderDetails", { productUserData,userOrderDeliveredId,userOrderDelivered })
    
//   } catch (error) {
//     next()
//   }

  

// }
const userProductOrder = async function (req, res, next) {
try {
  
  const orderedId = req.query._id
   
   const orderId=req.query.orderedUser
   
   user=req.session.user.name
  
    let userOrderDelivered=await orderinfo.find({orderedUser:orderId,_id:new ObjectId(orderedId)})
  
    let userOrderDeliveredId=userOrderDelivered.orderStatus
   const productUserData = await orderinfo.aggregate([{$unwind:"$products"},{$match:{orderedUser:orderId}},{$project:{product:"$products.product"}},{$match:{_id:new ObjectId(orderedId)}}])
    
  
    res.render("userOrderDetails", { productUserData,userOrderDeliveredId,userOrderDelivered })
  
} catch (error) {
  next()
}

}
const lowToHighSort = async function (req, res, next) {
  try {
    const lowToHighSort = await productinfo.find().sort({ price: 1 })
    req.session.lowToHighSort = lowToHighSort
   
  
    res.redirect('/shop')
    
  } catch (error) {
    next()
  }
}

const highToLowSort = async function (req, res, next) {
try {
  
  const highToLowSort = await productinfo.find().sort({ price: -1 })
  
  req.session.highToLowSort = highToLowSort
  
  res.redirect('/shop')
} catch (error) {
  next()
}

}

const newestFirst = async function (req, res, next) {
  try {
    
    const newest = await productinfo.find().sort({ _id: -1 })
    req.session.newest = newest
  
    res.redirect('/shop')
  } catch (error) {
    next()
  }
}
const oldestSort = async function (req, res, next) {
  try {
    
    const oldest = await productinfo.find().sort({ _id: 1 })
  
    req.session.oldest = oldest
    res.redirect('/shop')
  } catch (error) {
    next()
  }
}
const priceSortOne = async function (req, res, next) {

  try {
    
    const priceSortOne = await productinfo.find({ price: { $gte: 0, $lte: 1000 } })
    req.session.priceSortOne = priceSortOne
    res.redirect('/shop')
  } catch (error) {
    next()
  }

}
const priceSortTwo = async function (req, res, next) {
  try {
    
    const priceSortTwo = await productinfo.find({ price: { $gte: 1000, $lte: 5000 } })
    req.session.priceSortTwo = priceSortTwo
    res.redirect('/shop')
  } catch (error) {
    next()
  }
}
const priceSortThree = async function (req, res, next) {
  try {
    
    const priceSortThree = await productinfo.find({ price: { $gte: 5000, $lte: 10000 } })
    req.session.priceSortThree = priceSortThree
    res.redirect('/shop')
  } catch (error) {
    next()
  }
}

const priceSortFour=async function(req,res,next){
  try {
    
    const priceSortFour = await productinfo.find({ price: { $gte: 10000 } })
  req.session.priceSortFour=priceSortFour
    res.redirect('/shop')
  } catch (error) {
    next()
  }
}
const changePage=async function(req,res,next){
  try {
    
    const pageNum=req.query.page
    const perpage=6
  
    const shopProducts=await productinfo.find().skip((pageNum-1)*perpage).limit(perpage)
    
   const shopProductCount=await productinfo.find({}).count()
    const pages=Math.ceil(shopProductCount/perpage)
  
    req.session.shopProducts=shopProducts
    // req.session.pageNum=pageNum
    req.session.pages=pages
    // req
    res.redirect('/shop')
  } catch (error) {
    next()
  }
}
const returnUser=async function(req,res,next){

  try {
    user=req.session.user.name
    const userReturnId=req.params.id

    const walletAmount=req.params.grandTotal

    req.session.walletAmount=walletAmount

    const returnDate=new Date().toLocaleDateString()

    await orderinfo.updateOne({_id:new ObjectId(userReturnId)},{$set:{orderStatus:"returnRequsted"}})
    await orderinfo.updateOne({_id:new ObjectId(userReturnId)},{$set:{returnDate:returnDate}})
    const addReturnField=  await orderinfo.updateOne({_id:new ObjectId(userReturnId)},{$set:{newReturnStats:"returnRequsted"}})

    await userinfo.updateOne({name:user},{$inc:{wallet:walletAmount}})
    
  
  req.session.addReturnField=addReturnField
  req.session.userReturnId=userReturnId
  
    res.redirect('/userOederDetaile')
  } catch (error) {
    next()
  }

}

const cancelOrder=async function(req,res,next){
 user=req.session.user.name
 const cancelOrederId=req.params.id
 const walletAmout=req.params.grandTotal
 const paymentMethod=await orderinfo.findOne({_id:cancelOrederId})
 const payment=paymentMethod.paymentMethod
 
 console.log(payment);

 if(payment=="onlinepayment"||payment=="wallet"){
  await orderinfo.updateOne({_id:new ObjectId(cancelOrederId)},{$set:{orderStatus:"OrderCanceled"}})
   await orderinfo.updateOne({_id:new ObjectId(cancelOrederId)},{$set:{cancelStatus:"OrderCanceled"}})
   await userinfo.updateOne({name:user},{$inc:{wallet:walletAmout}})

 }else{

   await orderinfo.updateOne({_id:new ObjectId(cancelOrederId)},{$set:{orderStatus:"OrderCanceled"}})
   await orderinfo.updateOne({_id:new ObjectId(cancelOrederId)},{$set:{cancelStatus:"OrderCanceled"}})
 }

  res.redirect('/userOederDetaile')
}



const wishlistGet=async function(req,res,next){
  try {
    
    const wishId=req.params.id
    let user=req.session.user.name
  
  
    const userWishlist=await  productinfo.findOne(({_id:wishId}))
  
    if(userWishlist){
      let wishlistProductId=userWishlist.productId
  
  
      let wishlistExt=await wishlistinfo.findOne({user:user})
  
      if(wishlistExt==null){
        let wishlistAdd={
          user:user,
          wishlistProduct:[{productId:wishlistProductId}]
        }
        await wishlistinfo.insertMany([wishlistAdd])
      }else{
        // let wishlistCheck=await  wishlistinfo.find({user:user},{wishlistProduct: {$elemMatch: {productId: wishlistProductId}}}).toArray()

        let wishlistCheck=await wishlistinfo.find({$and:[{user:user},{"wishlistProduct.productId":wishlistProductId}]}).toArray()
      
  
        if(wishlistCheck.length==0){
          await wishlistinfo.updateOne({user:user},{$push:{wishlistProduct:{productId:wishlistProductId}}})
        }
      }
      
      res.redirect('/wishlist')
    }
  } catch (error) {
    console.log(error);
    next()
    
  }


}
const wishProductDel=async function(req,res,next){
  try {
    user=req.session.user.name
      const wishDelId=req.params.id
    
      
     
      await wishlistinfo.updateOne({user:user},{$pull:{wishlistProduct:{productId:wishDelId}}})
    
      res.redirect('/wishlist')
    
  } catch (error) {
    next()
  }
}

const wishListDetail=async function(req,res,next){
  try {
    
    user=req.session.user
    const wishlistProduct=req.params.id
     await productinfo.find({user:user,productId:wishlistProduct})
      res.redirect('/productDetails')
  } catch (error) {
    next()
    
  }
}

const userReview=async function(req,res,next){
  try {
    const submitReview=req.body.review
    user=req.session.user.name
    const search=req.session.search
  
  
  
   const  userReview=await reviewinfo.insertMany([{review:submitReview,user:user,productId:search}])
    
  
     req.session.userReview=userReview
     
  
  
    res.redirect('/productDetails')
    
  } catch (error) {
    next()
  }
}
const userWalletHistory=async function(req,res,next){
  try {
    
    user=req.session.user
   
   const walletDatas= await orderinfo.find({orderedUser:user,orderStatus:"return confirmed"})
  
  
  
    res.render('walletHistory',{walletDatas})
  } catch (error) {
    next()
  }
}
// const wishlistProductView=async function(req,res,next){
//   const wishProductId=req.params.id

//   const wishlistProduct=await productinfo.findOne({productId:wishProductId})
  

//   res.redirect('/productDetails')
// }

module.exports = {
  usersignup,
  userhome,
  usershop,
  userwishlist,
  usercart,
  usercheckout,
  userprofile,
  usersignupval,
  userlogout,
  signupotp,
  // signupotppost,
  confirmotppost,
  userlogin,
  userloginval,
  selectcategory,
  loginphone,
  otplogin,
  loginuserone,
  userphoneconfirmationpost,
  userotpconfirmationpost,
  productDetaile,
  productAccsessget,
  cartManage,
  cartRemove,
  changeQuantity,
  userCheckout,
  AddressManage,
  userAddress,
  savedAddress,
  placeorder,
  proceed,
  editProfile,
  updateProfile,
  extAddressEdit,
  existAddress,
  addressDelete,
  addressUpdate,
  search,
  applyCoupon,
  userOrder,
  paymentVerification,
  userProductOrder,
  // userProducrOrderGet,
  lowToHighSort,
  highToLowSort,
  newestFirst,
  oldestSort,
  priceSortOne,
  priceSortTwo,
  priceSortThree,
  priceSortFour,
  changePage,
  returnUser,
  wishlistGet,
  wishProductDel,
  wishListDetail,
  userReview,
  userWalletHistory,
  cancelOrder
  // wishlistProductView
  






  // categoryall
}