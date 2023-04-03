const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
mongoose.connect("mongodb://127.0.0.1:27017/menfasion",{ useNewUrlParser: true })

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