const mongoose=require('mongoose')
require('dotenv').config()
mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true })



const couponSchema=new mongoose.Schema({
    couponCode:{
        type:String,
        require:true
    },
    discountPrice:{
        type:Number,
        require:true
    },
    createDate:{
        type:String,
        require:true
    },
    MinimumPrice:{
        type:Number,
        require:true
    },
    expireDate:{
        type:String,
        require:true
    },
    discountType:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        require:true
    }
})



const adminCoupon=new mongoose.model("coupondatas",couponSchema)
module.exports={adminCoupon}