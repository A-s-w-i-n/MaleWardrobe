const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true })


const subcategorySchema=new mongoose.Schema({
    subName:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        require:true

    }
})





const addsubcategory=new mongoose.model("subcategorydata",subcategorySchema)
module.exports={addsubcategory}