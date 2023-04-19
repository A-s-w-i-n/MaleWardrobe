const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true })


const orderSchema=new mongoose.Schema({
    orderedUser:{
        type:String,
        require:true
    },
    deliveryAddress:{
        name:{
            type:String
        },
        housename:{
            type:String
        },
        phone:{
            type:Number
        },
        postalCode:{
            type:Number
        },
        city:{
            type:String
        },
        country:{
            type:String
        },
        state:{
            type:String
        },
        email:{
            type:String
        }
    },
    grandTotal:{
        type:Number,
        require:true

    },
    products:{
        type:Array,
        require:true
    },
    paymentMethod:{
        type:String,
        require:true
    },
    date:{
        type:String,
        require:true
    },
    orderStatus:{
        type:String,
        require:true
    },
    deliveryDate:{
        type:String,
        require:true
    },
    newReturnStats:{
        type:String,
        require:true
    },
    ConfirmReturnStatus:{
        type:String,
        require:true
    },
    deliveredStatus:{
        type:String,
        require:true
    },
    userUsedCoupon:{
        type:String,
        require:true
    },
    salesDate:{
        type:String,
        require:true
        
    },
    returnDate:{
        type:String,
        require:true
    },
    cancelStatus:{
        type:String,
        require:true
    }



})



const orderManagement=new mongoose.model("orderdata",orderSchema)

module.exports={orderManagement}