const mongoose=require('mongoose')

mongoose.set('strictQuery',false)

mongoose.connect("mongodb://127.0.0.1:27017/menfasion",{useNewUrlParser: true}) 


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