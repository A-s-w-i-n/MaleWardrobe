const mongoose=require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery',false)

mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true}) 


const addressSchema=new mongoose.Schema({
    user:{
        type:String,
        require:true
    },
    address:{
        type:Array,
    require:true
    }
})


const addnewAddress=new mongoose.model("addressdata",addressSchema)
module.exports={addnewAddress}