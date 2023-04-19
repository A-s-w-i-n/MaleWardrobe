var express = require('express');
var router = express.Router();
const adminsession=require('../middleware/session')
const multer=require('multer')
const multerConfig=require('../middleware/multerImage')

const adminget = require('../controller/admincontroller')


/* GET home page. */
router.get('/admin', adminget.adminlogin);
router.get('/adminhome', adminget.adminhome)
router.get('/adminlogout', adminget.adminlogout)
router.get('/allproducts',adminsession.adminSession,adminget.productall)
router.get('/addproduct',adminsession.adminSession, adminget.productadd)
router.get('/delete/:id',adminsession.adminSession, adminget.productdelete)
router.get('/editproduct/:id',adminsession.adminSession, adminget.productRedirct)
router.get('/editproduct',adminsession.adminSession, adminget.productedit)
router.get('/addcategory',adminsession.adminSession, adminget.categoryadd)
router.get('/subcategory',adminsession.adminSession, adminget.addsubcategory)
router.get('/usermanage',adminsession.adminSession, adminget.manageuser)
router.get('/blockuser/:id',adminsession.adminSession, adminget.block)
router.get('/unblockuser/:id',adminsession.adminSession, adminget.unblock)
router.get('/orderManagement',adminsession.adminSession,adminget.orderManagemnt)
router.get("/adminOrderedProduct",adminsession.adminSession,adminget.adminOrderView)
router.get('/orderProductDetail/',adminsession.adminSession,adminget.orderProductDetail)
router.get('/Banner',adminsession.adminSession,adminget.bannerAdmin)
router.get('/coupon',adminsession.adminSession,adminget.adminCoupon)
router.get('/orderStatus/:id',adminsession.adminSession,adminget.statusOrder)
router.get('/couponEdit/:id',adminsession.adminSession,adminget.editCoupon)
router.post('/updateEdit',adminsession.adminSession,adminget.proceedCouponUpdate)
router.get('/adminReturnConfirm/:id',adminsession.adminSession,adminget.adminConfirmReturn)
router.get('/orderDeliverd/:id',adminsession.adminSession,adminget.deliveredOrder)
router.get('/deleteEditImage/',adminsession.adminSession,adminget.deleteEditImg)
router.get('/adminSalesReport',adminsession.adminSession,adminget.salesReport)
router.get('/salesReports/',adminget.allSalesReport)


// router.get('/deleteuser/:id', adminget.deleteOne)

router.post('/adminhomepage', adminget.adminloginvalidationpost)

router.post('/adminaddproduct',adminsession.adminSession,multerConfig.upload.array('image'), adminget.newproductpost)
router.post('/editnew/:id', adminsession.adminSession,multerConfig.upload.array('image'), adminget.editexistproductpost)
router.post('/add-category', adminsession.adminSession,adminget.newcategoryaddpost)
router.post('/subCategory',adminsession.adminSession, adminget.newsubcategorypost)
router.get('/desable/:id',adminsession.adminSession, adminget.desable)
router.get('/enable/:id',adminsession.adminSession, adminget.enable)
router.get('/subdesable/:id',adminsession.adminSession, adminget.subdesable)
router.get('/subenable/:id',adminsession.adminSession, adminget.subenable)
router.get('/bannerDesable/:id',adminsession.adminSession,adminget.desableBanner)
router.get('/bannerEnable/:id',adminsession.adminSession,adminget.enableBanner)

router.post('/bannerAdd',adminsession.adminSession,multerConfig.upload.array('image'),adminget.addBanner)
router.post('/couponAdd',adminsession.adminSession,adminget.addCoupon)


module.exports = router;







