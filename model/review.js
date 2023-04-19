const mongoose=require('mongoose')
require('dotenv').config()
mongoose.set('strictQuery',false)

mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true })


const reviewSchema=new mongoose.Schema({
    user:{
        type:String,
        require:true
    },
    review:{
        type:Array,
        require:true
    },
    productId:{
        type:String,
        require:true
    }
})

const productReview=new mongoose.model("review",reviewSchema)
module.exports={productReview}