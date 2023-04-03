var express = require('express');
var router = express.Router();

const adminget = require('../controller/admincontroller')


/* GET home page. */
router.get('/admin', adminget.adminlogin);
router.get('/adminhome', adminget.adminhome)
router.get('/adminlogout', adminget.adminlogout)
router.get('/allproducts', adminget.productall)
router.get('/addproduct', adminget.productadd)
router.get('/delete/:id', adminget.productdelete)
router.get('/editproduct/:id', adminget.productRedirct)
router.get('/editproduct', adminget.productedit)
router.get('/addcategory', adminget.categoryadd)
router.get('/subcategory', adminget.addsubcategory)
router.get('/usermanage', adminget.manageuser)
router.get('/blockuser/:id', adminget.block)
router.get('/unblockuser/:id', adminget.unblock)
router.get('/orderManagement',adminget.orderManagemnt)
router.get("/adminOrderedProduct",adminget.adminOrderView)
router.get('/orderProductDetail/:id',adminget.orderProductDetail)
router.get('/Banner',adminget.bannerAdmin)
router.get('/coupon',adminget.adminCoupon)

// router.get('/deleteuser/:id', adminget.deleteOne)

router.post('/adminhomepage', adminget.adminloginvalidationpost)

router.post('/adminaddproduct', adminget.newproductpost)
router.post('/editnew/:id', adminget.editexistproductpost)
router.post('/add-category', adminget.newcategoryaddpost)
router.post('/subCategory', adminget.newsubcategorypost)
router.get('/desable/:id', adminget.desable)
router.get('/enable/:id', adminget.enable)
router.get('/subdesable/:id', adminget.subdesable)
router.get('/subenable/:id', adminget.subenable)
router.get('/bannerDesable/:id',adminget.desableBanner)
router.get('/bannerEnable/:id',adminget.enableBanner)

router.post('/bannerAdd',adminget.addBanner)
router.post('/couponAdd',adminget.addCoupon)


module.exports = router;







