var express = require('express');
const nocache = require('nocache');
const { userlogin } = require('../controller/usercontroller');
var router = express.Router();
const userget = require('../controller/usercontroller')
const session=require('../middleware/session')


router.get('/signup', userget.usersignup);
router.get('/login',session.sessionNotLogin, userget.userlogin)
router.get('/', userget.userhome)
router.get('/shop',session.sessionCheck, userget.usershop)
router.get('/about', userget.userabout)
router.get('/blog', userget.userblog)
router.get('/contact', userget.usercontact)
router.get('/wishlist', userget.userwishlist)
router.get('/cart',session.sessionCheck, userget.usercart)
router.get('/checkout',userget.usercheckout)
router.get('/profile',session.sessionCheck, userget.userprofile)
router.get('/logout', userget.userlogout)
router.get('/signupotp', nocache(), userget.signupotp)
router.get('/usecategory/:category', userget.selectcategory)
router.get('/loginnumber', userget.loginphone)
router.get('/loginotp', userget.otplogin)
router.get('/userhomeotp', userget.loginuserone)
router.get('/productDetails', userget.productDetaile)
router.get('/productAccsess/:id', userget.productAccsessget)
router.get('/cartRemove/:id',userget.cartRemove)
router.get('/checkoutPage',userget.userCheckout)
router.get('/userAddress',userget.AddressManage)
router.get('/savedAddress/:indexof',userget.savedAddress)
router.get('/placeOrder',userget.placeorder)
router.get('/editprofile',userget.editProfile)
router.get('/addressEdit',userget.extAddressEdit)
router.get('/editExstAddress',userget.existAddress)
router.get('/deleteAddress/:id',userget.addressDelete)
router.get('/userOederDetaile',userget.userOrder)


router.post('/updatedAddress',userget.addressUpdate)


// router.get('/allcategory',userget.categoryall)
router.post('/homepage', userget.usersignupval)
router.post('/otpconfirmation', userget.confirmotppost)
router.post('/userhomepage', userget.userloginval)
router.post('/userloginnumber', userget.userphoneconfirmationpost)
router.post('/userotpconfirmation', userget.userotpconfirmationpost)
router.post('/addToCart/:id', userget.cartManage)
router.post('/updateQuantity',userget.changeQuantity)
router.post('/accessAddress',userget.userAddress)
router.post('/proceed',userget.proceed)
router.post('/profileUpdate',userget.updateProfile)
router.post('/searchMethod',userget.search)
router.post('/couponApplay',userget.applyCoupon)
router.post('/verifyPayment',userget.paymentVerification)






module.exports = router;
