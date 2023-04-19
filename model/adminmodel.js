const mongoose=require('mongoose')
require('dotenv').config()
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true })
   



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