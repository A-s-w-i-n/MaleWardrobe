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
const Razorpay = require('razorpay')
const crypto = require('crypto')
const { ObjectId } = require('mongodb')
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

    console.log(addBanner);

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

      res.render('shop', { addnew, categoryFetch, lowToHighSort, highToLowSort,shopProducts })
    } else {

      const addnew = await productinfo.find({ category: selectone })
      res.render('shop', { addnew, categoryFetch, lowToHighSort, highToLowSort })
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
const userabout = function (req, res, next) {
  try {
    res.render('about')

  } catch (error) {
    console.log(error)
    next()
  }
}
const userblog = function (req, res, next) {
  try {
    res.render('blog')

  } catch (error) {
    console.log(error)
    next()
  }
}
const usercontact = function (req, res, next) {
  try {

    res.render('contact')
  } catch (error) {
    console.log(error)
    next()
  }
}
const userwishlist = function (req, res, next) {
  try {
    res.render('wishlist')

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
    console.log(productCart);

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
        couponerr = null

        await userinfo.updateOne({ name: user }, { $addToSet: { usedCoupon: couponId } })

        let couponTotal = couponVal[0].discountPrice

        req.session.couponTotal = couponTotal

        console.log(grand_Total);
      }
    }

    const couponerror = req.session.couponError

    let couponerror1 = req.session.couponerror1
    couponerror1 = null




    res.render('cart', { productCart, grand_Total, couponerror, couponerr, couponerror1, stockmsg })
    stockmsg = null
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

    let passId2 = req.session.passId2
    // checkoutaProducts=req.params.id
    user = req.session.user.name
    const user1 = req.session.user






    if (user) {
      let userCheck = await addressinfo.findOne({ user: req.session.user.name })

      if (userCheck == null) {
        res.redirect('/profile')
      } else {
        if (addressPage) {
          addressDetail = addressPage
          addressPage = null

        } else {
          addressDetail = userCheck.address[0]

        }
        if (couponTotal) {
          grand_Total = 0
          for (var i = 0; i < productCart.length; i++) {
            totalPrice = productCart[i].quantity * productCart[i].product.price
            productCart[i].totalPrice = totalPrice
            grand_Total += totalPrice - couponTotal
          }
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
        res.render('checkout', { addressDetail, userCheck, productCart, grand_Total, user1, addressPage })

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
    res.render('profile', { profileDetail })

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
      status: true
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

    res.render('productDetailes', { productview })
  } catch (error) {
    console.log(error)
    next()
  }


}
const productAccsessget = async function (req, res, next) {
  try {
    const search = req.params.id
    let productview = await productinfo.find({ _id: search })

    req.session.productview = productview

    res.redirect('/productDetails')

  } catch (error) {
    console.log(error)
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
        console.log(proExist);
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

  let productCart = req.session.productCart

  try {
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
    console.log(stock);
    console.log(qaunt);
    if (qaunt <= stock) {

      carterror = null


    } else {
      let stockmsg = "out of stock"
      req.session.stockmsg = stockmsg



    }


    res.json({
      status: true,
      cartElements: cartElements,
      stock: carterror


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
    console.log(details);


    let userExt = await addressinfo.findOne({ user: user })
    if (userExt == null) {

      await addressinfo.insertMany([{ user: req.session.user.name, address: details }])

    } else {
      await addressinfo.updateOne({ user: user }, { $push: { address: details } })
    }




    res.redirect('/userAddress')
  } catch (error) {

    console.log(error)
    next()
  }
}
const savedAddress = async function (req, res, next) {
  try {
    // let addressPage=req.session.addressPage
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

    let productCart = req.session.productCart


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
    user = req.session.user.name

    let status = req.body.paymentmethod === "COD" ? "Pending" : "waiting"
    console.log(req.body);

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
    console.log(grand_Total);
    user = req.session.user
    products = productCart
    orderdate = new Date().toLocaleString()
    let delDate = new Date()
    let deliveryDate = new Date(delDate.setDate(delDate.getDate() + 7)).toLocaleString()
    status = status
    let orderId = uuid()

    if (payment === "onlinepayment") {
      console.log(payment);


      orders = {
        deliveryAddress: delivery,
        paymentMethod: payment,
        grand_Total: paymentTotal,
        orderedUser: user,
        products: products,
        date: orderdate,
        orderStatus: status,
        deliveryDate: deliveryDate
      }
      var options = {
        amount: grand_Total * 100,
        currency: "INR",
        receipt: "" + orderId
      }

      instance.orders.create(options, function (err, order) {
        console.log(order);
        if (err) {
          console.log(err);
        } else {
          orderinfo.insertMany([orders])
          res.json({ status: true, order: order })
        }
      })
    } else {

      await orderinfo.insertMany([{ deliveryAddress: delivery, paymentMethod: payment, grandTotal: paymentTotal, orderedUser: user, products: products, date: orderdate, orderStatus: status, deliveryDate: deliveryDate }])

      res.json({ status: false })
    }
    await cartInfo.deleteOne({ user: req.session.user.name })
  } catch (error) {
    console.log(error)
    next()
  }
}
const userOrder = async function (req, res, next) {
  const orderId = req.session.user._id
  const userOrders = await orderinfo.aggregate([{ $match: { orderedUser: orderId } }])
  res.render("userOders", { userOrders })
}

const editProfile = async function (req, res, next) {
  const editProfileGet = req.session.user.name
  const profileEdit = await userinfo.find({ name: editProfileGet })

  res.render('editProfile', { profileEdit })
}

const updateProfile = async function (req, res, next) {
  user = req.session.user.name
  await userinfo.updateOne({ name: user }, {
    $set: {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone


    }
  })
  res.redirect('/profile')
}
const extAddressEdit = async function (req, res, next) {
  try {

    user = req.session.user.name
    const addressEdit = req.session.user.addressEdit

    const adressEditExt = await addressinfo.findOne({ address: { $elemMatch: { id: addressEdit } } })
    console.log(adressEditExt);

    res.render('editAddress', { adressEditExt })

  } catch (error) {
    console.log(error)
    next()
  }
}
const existAddress = async function (req, res, next) {
  try {
    user = req.session.user.name

    const addressEdit = await addressinfo.findOne({ user: user })
    console.log(addressEdit)
    req.session.user.addressEdit = addressEdit.address[0].id
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


    res.redirect('/userAddress')
  } catch (error) {

  }
}
const addressUpdate = async function (req, res, next) {
  try {
    user = req.session.user.name
    const editUserAddress = req.session.user.addressEdit

    await addressinfo.updateOne({ user: user, "address.id": editUserAddress },
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

    res.redirect('/userAddress')

  } catch (error) {
    console.log(error)
    next()
  }
}

const search = async function (req, res, next) {
  let payload = req.body.payload.trim()
  let search = await productinfo.find({ productName: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
  search = search.slice(0, 10);
  res.send({ payload: search })

}
const applyCoupon = async function (req, res, next) {
  const couponId = req.body.couponcode
  user = req.session.user.name
  console.log(couponId);

  let usedCouponCheck = await userinfo.find({ user: user, usedCoupon: { $in: [couponId] } })

  if (usedCouponCheck) {



    let couponCheck = await couponinfo.findOne({ couponCode: couponId })


    await userinfo.updateOne({ name: user }, { $push: { usedCoupon: couponId } })

    if (couponCheck) {
      const date = new Date().toDateString()

      console.log(date);

      if (date > couponCheck.expireDate) {
        req.session.coupon = couponId

      } else {
        couponError = "invalid Coupon code"
        req.session.couponError = couponError
        couponError = null
      }
    } else {
      couponError = "invalid Coupon code"
      req.session.couponError = couponError
      couponError = null
    }
  } else {
    couponerr = "This coupon is alredy used"
    req.session.couponerror1 = couponerr

  }


  res.redirect('/cart')
}

const paymentVerification = async function (req, res, next) {
  try {

  } catch (error) {

  }
  user = req.session.user

  if (user) {
    raz = req.body

    hmac.update(raz['payment[razorpay_order_id]'] + '|' + raz['payment[razorpay_payment_id]'])
    hmac = hmac.digest('hex')
    if (hmac == raz['payment[razorpay_signature]']) {
      order = orders

      order.orderdate = new Date()
      order.orderdate = order.orderdate.toLocalString()
      let dt = new Date()
      order.deliveryDate = new Date(dt.setDate(dt.getDate() + 7))
      order.deliveryDate = order.deliveryDate.toLocalString()
      order.products[0].product.paymentId = uuid()


      for (i = 0; i < products[0].product.length; i++) {
        order.products[0].product[i].paymentId = req.body['payment[razorpay_payment_id]']

      }
      await orderinfo.insertMany([order])
      await cartInfo.deleteOne({ user: req.session.user.name })
      req.session.user.order = null
      res.json({ PaymentSuccsess })
    } else {

    }
    console.log(req.body);
    res.redirect('/')
  }
}
const userProducrOrderGet = function (req, res, next) {

  let productUserData = req.session.productUserData


  res.render("userOrderDetails", { productUserData })

}
const userProductOrder = async function (req, res, next) {


  const orderedId = req.query._id
  user = req.session.user.name
  // req.session.orderId=orderId

  const productUserData = await orderinfo.aggregate([{ $unwind: "$products" }, { $match: { orderedUser: user } }, { $project: { product: "$products.product" } }, { $match: { _id: new ObjectId(orderedId) } }])

  req.session.productUserData = productUserData

  res.redirect("/userOrderDetails",)
}
const lowToHighSort = async function (req, res, next) {
  const lowToHighSort = await productinfo.find().sort({ price: 1 })
  req.session.lowToHighSort = lowToHighSort
  console.log(lowToHighSort);

  res.redirect('/shop')
}

const highToLowSort = async function (req, res, next) {
  const highToLowSort = await productinfo.find().sort({ price: -1 })

  req.session.highToLowSort = highToLowSort

  res.redirect('/shop')
}
const newestFirst = async function (req, res, next) {
  const newest = await productinfo.find().sort({ _id: -1 })
  req.session.newest = newest

  res.redirect('/shop')
}
const oldestSort = async function (req, res, next) {
  const oldest = await productinfo.find().sort({ _id: 1 })

  req.session.oldest = oldest
  res.redirect('/shop')
}
const priceSortOne = async function (req, res, next) {

  const priceSortOne = await productinfo.find({ price: { $gte: 0, $lte: 1000 } })
  req.session.priceSortOne = priceSortOne
  res.redirect('/shop')
}
const priceSortTwo = async function (req, res, next) {
  const priceSortTwo = await productinfo.find({ price: { $gte: 1000, $lte: 5000 } })
  req.session.priceSortTwo = priceSortTwo
  res.redirect('/shop')
}
const priceSortThree = async function (req, res, next) {
  const priceSortThree = await productinfo.find({ price: { $gte: 5000, $lte: 10000 } })
  req.session.priceSortThree = priceSortThree
  res.redirect('/shop')
}

const priceSortFour=async function(req,res,next){
  const priceSortFour = await productinfo.find({ price: { $gte: 10000 } })
req.session.priceSortFour=priceSortFour
  res.redirect('/shop')
}
const changePage=async function(req,res,next){
  const pageNum=req.query.page
  const perpage=6

  const shopProducts=await productinfo.find().skip((pageNum-1)*perpage).limit(perpage)

  // const pages=Math.ceil(shopProducts/perpage)

  req.session.shopProducts=shopProducts
  // req.session.pageNum=pageNum
  // req.session.perpage=perpage
  // req
  res.redirect('/shop')
}





module.exports = {
  usersignup,
  userhome,
  usershop,
  userabout,
  userblog,
  usercontact,
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
  userProducrOrderGet,
  lowToHighSort,
  highToLowSort,
  newestFirst,
  oldestSort,
  priceSortOne,
  priceSortTwo,
  priceSortThree,
  priceSortFour,
  changePage






  // categoryall
}