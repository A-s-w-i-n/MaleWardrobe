const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
mongoose.connect("mongodb://127.0.0.1:27017/menfasion",{ useNewUrlParser: true })


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
    }

})



const orderManagement=new mongoose.model("orderdata",orderSchema)

module.exports={orderManagement}