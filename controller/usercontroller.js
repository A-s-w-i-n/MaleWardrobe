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
require('dotenv').config()
let random
let selectone
let errmsg
let productview
let user
let sessionName
let msg
let addressPage
let productCart
let grand_Total



var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const usersignup = function (req, res, next) {
  try {

    res.render('signup')
  } catch (error) {

    console.log(error.message)
  }
}
const userlogin = async function (req, res, next) {
  try {

    user = req.session.user
    // if (user) {
    //   res.redirect('/')

    // } else {

    res.render('userlogin', { msg })
    msg = null

    // }
  } catch (error) {
    console.log(error.message)
  }

}
const userhome = async function (req, res, next) {
  try {
    let newProduct = await productinfo.find()
    let addBanner = await bannerinfo.find().skip(1).toArray()
    let defaultImage = await bannerinfo.find().limit(1).toArray()

    console.log(addBanner);

    defaultImage = defaultImage[0]
    res.render('userhome', { sessionName, newProduct, user, addBanner, defaultImage })



  } catch (error) {
    console.log(error.message)
  }
}

const usershop = async function (req, res, next) {
  try {
    

    let categoryFetch = await categoryinfo.find({ status: true })

    if (selectone == null || selectone == "allcategory") {
      let addnew = await productinfo.find()
      res.render('shop', { addnew, categoryFetch })
    } else {
      const addnew = await productinfo.find({ category: selectone })
      res.render('shop', { addnew, categoryFetch })
    }
  } catch (error) {
    console.log(error.message)

  }
}
const selectcategory = async function (req, res, next) {
  try {
    selectone = req.params.category
    res.redirect('/shop')

  } catch (error) {
    console.log(error.message)
  }
}
const userabout = function (req, res, next) {
  try {
    res.render('about')

  } catch (error) {
    console.log(error.message)
  }
}
const userblog = function (req, res, next) {
  try {
    res.render('blog')

  } catch (error) {
    console.log(error.message)
  }
}
const usercontact = function (req, res, next) {
  try {

    res.render('contact')
  } catch (error) {
    console.log(error.message)
  }
}
const userwishlist = function (req, res, next) {
  try {
    res.render('wishlist')

  } catch (error) {
    console.log(error.message)
  }
}
const usercart = async function (req, res, next) {
  try {


    user = req.session.user.name
    // if (user) {
    productCart = await cartInfo.aggregate([
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

    for (var i = 0; i < productCart.length; i++) {
      totalPrice = productCart[i].quantity * productCart[i].product.price
      productCart[i].totalPrice = totalPrice
    }
    grand_Total = 0
    for (i = 0; i < productCart.length; i++) {
      grand_Total += productCart[i].totalPrice
    }
    const couponsId = req.session.coupon

    if (couponsId) {
      let couponVal = await couponinfo.find({ couponCode: couponsId })

      minimum = couponVal[0].MinimumPrice
      var couponerr = "placed by upto" + minimum
      couponerr = null
      if (grand_Total < minimum) {

      } else {
        console.log(couponVal);
        grand_Total -= couponVal[0].discountPrice

        console.log(grand_Total);


      }


    }
    const couponerror = req.session.couponError



    res.render('cart', { productCart, grand_Total, couponerror, couponerr })
  }
  // }
  catch (error) {
    console.log(error.message)

  }

}

const usercheckout = async function (req, res, next) {
  try {

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
        grand_Total = 0
        for (var i = 0; i < productCart.length; i++) {
          totalPrice = productCart[i].quantity * productCart[i].product.price
          productCart[i].totalPrice = totalPrice
          grand_Total += totalPrice
        }

        res.render('checkout', { addressDetail, userCheck, productCart, grand_Total, user1 })

      }
    } else {
      res.redirect('/login')
    }
    // const cartProductDetails=await productinfo.findOne({_id:checkoutaProducts})
  } catch (error) {

    console.log(error.message)

  }

}
const userprofile = async function (req, res, next) {
  try {
    const userProfile = req.session.user.name
    const profileDetail = await userinfo.find({ name: userProfile })
    res.render('profile', { profileDetail })

  } catch (error) {
    console.log(error.message)
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
    const phonenumber = req.body.phone
    if (phonenumber) {
      otpvalidation(phonenumber, random)
    }

    let signupval = await userinfo.findOne({ name: data.name })

    if (signupval || data.password != data.confirmpassword) {
      res.redirect('/signup')

    } else {


      res.redirect('/signupotp')
    }
  } catch (error) {

    console.log(error.message)

  }
}
const userlogout = function (req, res, next) {
  try {
    req.session.user = null
    res.redirect('/login')

  } catch (error) {
    console.log(error.message)
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
    console.log(error.message)
  }
}

const confirmotppost = function (req, res, next) {
  try {
    const signupotp = req.body.signupotp
    if (signupotp == random) {

      userinfo.insertMany([data])
      req.session.user = data
      res.redirect('/')

    }
    else {
      res.redirect('/signupotp')
    }

  } catch (error) {
    console.log(error.message)
  }

}
const userloginval = async function (req, res, next) {
  try {

    const userloginvalidation = {
      name: req.body.name,
      password: req.body.password
    }
    let userloginfo = await userinfo.findOne({ name: userloginvalidation.name })

    let userstatus = await userinfo.findOne({name:userloginfo.name, status: false })
    
    if (userloginfo == null || userstatus) {
      msg = "User is Blocked"

      res.redirect('/login')

    } else {

      if (userloginvalidation.password == userloginfo.password) {
        req.session.user = userloginfo
        sessionName = userloginfo.name

        res.redirect('/')
      } else {
        res.redirect('/login')

      }
    }
  } catch (error) {
    console.log(error.message)
  }


}
const loginphone = function (req, res, next) {
  try {
    res.render('loginnumber')

  } catch (error) {
    console.log(error.message)
  }
}
const otplogin = function (req, res, next) {

  try {
    res.render('loginotp', { errmsg })
    errmsg = null

  } catch (error) {

    console.log(error.message)

  }

}
const loginuserone = function (req, res, next) {
  try {

    res.redirect('/loginnumber')
  } catch (error) {
    console.log(error.message)
  }

}
const userphoneconfirmationpost = function (req, res, next) {
  try {
    random = Math.floor(Math.random() * 9000) + 10000
    const userphonenumber = req.body.phone

    if (userotpconfirmationpost) {
      otpvalidation(userphonenumber, random)
      res.redirect('/loginotp')
    }

  } catch (error) {
    console.log(error.message)
  }
}
const userotpconfirmationpost = function (req, res, next) {
  try {
    const loginotp = req.body.loginotp

    if (loginotp == random) {

      res.redirect('/')
    } else {
      res.redirect('/loginotp')
      errmsg = "invalid otp"
    }

  } catch (error) {
    console.log(error.message)

  }
}

const productDetaile = async function (req, res, next) {
  try {

    res.render('productDetailes', { productview })
  } catch (error) {
    console.log(error.message)
  }


}
const productAccsessget = async function (req, res, next) {
  try {
    const search = req.params.id
    productview = await productinfo.find({ _id: search })

    res.redirect('/productDetails')

  } catch (error) {
    console.log(error.message)

  }
}
const cartManage = async function (req, res, next) {
  try {

    usersession = req.session.user
    if (usersession == null) {
      res.redirect('/login')
    } else {
      const proId = req.params.id
      const userId = req.session.user.name
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
    console.log(error.message)
  }
}
const cartRemove = async function (req, res, next) {
  try {
    const cartId = req.params.id
    await cartInfo.updateOne({ user: req.session.user.name }, { $pull: { product: { item: cartId } } })
    res.redirect('/cart')

  } catch (error) {
    console.log(error.message)
  }
}
const changeQuantity = async function (req, res, next) {

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
    }


    res.json({
      status: true,
      cartElements: cartElements,

    })

  } catch (error) {

    console.log(error.message)

  }
}
const userCheckout = function (req, res, next) {

  try {

    res.redirect('/checkout')
  } catch (error) {
    console.log(error.message)
  }

}

const AddressManage = async function (req, res, next) {
  try {
    user = req.session.user.name

    addressPage = await addressinfo.find({ user: user })
    res.render('userAddress', { addressPage })

  } catch (error) {
    console.log(error.message)
  }
}

const userAddress = async function (req, res, next) {
  try {

    user = req.session.user.name
    let details = req.body
    details.id = uuid()
    console.log(details);


    userExt = await addressinfo.findOne({ user: user })
    if (userExt == null) {

      await addressinfo.insertMany([{ user: req.session.user.name, address: details }])

    } else {
      await addressinfo.updateOne({ user: user }, { $push: { address: details } })
    }




    res.redirect('/userAddress')
  } catch (error) {

    console.log(error.message)
  }
}
const savedAddress = async function (req, res, next) {
  try {
    user = req.session.user.name
    passId = req.params.indexof

    let passAdd = await addressinfo.findOne({ user: user })

    addressPage = passAdd.address[passId]

    res.redirect('/checkout')

  } catch (error) {
    console.log(error.message)
  }
}
const placeorder = function (req, res, next) {
  try {
    res.render('placeOrder')

  } catch (error) {
    console.log(error.message)
  }
}
const proceed = async function (req, res, next) {
  try {

    user = req.session.user.name

    let status = req.body.paymentmethod === "COD" ? "Placed" : "Pending"


    let delivery = {

      name: req.body.name,
      housename: req.body.housename,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      postalCode: req.body.postalcode,
      email: req.body.email,
      phone: req.body.phone,

    }
    payment = req.body.paymentmethod,
      grand_Total = grand_Total,
      user = req.session.user
    products = productCart
    orderdate = new Date().toISOString()
    let delDate = new Date()
    let deliveryDate = new Date(delDate.setDate(delDate.getDate() + 7))
    status = status
    let orderId = uuid()

    if (req.body.paymentmethod === "onlinepayment") {
  const grand_paise=Math.round(grand_Total*100)
  console.log(grand_paise);
      orders = {
        deliveryAddress: delivery,
        paymentMethod: payment,
        grand_Total: grand_paise,
        orderedUser: user,
        products: products,
        date: orderdate,
        orderStatus: status,
        deliveryDate: deliveryDate
      }
      var options = {
        amount:  grand_Total * 100,
        currency: "INR",
        receipt: orderId
      }
      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log(err);
        } else {
          orderinfo.insertMany([orders])
          res.json({ status: true, order: order })
        }
      })
    } else {
      await orderinfo.insertMany([{ deliveryAddress: delivery, paymentMethod: payment, grandTotal: grand_Total, orderedUser: user, products: products, date: orderdate, orderStatus: status, deliveryDate: deliveryDate }])
      res.json({ status: false })
    }
    await cartInfo.deleteOne({ user: req.session.user.name })
  } catch (error) {
    console.log(error.message)
  }
}
const userOrder = async function (req, res, next) {
  const orderId = req.session.user._id
  const userOrders = await orderinfo.aggregate([{ $match: { orderedUser: orderId } },])
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
    console.log(error.message)
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
    console.log(error.message)
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
  console.log(couponId);

  let couponCheck = await couponinfo.findOne({ couponCode: couponId })

  if (couponCheck) {
    const date = new Date().toDateString()

    console.log(date);

    if (date > couponCheck.expireDate) {
      req.session.coupon = couponId

    } else {
      couponError = "invalid Coupon code"
      req.session.couponError = couponError
    }
  } else {
    couponError = "Coupon is alredy used"
    req.session.couponError = couponError
  }
  res.redirect('/cart')
}

paymentVerification = function (req, res, next) {

  console.log(req.body);
  res.redirect('/checkout')

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
  paymentVerification




  // categoryall
}