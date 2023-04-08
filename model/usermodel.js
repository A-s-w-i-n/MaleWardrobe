const  mongoose= require("mongoose")

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/menfasion",{ useNewUrlParser: true })


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
    }

})


const usersignin=new mongoose.model("userdata",userSchema)
module.exports={usersignin}