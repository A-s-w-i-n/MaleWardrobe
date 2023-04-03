const mongoose=require('mongoose')

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/menfasion",{ useNewUrlParser: true })
   



const adminSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})

const adminlogin=new mongoose.model("admindatas",adminSchema)

module.exports={adminlogin}