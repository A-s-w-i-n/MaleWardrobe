const  mongoose= require("mongoose")
require('dotenv').config()
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true })


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        require:true
    },
    usedCoupon:{
        type:String,
        require:true
    },
    userUsedCoupon:{
        type:String,
        require:true
    },
    wallet:{
        type:Number,
        require:true
    }
   
})


const usersignin=new mongoose.model("userdata",userSchema)
module.exports={usersignin}