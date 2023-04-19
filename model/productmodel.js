const mongoose=require('mongoose')
require('dotenv').config()
mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true })


const productScema=new mongoose.Schema({
    productName:{
        type:String,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    subCategory:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    stock:{
        type:Number,
        require:true
    },
    brand:{
        type:String,
        require:true
    },
    image:{
        type:Array,
        require:true
    },
    discription:{
        type:String,
        require:true
    },
    productId:{
        type:String,
        require:true
    },
    desableProduct:{
        type:Boolean,
        require:true
    }

})

const addnewproduct=new mongoose.model("productdata",productScema)

module.exports={addnewproduct}