const express = require('express')
const app = express()
const multer=require('multer')
const path =require('path')

const bodyParser =require('body-parser')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/productimages")
    },
    filename:function(req,file,cb){
        const name =Date.now()+"-"+file.originalname
        cb(null,name)
    }
})
const upload =multer({storage:storage})

module.exports={upload}