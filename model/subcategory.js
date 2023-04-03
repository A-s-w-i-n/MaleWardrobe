const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
mongoose.connect("mongodb://127.0.0.1:27017/menfasion",{ useNewUrlParser: true })


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