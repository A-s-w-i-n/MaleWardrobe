const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
require('dotenv').config()


mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true })

const wishlistSchema=new mongoose.Schema({

    wishlistProduct:{
        type:Array,
        require:true
    },
    user:{
      type:  String,
      require:true,
    },
    quantity:{
        type:Number,
        require:true
    }

})

const addToWishList=new mongoose.model("wishlistdatas",wishlistSchema).collection

module.exports={addToWishList}