const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true })


const cartSchema=new mongoose.Schema({
    product:{
        type:Array,
        require:true
    },
    user:{
        type:String,
        require:true
    },
    quantity:{
        type:Number,
        require:true
    },
    totalPrice:{
        type:Number,
        require:true

    },
    grandTotal:{
        type:Number,
        require:true
    }
})



const addToCart=new mongoose.model("cartdata",cartSchema).collection
module.exports={addToCart}
