const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true })

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        require:true
    }
})





const addnewcategory=new mongoose.model("categorydata",categorySchema)
module.exports={addnewcategory}