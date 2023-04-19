var express = require('express');
const nocache = require('nocache');
const { userlogin } = require('../controller/usercontroller');
var router = express.Router();
const userget = require('../controller/usercontroller')
const session=require('../middleware/session')

//sign up & ligin
router.get('/signup', userget.usersignup);
router.get('/login',session.sessionNotLogin, userget.userlogin)

router.post('/homepage', userget.usersignupval)
router.post('/otpconfirmation', userget.confirmotppost)
router.post('/userhomepage', userget.userloginval)
router.post('/userloginnumber', userget.userphoneconfirmationpost)
router.post('/userotpconfirmation', userget.userotpconfirmationpost)







router.get('/', userget.userhome)
router.get('/shop', userget.usershop)

router.get('/wishlist',session.sessionCheck, userget.userwishlist)
router.get('/cart',session.sessionCheck, userget.usercart)
router.get('/checkout',session.sessionCheck,userget.usercheckout)
router.get('/profile',session.sessionCheck, userget.userprofile)
router.get('/logout', userget.userlogout)
router.get('/signupotp', nocache(), userget.signupotp)
router.get('/usecategory/:category', userget.selectcategory)
router.get('/loginnumber', userget.loginphone)
router.get('/loginotp', userget.otplogin)
router.get('/userhomeotp', userget.loginuserone)
router.get('/productDetails',userget.productDetaile)
router.get('/productAccsess/:id',userget.productAccsessget)
router.get('/cartRemove/:id',session.sessionCheck,userget.cartRemove)
router.get('/checkoutPage',session.sessionCheck,userget.userCheckout)
router.get('/userAddress',session.sessionCheck,userget.AddressManage)
router.get('/savedAddress/',session.sessionCheck,userget.savedAddress)
router.get('/placeOrder',session.sessionCheck,userget.placeorder)
router.get('/editprofile',session.sessionCheck,userget.editProfile)
router.get('/addressEdit',session.sessionCheck,userget.extAddressEdit)
router.get('/editExstAddress/:id',session.sessionCheck,userget.existAddress)
router.get('/deleteAddress/:id',session.sessionCheck,userget.addressDelete)
router.get('/userOederDetaile',session.sessionCheck,userget.userOrder)
router.get('/userOrderProduct/',session.sessionCheck,userget.userProductOrder)
// router.get('/userOrderDetails/',session.sessionCheck,userget.userProducrOrderGet)
router.get('/lowToHigh',userget.lowToHighSort)
router.get('/highToLow',userget.highToLowSort)
router.get('/newest',userget.newestFirst)
router.get('/oldest',userget.oldestSort)
router.get('/zeroToOne',userget.priceSortOne)
router.get('/oneToFive',userget.priceSortTwo)
router.get('/fiveToTen',userget.priceSortThree)
router.get('/MoreThen',userget.priceSortFour)
router.get('/pageChange/',userget.changePage)
router.get('/userReturn/:id/:grandTotal',userget.returnUser)
router.get('/orderCancel/:id',userget.cancelOrder)
router.get('/wishlistGet/:id',session.sessionCheck,userget.wishlistGet)
router.get('/wishListDelete/:id',userget.wishProductDel)
router.get('/productAccsessWishlist/:id',userget.wishListDetail)
router.get('/walletHistory',userget.userWalletHistory)
// router.get('/wishlisstProductAccsess/:id',userget.wishlistProductView)







router.post('/updatedAddress',userget.addressUpdate)

// router.get('/allcategory',userget.categoryall)
router.post('/review',userget.userReview)
router.post('/addToCart/:id',session.sessionCheck, userget.cartManage)
router.post('/updateQuantity',session.sessionCheck,userget.changeQuantity)
router.post('/accessAddress',session.sessionCheck,userget.userAddress)
router.post('/proceed',session.sessionCheck,userget.proceed)
router.post('/profileUpdate',session.sessionCheck,userget.updateProfile)
router.post('/searchMethod',session.sessionCheck,userget.search)
router.post('/couponApplay',session.sessionCheck,userget.applyCoupon)
router.post('/verifyPayment',userget.paymentVerification)






module.exports = router;
