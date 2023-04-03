const mongoose=require('mongoose')

mongoose.set('strictQuery',false)
mongoose.connect("mongodb://127.0.0.1:27017/menfasion",{ useNewUrlParser: true })



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