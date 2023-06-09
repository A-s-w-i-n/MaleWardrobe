const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true })

const bannerSchema=new mongoose.Schema({
    bannerName:{
        type:String,
        require:true
    },
    bannerSubName:{
        type:String,
        require:true
    },
    bannerDiscription:{
        type:String,
        require:true
    },
    bannerImage:{
        type:Array,
        require:true
    },
    bannerId:{
        type:String,

    },
    status:{
        type:Boolean,
        require:true
    }
})

const  addBanner=new mongoose.model("bannerdata",bannerSchema).collection
module.exports={addBanner}